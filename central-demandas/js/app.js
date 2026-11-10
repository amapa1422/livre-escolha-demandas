/* LivreEscolha · Central de Demandas — sem dependências.
 * Seções: configuração, armazenamento, renderização, modais, imagens, eventos.
 * O formato dos registros e as chaves do protótipo são mantidos.
 */
(async function () {
  'use strict';

  const api = window.LivreEscolhaAPI;
  const appScript = document.currentScript.src;
  if (!api && location.protocol !== 'file:') {
    document.getElementById('board').textContent = 'Não foi possível carregar a conexão segura. Recarregue a página.';
    document.getElementById('openModal').disabled = true;
    return;
  }
  if (api) {
    try { await api.ready; }
    catch (error) {
      document.getElementById('board').textContent = error.message;
      document.getElementById('openModal').disabled = true;
      return;
    }
  }

  // Gera um UUID v4 compatível com HTTP na rede local
function gerarUUID() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, byte =>
    byte.toString(16).padStart(2, '0')
  ).join('');

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32)
  ].join('-');
}

  // 1 · Configuração e estado
  const KEY = 'livre_escolha_demandas_demo_v1';
  const SIDEBAR_KEY = 'demandas_sidebar_closed';
  const MAX_IMAGE_BYTES = 1024 * 1024;
  const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
  const assetBase = new URL('../assets/clientes/', appScript);
  const normalizeClient = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  // catalogo.js é gerado de clientes.json: funciona também ao abrir via file://.
  const clientCatalog = (Array.isArray(window.LivreEscolhaClientes) ? window.LivreEscolhaClientes : [])
    .filter(client => client && typeof client.id === 'string' && typeof client.nome === 'string'
      && typeof client.logo === 'string' && /^logos\/[a-z0-9-]+\.(webp|png|jpg|jpeg)$/.test(client.logo))
    .map(client => ({ ...client, nome_normalizado: normalizeClient(client.nome) }));
  const clientsById = new Map(clientCatalog.map(client => [client.id, client]));
  delete window.LivreEscolhaClientes;
  const statuses = {
    pendente: ['Pendente', 'pending'],
    andamento: ['Em andamento', 'working'],
    lancada: ['Lançada', 'done']
  };
  const initial=[
    {id:1045,client:'Empresa Horizonte',category:'CANCELAMENTO',requester:'Mariana',priority:'Alta',description:'Solicitação de cancelamento de uma linha móvel. Verificar possíveis encargos.',status:'pendente',assignee:'',created:Date.now()-12*60000,image:''},
    {id:1044,client:'Sicoob • Unidade Centro',category:'CONSULTA DE FIDELIDADE',requester:'Lucas',priority:'Normal',description:'Consultar vigência de contrato e eventual multa de fidelidade.',status:'andamento',assignee:'Felipe',created:Date.now()-35*60000,image:''},
    {id:1043,client:'Empresa Alfa',category:'MUDANÇA',requester:'Carolina',priority:'Normal',description:'Cliente solicita avaliação de upgrade de dados móveis.',status:'lancada',assignee:'Ana',created:Date.now()-65*60000,image:''},
    {id:1042,client:'Unidade Comercial Norte',category:'TRANSFERÊNCIA DE TITULARIDADE',requester:'Rafael',priority:'Alta',description:'Link fixo apresentando instabilidade. Necessário acompanhamento.',status:'pendente',assignee:'',created:Date.now()-110*60000,image:''},
    {id:1041,client:'Grupo Batista',category:'CONSULTA DE FIDELIDADE',requester:'Juliana',priority:'Normal',description:'Consulta de prazo contratual de serviço de internet.',status:'lancada',assignee:'Pedro',created:Date.now()-220*60000,image:''}
  ];
  const $ = id => document.getElementById(id);
  const ui = Object.fromEntries([
    'board', 'total', 'pending', 'working', 'done', 'showing', 'search',
    'typeFilter', 'sort', 'notice', 'createForm', 'client', 'category',
    'requester', 'urgency', 'description', 'attachment', 'detailContent',
    'detailId', 'agent', 'zoomImage', 'toggleSidebar', 'openModal', 'clientSuggestions'
  ].map(id => [id, $(id)]));
  const categories = Array.from(ui.category.options, option => option.value).filter(Boolean);
  if (api) {
    const allowedUsers = api.user.papel === 'admin' ? api.users : api.users.filter(user => user.id === api.user.id);
    ui.agent.replaceChildren(new Option('Selecione o responsável', ''), ...allowedUsers.map(user => new Option(user.nome, user.id)));
    const logout = document.createElement('button');
    logout.className = 'button'; logout.textContent = 'Sair'; logout.type = 'button';
    logout.title = `Conectado como ${api.user.nome}`;
    logout.addEventListener('click', () => api.logout().catch(error => notify(error.message)));
    document.querySelector('.actions').append(logout);
  }
  const agents = Array.from(ui.agent.options, option => option.value).filter(Boolean);
  const tabButtons = [...document.querySelectorAll('.tab')];
  const overlays = [...document.querySelectorAll('.overlay')];
  const app = document.querySelector('.app');
  const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
  });
  const date = value => dateFormatter.format(new Date(value));
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));
  let tab = 'todos';
  let currentView = 'dashboard';
  let dashboardPeriod = 7;
  let dashboardDirty = true;
  let dashboardKey = '';
  const chartContents = new Map();
  let boardKey = '';
  let searchTimer;
  let dataLoaded = !api;
  let assumeId = null;
  let detailId = null;
  let editOriginal = null;
  let editSaving = false;
  let editImageRemoved = false;
  let noticeTimer;
  let submitting = false;
  let createVersion = 0;
  let storageState = 'ready';
  let selectedClient = null;
  let suggestions = [];
  let activeSuggestion = -1;

  function hideSuggestions() {
    ui.clientSuggestions.hidden = true;
    ui.client.setAttribute('aria-expanded', 'false');
    ui.client.removeAttribute('aria-activedescendant');
    activeSuggestion = -1;
  }

  function suggestClients() {
    const query = normalizeClient(ui.client.value);
    suggestions = query ? clientCatalog.filter(client => client.nome_normalizado.includes(query)) : [];
    activeSuggestion = -1;
    ui.client.removeAttribute('aria-activedescendant');
    ui.clientSuggestions.innerHTML = suggestions.map((client, index) =>
      `<li id="client-option-${index}" role="option" aria-selected="false" data-index="${index}">${escapeHtml(client.nome)}</li>`).join('');
    ui.clientSuggestions.hidden = !suggestions.length;
    ui.client.setAttribute('aria-expanded', String(Boolean(suggestions.length)));
  }

  function chooseClient(index) {
    const client = suggestions[index];
    if (!client) return;
    selectedClient = client;
    ui.client.value = client.nome;
    ui.client.focus();
    hideSuggestions();
  }

  function clientLogo(item) {
    const client = clientsById.get(item.clientId);
    // Nunca inferir a empresa de registros antigos ou confiar em URLs do localStorage.
    if (!client || normalizeClient(item.client) !== client.nome_normalizado) return '';
    return `<img class="client-logo" src="${escapeHtml(new URL(client.logo, assetBase).href)}" alt="" width="32" height="24" loading="lazy" decoding="async" />`;
  }

  function notify(message) {
    ui.notice.textContent = message;
    ui.notice.classList.add('show');
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => ui.notice.classList.remove('show'), 3500);
  }

  // 2 · Persistência: só atualiza a memória e a tela após gravar com sucesso.
  function validRecord(item) {
    return item && typeof item === 'object' && !Array.isArray(item)
      && Number.isSafeInteger(item.id) && item.id > 0 && item.id < Number.MAX_SAFE_INTEGER
      && Number.isFinite(item.created) && !Number.isNaN(new Date(item.created).getTime())
      && Object.hasOwn(statuses, item.status)
      && ['client', 'category', 'requester', 'priority', 'description', 'assignee', 'image']
        .every(key => typeof item[key] === 'string');
  }

  function load() {
    let raw;
    try {
      raw = localStorage.getItem(KEY);
    } catch {
      storageState = 'unavailable';
      notify('Não foi possível acessar os dados deste navegador. Reabra a página com o armazenamento habilitado.');
      return [];
    }
    if (raw === null) return initial.map(item => ({ ...item }));
    try {
      const records = JSON.parse(raw);
      if (!Array.isArray(records)) throw new Error('Formato inválido');
      const ids = new Set();
      const valid = records.filter(item => {
        if (!validRecord(item) || ids.has(item.id)) return false;
        ids.add(item.id);
        return true;
      });
      if (valid.length !== records.length) {
        storageState = 'corrupt';
        notify('Há registros inválidos. Os dados originais foram preservados; alterações estão bloqueadas.');
      }
      return valid;
    } catch {
      storageState = 'corrupt';
      notify('Não foi possível ler os registros. Os dados originais foram preservados; alterações estão bloqueadas.');
      return [];
    }
  }

  let data = api ? [] : load();
  let refreshRequested = false;
  let refreshing = false;
  let refreshCompletion;
  async function refresh() {
    if (!api) return;
    refreshRequested = true;
    if (refreshing) return refreshCompletion;
    refreshing = true;
    let complete;
    let succeeded = false;
    refreshCompletion = new Promise(resolve => { complete = resolve; });
    try {
      while (refreshRequested) {
        refreshRequested = false;
        data = await api.list();
        dataLoaded = true; dashboardDirty = true;
        renderMetrics(); render();
        if (modalStack.includes('detailOverlay')) {
          const current = data.find(item => item.id === detailId);
          if (current) showDetails(current); else close('detailOverlay');
        }
      }
      succeeded = true;
      return true;
    } catch (error) {
      $('dashboardStatus').hidden = false;
      $('dashboardStatus').textContent = dataLoaded ? 'Não foi possível atualizar. Exibindo a última consulta recebida.' : 'Não foi possível carregar os indicadores. Verifique a conexão.';
      notify(error.message); return false;
    }
    finally { refreshing = false; complete(succeeded); }
  }

  function save(next) {
    if (storageState !== 'ready') {
      notify('Os dados não podem ser alterados com segurança. Verifique o armazenamento e reabra a página.');
      return false;
    }
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      data = next;
      dashboardDirty = true;
      storageState = 'ready';
      renderMetrics();
      return true;
    } catch (error) {
      notify(error.name === 'QuotaExceededError'
        ? 'Sem espaço no navegador para salvar a imagem. Tente uma imagem menor.'
        : 'Não foi possível salvar no navegador. Nenhuma alteração foi aplicada.');
      return false;
    }
  }

  // 3 · Renderização: pesquisa instantânea; indicadores só mudam com os dados.
  function renderMetrics() {
    if (currentView !== 'dashboard' || !dataLoaded || !dashboardDirty) return;
    dashboardDirty = false;
    const summary = window.LivreEscolhaDashboard.summarize(data, dashboardPeriod);
    const key = JSON.stringify(summary);
    $('dashboardStatus').hidden = summary.total > 0;
    $('dashboardStatus').textContent = 'Nenhuma demanda criada neste período.';
    $('dashboardScope').textContent = `${summary.points[0].label} a ${summary.points.at(-1).label} · criação no horário de Brasília${api ? '' : ' · dados locais deste navegador'}`;
    if (key === dashboardKey) return;
    dashboardKey = key;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    function animate(element, scale = false) {
      if (!reduced && element.animate) element.animate([{ opacity: .35, transform: scale ? 'scaleY(.94)' : 'translateY(5px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'ease-out' });
    }
    for (const [id, value] of [['total', summary.total], ['pending', summary.counts[0]], ['working', summary.counts[1]], ['done', summary.counts[2]], ['completionRate', summary.rate + '%']]) {
      const element = $(id), text = String(value);
      if (element.textContent !== text) { element.textContent = text; animate(element); }
    }
    for (const [id, method] of [['dailyChart', 'daily'], ['completionChart', 'completion'], ['evolutionChart', 'evolution'], ['statusChart', 'distribution'], ['dashboardTable', 'table']]) {
      const element = $(id), html = window.LivreEscolhaDashboard[method](summary);
      if (chartContents.get(id) !== html) {
        element.innerHTML = html; chartContents.set(id, html);
        if (id !== 'dashboardTable') animate(element, true);
        if (!reduced) {
          const ring = element.querySelector('.ring-progress');
          if (ring?.animate) ring.animate([{ strokeDasharray: '0 377' }, { strokeDasharray: ring.getAttribute('stroke-dasharray') }], { duration: 420, easing: 'ease-out' });
          for (const bar of element.querySelectorAll('.status-fill')) bar.animate?.([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 350, easing: 'ease-out' });
        }
      }
    }
    $('dashboardInsight').textContent = `${summary.counts[2]} de ${summary.total} demandas lançadas · ${summary.counts[1]} em andamento · ${summary.counts[0]} pendentes`;
  }

  function setTab(value) {
    if (value !== 'todos' && !Object.hasOwn(statuses, value)) return;
    navigate(value);
  }

  function navigate(page) {
    const labels = { dashboard: ['Dashboard', 'Visão geral da equipe e dos atendimentos.'], todos: ['Todas as demandas', 'Gerencie as solicitações da equipe.'], pendente: ['Pendentes', 'Solicitações aguardando responsável.'], andamento: ['Em andamento', 'Casos assumidos pela equipe.'], lancada: ['Lançadas', 'Atendimentos finalizados e registrados.'] };
    if (!Object.hasOwn(labels, page)) return;
    clearTimeout(searchTimer);
    const changed = currentView !== page;
    currentView = page;
    $('dashboardView').hidden = page !== 'dashboard';
    $('demandasView').hidden = page === 'dashboard';
    ui.openModal.hidden = page === 'dashboard';
    $('pageTitle').textContent = labels[page][0]; $('pageSubtitle').textContent = labels[page][1];
    for (const button of document.querySelectorAll('[data-page]')) {
      const active = button.dataset.page === page;
      button.classList.toggle('active', active);
      if (active) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current');
      button.setAttribute('aria-label', button.title);
    }
    if (page === 'dashboard') {
      dashboardDirty = true; renderMetrics();
      return;
    }
    if (changed) boardKey = '';
    tab = page;
    for (const button of tabButtons) {
      const active = button.dataset.tab === tab;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    }
    render();
  }

  function ticket(item) {
    const [label, statusClass] = statuses[item.status];
    return `<article class="ticket"><div><div class="ticket-top"><span class="id">#${item.id}</span><span class="badge ${statusClass}">${label}</span>${item.priority === 'Alta' ? '<span class="badge priority">⚑ Alta prioridade</span>' : ''}</div><h3>${escapeHtml(item.category)} <span class="ticket-separator">•</span> ${clientLogo(item)}${escapeHtml(item.client)}</h3><p>${escapeHtml(item.description || 'Sem descrição adicional.')}</p><div class="details"><span>◉ Solicitado por: <strong>${escapeHtml(item.requester)}</strong></span><span>◷ ${date(item.created)}</span><span>♙ Responsável: <strong>${escapeHtml(item.assignee || 'Não atribuído')}</strong></span>${item.image ? '<span>▧ Print anexado</span>' : ''}</div></div><div class="ticket-actions">${item.status === 'pendente' ? `<button type="button" class="mini" data-action="assume" data-id="${item.id}">👍 Assumir caso</button>` : ''}${item.status === 'andamento' ? `<button type="button" class="mini finish" data-action="finish" data-id="${item.id}">✓ Marcar lançada</button>` : ''}<button type="button" class="mini secondary" data-action="detail" data-id="${item.id}">Ver detalhes →</button></div></article>`;
  }

  function render() {
    if (currentView === 'dashboard') return;
    const focusedAction = ui.board.contains(document.activeElement)
      ? document.activeElement.closest('[data-id]') : null;
    const focusedId = focusedAction?.dataset.id;
    const focusedType = focusedAction?.dataset.action;
    const query = ui.search.value.trim().toLowerCase();
    const type = ui.typeFilter.value;
    const sort = ui.sort.value;
    const list = data.filter(item => (tab === 'todos' || item.status === tab)
      && (!type || item.category === type)
      && (!query || [item.client, item.category, item.requester, item.assignee,
        item.description, String(item.id)].join(' ').toLowerCase().includes(query)));
    list.sort((a, b) => sort === 'old' ? a.created - b.created
      : sort === 'priority' ? (b.priority === 'Alta') - (a.priority === 'Alta') || b.created - a.created
        : b.created - a.created);
    ui.showing.textContent = `${list.length} demanda${list.length === 1 ? '' : 's'}`;
    const key = JSON.stringify(list.map(item => [item.id, item.client, item.clientId, item.category, item.requester,
      item.priority, item.description, item.status, item.assignee, item.created, Boolean(item.image)]));
    if (key === boardKey) return;
    boardKey = key;
    ui.board.innerHTML = list.length ? list.map(ticket).join('')
      : '<div class="empty"><div class="empty-symbol">▤</div><h3>Nenhuma demanda encontrada</h3><p>Altere os filtros ou cadastre uma nova solicitação.</p></div>';
    if (focusedId) {
      const nextFocus = ui.board.querySelector(`[data-id="${focusedId}"][data-action="${focusedType}"]`)
        || ui.board.querySelector(`[data-id="${focusedId}"]`) || ui.openModal;
      nextFocus.focus({ preventScroll: true });
    }
  }

  // 4 · Modais: foco contido, retorno ao acionador e conteúdo de fundo inerte.
  const modalStack = [];
  const focusReturns = new Map();
  const focusableSelector = 'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]';

  function syncModalAccess() {
    const top = modalStack.at(-1);
    app.inert = Boolean(top);
    for (const overlay of overlays) overlay.inert = overlay.id !== top;
  }

  function open(id) {
    if (modalStack.includes(id)) return;
    focusReturns.set(id, document.activeElement);
    modalStack.push(id);
    $(id).classList.add('show');
    syncModalAccess();
    $(id).querySelector(focusableSelector)?.focus();
  }

  function close(id) {
    if (editSaving && ['editOverlay', 'detailOverlay'].includes(id)) return;
    const index = modalStack.indexOf(id);
    if (index < 0) return;
    const wasTop = index === modalStack.length - 1;
    modalStack.splice(index, 1);
    $(id).classList.remove('show');
    if (id === 'createOverlay') { createVersion++; hideSuggestions(); }
    if (id === 'zoomOverlay') ui.zoomImage.removeAttribute('src');
    if (id === 'editOverlay') { editOriginal = null; $('editForm').reset(); }
    syncModalAccess();
    const previous = focusReturns.get(id);
    focusReturns.delete(id);
    if (wasTop) {
      if (previous?.isConnected && !previous.closest('[inert]')) previous.focus();
      else if (modalStack.length) $(modalStack.at(-1)).querySelector(focusableSelector)?.focus();
      else ui.openModal.focus();
    }
  }

  // 5 · Imagens: formato, tamanho, assinatura e decodificação antes de salvar.
  function safeImageSource(source) {
    if (api) return api.isImageUrl(source) ? source : '';
    return typeof source === 'string'
      && source.length <= Math.ceil(MAX_IMAGE_BYTES / 3) * 4 + 40
      && /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(source)
      ? source : '';
  }

  async function readImage(file) {
    if (file.size > MAX_IMAGE_BYTES) throw new Error('Escolha um print de até 1 MB.');
    if (!IMAGE_TYPES.includes(file.type)) throw new Error('Use imagem PNG, JPG ou WebP.');
    const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    const matches = file.type === 'image/png'
      ? [137, 80, 78, 71, 13, 10, 26, 10].every((byte, i) => header[i] === byte)
      : file.type === 'image/jpeg' ? header[0] === 255 && header[1] === 216 && header[2] === 255
        : String.fromCharCode(...header.slice(0, 4)) === 'RIFF'
          && String.fromCharCode(...header.slice(8, 12)) === 'WEBP';
    if (!matches) throw new Error('O arquivo não é uma imagem PNG, JPG ou WebP válida.');
    const source = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reader.onabort = () => reject(new Error('Não foi possível ler o print. Selecione o arquivo novamente.'));
      reader.readAsDataURL(file);
    });
    const image = new Image();
    image.src = source;
    try {
      await image.decode();
    } catch {
      throw new Error('Não foi possível abrir o print. Selecione uma imagem válida.');
    }
    // Sem redimensionar: textos e números mantêm todos os pixels da resolução original.
    // Canvas WebP com qualidade máxima; só mantém a conversão se economizar pelo menos 10%.
    if (file.type !== 'image/webp' && image.naturalWidth * image.naturalHeight <= 16000000) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        canvas.getContext('2d').drawImage(image, 0, 0);
        const optimized = canvas.toDataURL('image/webp', 1);
        if (optimized.startsWith('data:image/webp;') && optimized.length < source.length * 0.9) return optimized;
      } catch { /* Conversão opcional: preservar o original validado. */ }
    }
    return source;
  }

  function showDetails(item) {
    detailId = item.id;
    $('editDemand').hidden = !api || !['admin', 'funcionario'].includes(api.user.papel);
    ui.detailId.textContent = `Demanda #${item.id} • Criada em ${date(item.created)}`;
    const lines = [
      ['Cliente', item.client], ['Tipo', item.category], ['Solicitado por', item.requester],
      ['Responsável', item.assignee || 'Ainda não assumida'], ['Status', statuses[item.status][0]],
      ['Prioridade', item.priority], ['Descrição', item.description || 'Sem observações.']
    ];
    const source = safeImageSource(item.image);
    ui.detailContent.innerHTML = lines.map(([label, value]) =>
      `<div class="detail-line"><b>${label}:</b> ${label === 'Cliente' ? clientLogo(item) : ''}${escapeHtml(value)}</div>`).join('')
      + (source ? '<div class="detail-line"><b>Print da solicitação:</b><div class="image-preview-wrap"><button type="button" class="zoom-hint" aria-label="Ampliar print">⌕ Ampliar imagem</button><img class="preview-image zoomable" title="Clique para ampliar" alt="Print anexado à demanda" tabindex="0" role="button" aria-label="Ampliar print" /></div></div>'
        : `<p class="hint">${item.image ? 'Não foi possível exibir o print anexado.' : 'Nenhum print anexado.'}</p>`)
      + `<div class="form-foot">${api ? '<button type="button" class="button" id="showHistory">Histórico</button>' : ''}${!api || api.user.papel === 'admin' ? '<button type="button" class="button" id="removeDemand">Excluir demanda</button>' : ''}</div>`
      + '<div id="demandHistory"></div>';
    if (source) ui.detailContent.querySelector('.zoomable').src = source;
    open('detailOverlay');
  }

  function zoom() {
    const photo = ui.detailContent.querySelector('.zoomable');
    if (photo) {
      ui.zoomImage.src = photo.src;
      open('zoomOverlay');
    }
  }

  // 6 · Eventos registrados uma única vez; ações dos cartões usam delegação.
  ui.client.addEventListener('input', () => { selectedClient = null; suggestClients(); });
  ui.client.addEventListener('focus', suggestClients);
  ui.client.addEventListener('blur', hideSuggestions);
  ui.clientSuggestions.addEventListener('pointerdown', event => event.preventDefault());
  ui.clientSuggestions.addEventListener('click', event => {
    const option = event.target.closest('[data-index]');
    if (option) chooseClient(Number(option.dataset.index));
  });
  ui.client.addEventListener('keydown', event => {
    if (event.isComposing) return;
    if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
      if (ui.clientSuggestions.hidden) suggestClients();
      if (!suggestions.length) return;
      event.preventDefault();
      activeSuggestion = (activeSuggestion + (event.key === 'ArrowDown' ? 1 : activeSuggestion < 0 ? 0 : -1) + suggestions.length) % suggestions.length;
      [...ui.clientSuggestions.children].forEach((option, index) => option.setAttribute('aria-selected', String(index === activeSuggestion)));
      const option = ui.clientSuggestions.children[activeSuggestion];
      ui.client.setAttribute('aria-activedescendant', option.id);
      option.scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'Enter' && !ui.clientSuggestions.hidden && activeSuggestion >= 0) {
      event.preventDefault();
      chooseClient(activeSuggestion);
    } else if (event.key === 'Escape' && !ui.clientSuggestions.hidden) {
      event.preventDefault();
      event.stopPropagation();
      hideSuggestions();
    } else if (event.key === 'Tab') hideSuggestions();
  });
  ui.createForm.addEventListener('reset', () => { selectedClient = null; hideSuggestions(); });
  // Oculta apenas a logo defeituosa, mantendo espaço reservado e o nome legível.
  document.addEventListener('error', event => {
    if (event.target instanceof HTMLImageElement && event.target.classList.contains('client-logo')) {
      event.target.style.visibility = 'hidden';
    }
  }, true);
  function startEdit(item) {
    if (!api || !item || editSaving) return;
    editOriginal = { ...item };
    $('editForm').reset();
    for (const [field, key] of [['editClient', 'client'], ['editCategory', 'category'],
      ['editRequester', 'requester'], ['editUrgency', 'priority'], ['editDescription', 'description']]) {
      $(field).value = item[key];
    }
    editImageRemoved = false;
    $('editImageState').textContent = item.image ? 'Print atual mantido.' : 'Nenhum print anexado.';
    $('editRemoveImage').hidden = !item.image;
    $('editConflict').hidden = true; $('editReload').hidden = true;
    $('editForm').querySelector('[type="submit"]').disabled = false;
    open('editOverlay');
  }
  $('editDemand').addEventListener('click', () => startEdit(data.find(item => item.id === detailId)));
  $('editAttachment').addEventListener('change', () => {
    editImageRemoved = false;
    $('editImageState').textContent = $('editAttachment').files.length ? 'Novo print selecionado.' : (editOriginal?.image ? 'Print atual mantido.' : 'Nenhum print anexado.');
    $('editRemoveImage').hidden = !editOriginal?.image && !$('editAttachment').files.length;
  });
  $('editRemoveImage').addEventListener('click', () => {
    editImageRemoved = true; $('editAttachment').value = '';
    $('editImageState').textContent = 'O print será removido ao salvar.';
    $('editRemoveImage').hidden = true;
  });
  $('editReload').addEventListener('click', async () => {
    if (editSaving) return;
    const id = editOriginal?.id;
    $('editReload').disabled = true;
    try {
      if (!await refresh()) return;
      const current = data.find(item => item.id === id);
      if (current) startEdit(current); else { close('editOverlay'); notify('Demanda indisponível.'); }
    } finally { $('editReload').disabled = false; }
  });
  $('editForm').addEventListener('submit', async event => {
    event.preventDefault();
    if (!api || editSaving || !editOriginal || !$('editConflict').hidden || !event.target.reportValidity()) return;
    const original = editOriginal;
    const values = { client: $('editClient').value.trim(), category: $('editCategory').value,
      requester: $('editRequester').value.trim(), priority: $('editUrgency').value,
      description: $('editDescription').value.trim() };
    if (!values.client || !values.requester || !categories.includes(values.category)
        || !['Normal', 'Alta'].includes(values.priority)) { notify('Preencha os campos obrigatórios.'); return; }
    const file = $('editAttachment').files[0];
    const imageAction = file ? 'substituir' : editImageRemoved && original.image ? 'remover' : 'manter';
    if (Object.keys(values).every(key => values[key] === original[key]) && imageAction === 'manter') {
      close('editOverlay'); return;
    }
    editSaving = true;
    const controls = [...$('editOverlay').querySelectorAll('button,input,select,textarea')];
    controls.forEach(control => { control.disabled = true; });
    let conflict = false;
    try {
      const source = file ? await readImage(file) : '';
      const result = await api.edit(original.id, original.version, values,
        { action: imageAction, source, name: file?.name, key: gerarUUID() });
      editSaving = false;
      close('editOverlay');
      const updated = await refresh();
      notify(!updated ? 'Demanda salva. Não foi possível atualizar a tela; recarregue os dados.'
        : result?.alterada === false ? 'Nenhuma alteração necessária.' : 'Demanda atualizada com sucesso.');
    } catch (error) {
      conflict = error.code === '40001';
      if (conflict) { $('editConflict').hidden = false; $('editReload').hidden = false; }
      notify(error.message || 'Não foi possível salvar. Tente novamente.');
    } finally {
      editSaving = false;
      controls.forEach(control => { control.disabled = false; });
      if (conflict) $('editForm').querySelector('[type="submit"]').disabled = true;
    }
  });
  ui.openModal.addEventListener('click', () => open('createOverlay'));
  for (const overlay of overlays) {
    overlay.addEventListener('click', event => {
      const button = event.target.closest('[data-close]');
      if (button) close(button.dataset.close);
      else if (event.target === overlay) close(overlay.id);
    });
  }
  document.addEventListener('keydown', event => {
    if (!modalStack.length) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      // Mantém o comportamento aprovado: ESC fecha todos os overlays.
      [...modalStack].reverse().forEach(close);
    } else if (event.key === 'Tab') {
      const controls = [...$(modalStack.at(-1)).querySelectorAll(focusableSelector)]
        .filter(element => element.getClientRects().length);
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  });
  for (const container of document.querySelectorAll('.tabs, .nav')) {
    container.addEventListener('click', event => {
      const button = event.target.closest('[data-tab]');
      if (button) setTab(button.dataset.tab);
      const page = event.target.closest('[data-page]');
      if (page) navigate(page.dataset.page);
    });
  }
  ui.search.addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(render, 140); });
  for (const id of ['typeFilter', 'sort']) ui[id].addEventListener('change', () => { clearTimeout(searchTimer); render(); });
  document.querySelector('.period-switch').addEventListener('click', event => {
    const button = event.target.closest('[data-range]');
    if (!button || dashboardPeriod === Number(button.dataset.range)) return;
    dashboardPeriod = Number(button.dataset.range); dashboardDirty = true;
    for (const control of document.querySelectorAll('[data-range]')) {
      const active = control === button; control.classList.toggle('active', active); control.setAttribute('aria-pressed', String(active));
    }
    renderMetrics();
  });

  ui.createForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting || !ui.createForm.reportValidity()) return;
    const values = {
      client: ui.client.value.trim(), category: ui.category.value,
      requester: ui.requester.value.trim(), priority: ui.urgency.value,
      description: ui.description.value.trim()
    };
    if (!values.client || !values.requester || !categories.includes(values.category)) {
      notify('Preencha cliente, tipo de demanda e solicitado por.');
      return;
    }
    if (!['Normal', 'Alta'].includes(values.priority)) return;
    if (selectedClient && normalizeClient(values.client) === selectedClient.nome_normalizado) {
      values.clientId = selectedClient.id;
    }
    const file = ui.attachment.files[0];
    const version = createVersion;
    const submit = ui.createForm.querySelector('[type="submit"]');
    submitting = true;
    submit.disabled = true;
    try {
      const image = file ? await readImage(file) : '';
      if (version !== createVersion) return;
      let id;
      if (api) {
        const item = await api.create({
          ...values,
          image,
          imageName: file?.name,
          chaveCriacao: ui.createForm.dataset.creationKey ||= gerarUUID()
        });
        id = item.id;
        delete ui.createForm.dataset.creationKey;
        await refresh();
      } else {
        id = data.reduce((max, item) => Math.max(max, item.id), 1040) + 1;
        const item = { id, ...values, status: 'pendente', assignee: '', created: Date.now(), image };
        if (!save([item, ...data])) return;
      }
      ui.createForm.reset();
      close('createOverlay');
      setTab('todos');
      notify(`Demanda #${id} criada com sucesso!`);
    } catch (error) {
      notify(error.message || 'Não foi possível ler o print. Tente novamente.');
    } finally {
      submitting = false;
      submit.disabled = false;
    }
  });

  ui.board.addEventListener('click', async event => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const id = api ? button.dataset.id : Number(button.dataset.id);
    const item = data.find(record => record.id === id);
    if (!item) return;
    if (button.dataset.action === 'assume' && item.status === 'pendente') {
      assumeId = id;
      ui.agent.value = api && api.user.papel !== 'admin' ? api.user.id : '';
      open('assumeOverlay');
    } else if (button.dataset.action === 'finish' && item.status === 'andamento') {
      if (!confirm(`Confirmar que a demanda #${id} foi lançada?`)) return;
      if (api) {
        button.disabled = true;
        try { await api.action(id, 'finalizar'); await refresh(); notify(`Demanda #${id} marcada como lançada ✅`); }
        catch (error) { notify(error.message); await refresh(); }
        finally { button.disabled = false; }
        return;
      }
      if (!save(data.map(record => record.id === id ? { ...record, status: 'lancada' } : record))) return;
      render();
      notify(`Demanda #${id} marcada como lançada ✅`);
    } else if (button.dataset.action === 'detail') showDetails(item);
  });
  ui.detailContent.addEventListener('click', async event => {
    if (api && event.target.closest('#showHistory')) {
      const id = detailId;
      try {
        const events = await api.history(id);
        if (detailId !== id) return;
        const labels = { client: 'Cliente / empresa', category: 'Tipo de demanda', requester: 'Solicitado por', priority: 'Prioridade', description: 'Descrição' };
        $('demandHistory').innerHTML = events.map(entry => {
          const changes = (Array.isArray(entry.alteracoes) ? entry.alteracoes : []).map(change => {
            if (change.campo === 'image') return `<div class="audit-change">${escapeHtml(change.evento)}</div>`;
            const label = labels[change.campo] || change.campo;
            const values = `<div class="audit-change"><b>Anterior:</b> ${escapeHtml(change.anterior || '(vazio)')}<br><b>Novo:</b> ${escapeHtml(change.novo || '(vazio)')}</div>`;
            return change.campo === 'description' || String(change.anterior).length + String(change.novo).length > 180
              ? `<details class="audit-change"><summary>${escapeHtml(label)}: conteúdo atualizado</summary>${values}</details>`
              : `<div class="audit-change"><b>${escapeHtml(label)}:</b> ${escapeHtml(change.anterior || '(vazio)')} → ${escapeHtml(change.novo || '(vazio)')}</div>`;
          }).join('');
          const stamp = new Date(entry.criado_em).toLocaleString('pt-BR');
          return `<div class="detail-line">${escapeHtml(stamp)} · ${escapeHtml(entry.usuario)} · ${escapeHtml(entry.acao)}${changes}</div>`;
        }).join('') || '<p class="hint">Sem histórico.</p>';
      } catch (error) { notify(error.message); }
      return;
    }
    if (event.target.closest('.zoomable, .zoom-hint')) zoom();
    else if (event.target.closest('#removeDemand')) {
      if (!confirm(`Excluir a demanda #${detailId}?`)) return;
      if (api) {
        try { await api.remove(detailId); close('detailOverlay'); await refresh(); notify('Demanda excluída.'); }
        catch (error) { notify(error.message); }
        return;
      }
      if (!save(data.filter(item => item.id !== detailId))) return;
      close('detailOverlay');
      render();
      notify('Demanda excluída.');
    }
  });
  ui.detailContent.addEventListener('keydown', event => {
    if (event.target.matches('.zoomable') && ['Enter', ' '].includes(event.key)) {
      event.preventDefault();
      zoom();
    }
  });
  $('zoomClose').addEventListener('click', () => close('zoomOverlay'));
  $('assumeForm').addEventListener('submit', async event => {
    event.preventDefault();
    const item = data.find(record => record.id === assumeId);
    const name = ui.agent.value;
    if (!item || item.status !== 'pendente' || !agents.includes(name)) return;
    if (api) {
      const button = event.target.querySelector('[type="submit"]');
      if (button.disabled) return;
      button.disabled = true;
      try { await api.action(assumeId, 'assumir', { assigneeId: name }); close('assumeOverlay'); await refresh(); notify(`Demanda #${item.id} assumida 👍`); }
      catch (error) { notify(error.message); await refresh(); }
      finally { button.disabled = false; }
      return;
    }
    if (!save(data.map(record => record.id === assumeId
      ? { ...record, assignee: name, status: 'andamento' } : record))) return;
    close('assumeOverlay');
    render();
    notify(`Demanda #${item.id} assumida por ${name} 👍`);
  });

  function setSidebar(hidden) {
    document.body.classList.toggle('sidebar-closed', hidden);
    ui.toggleSidebar.textContent = hidden ? '❯' : '❮';
    ui.toggleSidebar.setAttribute('aria-expanded', String(!hidden));
    ui.toggleSidebar.setAttribute('aria-label', hidden ? 'Expandir menu' : 'Recolher menu');
  }
  ui.toggleSidebar.addEventListener('click', () => {
    const hidden = !document.body.classList.contains('sidebar-closed');
    setSidebar(hidden);
    try {
      localStorage.setItem(SIDEBAR_KEY, hidden ? '1' : '0');
    } catch {
      notify('Não foi possível salvar a preferência do menu neste navegador.');
    }
  });
  try {
    setSidebar(localStorage.getItem(SIDEBAR_KEY) === '1');
  } catch { /* O menu continua utilizável quando o armazenamento está bloqueado. */ }
  syncModalAccess();
  renderMetrics();
  navigate('dashboard');
  if (api) { api.subscribe(refresh); await refresh(); }
})();
