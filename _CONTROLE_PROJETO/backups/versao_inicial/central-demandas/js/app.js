/* LivreEscolha · Central de Demandas — sem dependências.
 * Seções: configuração, armazenamento, renderização, modais, imagens, eventos.
 * O formato dos registros e as chaves do protótipo são mantidos.
 */
(function () {
  'use strict';

  // 1 · Configuração e estado
  const KEY = 'livre_escolha_demandas_demo_v1';
  const SIDEBAR_KEY = 'demandas_sidebar_closed';
  const MAX_IMAGE_BYTES = 1024 * 1024;
  const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
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
    'detailId', 'agent', 'zoomImage', 'toggleSidebar', 'openModal'
  ].map(id => [id, $(id)]));
  const categories = Array.from(ui.category.options, option => option.value).filter(Boolean);
  const agents = Array.from(ui.agent.options, option => option.value).filter(Boolean);
  const tabButtons = [...document.querySelectorAll('.tab, .nav-item')];
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
  let assumeId = null;
  let detailId = null;
  let noticeTimer;
  let submitting = false;
  let createVersion = 0;
  let storageState = 'ready';

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

  let data = load();

  function save(next, restoring = false) {
    if (storageState !== 'ready' && !(restoring && storageState === 'corrupt')) {
      notify('Os dados não podem ser alterados com segurança. Verifique o armazenamento e reabra a página.');
      return false;
    }
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      data = next;
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
    const counts = { pendente: 0, andamento: 0, lancada: 0 };
    for (const item of data) counts[item.status]++;
    ui.total.textContent = data.length;
    ui.pending.textContent = counts.pendente;
    ui.working.textContent = counts.andamento;
    ui.done.textContent = counts.lancada;
  }

  function setTab(value) {
    if (value !== 'todos' && !Object.hasOwn(statuses, value)) return;
    tab = value;
    for (const button of tabButtons) {
      const active = button.dataset.tab === tab;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    }
    render();
  }

  function ticket(item) {
    const [label, statusClass] = statuses[item.status];
    return `<article class="ticket"><div><div class="ticket-top"><span class="id">#${item.id}</span><span class="badge ${statusClass}">${label}</span>${item.priority === 'Alta' ? '<span class="badge priority">⚑ Alta prioridade</span>' : ''}</div><h3>${escapeHtml(item.category)} <span class="ticket-separator">•</span> ${escapeHtml(item.client)}</h3><p>${escapeHtml(item.description || 'Sem descrição adicional.')}</p><div class="details"><span>◉ Solicitado por: <strong>${escapeHtml(item.requester)}</strong></span><span>◷ ${date(item.created)}</span><span>♙ Responsável: <strong>${escapeHtml(item.assignee || 'Não atribuído')}</strong></span>${item.image ? '<span>▧ Print anexado</span>' : ''}</div></div><div class="ticket-actions">${item.status === 'pendente' ? `<button type="button" class="mini" data-action="assume" data-id="${item.id}">👍 Assumir caso</button>` : ''}${item.status === 'andamento' ? `<button type="button" class="mini finish" data-action="finish" data-id="${item.id}">✓ Marcar lançada</button>` : ''}<button type="button" class="mini secondary" data-action="detail" data-id="${item.id}">Ver detalhes →</button></div></article>`;
  }

  function render() {
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
    const index = modalStack.indexOf(id);
    if (index < 0) return;
    const wasTop = index === modalStack.length - 1;
    modalStack.splice(index, 1);
    $(id).classList.remove('show');
    if (id === 'createOverlay') createVersion++;
    if (id === 'zoomOverlay') ui.zoomImage.removeAttribute('src');
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
    return source;
  }

  function showDetails(item) {
    detailId = item.id;
    ui.detailId.textContent = `Demanda #${item.id} • Criada em ${date(item.created)}`;
    const lines = [
      ['Cliente', item.client], ['Tipo', item.category], ['Solicitado por', item.requester],
      ['Responsável', item.assignee || 'Ainda não assumida'], ['Status', statuses[item.status][0]],
      ['Prioridade', item.priority], ['Descrição', item.description || 'Sem observações.']
    ];
    const source = safeImageSource(item.image);
    ui.detailContent.innerHTML = lines.map(([label, value]) =>
      `<div class="detail-line"><b>${label}:</b> ${escapeHtml(value)}</div>`).join('')
      + (source ? '<div class="detail-line"><b>Print da solicitação:</b><div class="image-preview-wrap"><button type="button" class="zoom-hint" aria-label="Ampliar print">⌕ Ampliar imagem</button><img class="preview-image zoomable" title="Clique para ampliar" alt="Print anexado à demanda" tabindex="0" role="button" aria-label="Ampliar print" /></div></div>'
        : `<p class="hint">${item.image ? 'Não foi possível exibir o print anexado.' : 'Nenhum print anexado.'}</p>`)
      + '<div class="form-foot"><button type="button" class="button" id="removeDemand">Excluir demanda</button></div>';
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
    });
  }
  for (const id of ['search', 'typeFilter', 'sort']) {
    ui[id].addEventListener(id === 'search' ? 'input' : 'change', render);
  }

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
    const file = ui.attachment.files[0];
    const version = createVersion;
    const submit = ui.createForm.querySelector('[type="submit"]');
    submitting = true;
    submit.disabled = true;
    try {
      const image = file ? await readImage(file) : '';
      if (version !== createVersion) return;
      const id = data.reduce((max, item) => Math.max(max, item.id), 1040) + 1;
      const item = { id, ...values, status: 'pendente', assignee: '', created: Date.now(), image };
      if (!save([item, ...data])) return;
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

  ui.board.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const id = Number(button.dataset.id);
    const item = data.find(record => record.id === id);
    if (!item) return;
    if (button.dataset.action === 'assume' && item.status === 'pendente') {
      assumeId = id;
      ui.agent.value = '';
      open('assumeOverlay');
    } else if (button.dataset.action === 'finish' && item.status === 'andamento') {
      if (!confirm(`Confirmar que a demanda #${id} foi lançada?`)) return;
      if (!save(data.map(record => record.id === id ? { ...record, status: 'lancada' } : record))) return;
      render();
      notify(`Demanda #${id} marcada como lançada ✅`);
    } else if (button.dataset.action === 'detail') showDetails(item);
  });
  ui.detailContent.addEventListener('click', event => {
    if (event.target.closest('.zoomable, .zoom-hint')) zoom();
    else if (event.target.closest('#removeDemand')) {
      if (!confirm(`Excluir permanentemente a demanda #${detailId}?`)) return;
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
  $('assumeForm').addEventListener('submit', event => {
    event.preventDefault();
    const item = data.find(record => record.id === assumeId);
    const name = ui.agent.value;
    if (!item || item.status !== 'pendente' || !agents.includes(name)) return;
    if (!save(data.map(record => record.id === assumeId
      ? { ...record, assignee: name, status: 'andamento' } : record))) return;
    close('assumeOverlay');
    render();
    notify(`Demanda #${item.id} assumida por ${name} 👍`);
  });
  $('resetBtn').addEventListener('click', () => {
    if (!confirm('Restaurar os exemplos? Todas as demandas cadastradas neste navegador serão apagadas.')) return;
    if (!save(initial.map(item => ({ ...item })), true)) return;
    setTab('todos');
    notify('Demonstração restaurada.');
  });

  function setSidebar(hidden) {
    document.body.classList.toggle('sidebar-closed', hidden);
    ui.toggleSidebar.textContent = hidden ? '❯' : '❮';
    ui.toggleSidebar.setAttribute('aria-expanded', String(!hidden));
    ui.toggleSidebar.setAttribute('aria-label', hidden ? 'Mostrar menu' : 'Recolher menu');
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
  setTab('todos');
})();
