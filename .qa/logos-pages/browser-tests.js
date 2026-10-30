(async () => {
  if (location.hostname !== '127.0.0.1' || !location.pathname.endsWith('/logos-pages/runner.html')) throw new Error('Use o runner no perfil descartável.');
  const results = [], errors = [];
  const key = 'livre_escolha_demandas_demo_v1';
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const check = (name, condition, details) => {
    results.push({ name, passed: Boolean(condition), ...(details ? { details } : {}) });
    document.getElementById('result').textContent = JSON.stringify({ results, errors }, null, 2);
    if (!condition) throw new Error(name);
  };
  async function until(fn) {
    for (let i = 0; i < 150; i++) { if (fn()) return; await wait(20); }
    throw new Error('Tempo esgotado: ' + fn);
  }
  const legacy = [
    {id:5003,client:'Empresa legada sem logo',category:'CANCELAMENTO',requester:'Teste',priority:'Alta',description:'Histórico preservado',status:'pendente',assignee:'',created:1793350000000,image:'',extra:'preservar'},
    {id:5002,client:'Empresa em andamento',category:'MUDANÇA',requester:'Teste',priority:'Normal',description:'',status:'andamento',assignee:'Pedro',created:1793340000000,image:''},
    {id:5001,client:'Empresa lançada',category:'CONSULTA DE FIDELIDADE',requester:'Teste',priority:'Normal',description:'',status:'lancada',assignee:'Ana',created:1793330000000,image:''}
  ];
  let frame, win, doc;
  const el = id => doc.getElementById(id);
  const value = (id, text) => { el(id).value = text; el(id).dispatchEvent(new win.Event(['client','search'].includes(id) ? 'input' : 'change', {bubbles:true})); };
  const saved = () => JSON.parse(win.localStorage.getItem(key));
  const press = (id, key) => el(id).dispatchEvent(new win.KeyboardEvent('keydown', {key,bubbles:true,cancelable:true}));
  async function load(path, srcdoc) {
    if (frame) { errors.push(...(win.__qaErrors || [])); frame.remove(); }
    frame = document.createElement('iframe');
    frame.style.cssText = 'position:absolute;top:100px;left:0;display:block;border:0;width:1366px;height:1000px';
    const ready = new Promise(resolve => frame.onload = resolve);
    if (srcdoc) frame.srcdoc = srcdoc; else frame.src = path;
    document.body.append(frame);
    await ready;
    win = frame.contentWindow; doc = win.document;
    win.confirm = () => true;
    await until(() => el('board') && el('board').children.length);
  }
  async function reload() { const url = frame.src; await load(url); }
  function fill(client = 'Empresa sem cadastro') {
    el('openModal').click(); value('client', client); value('category','CANCELAMENTO');
    value('requester','QA sintético'); value('description','Teste de regressão'); value('urgency','Alta');
  }
  async function submit() { el('createForm').requestSubmit(); await until(() => !el('createOverlay').classList.contains('show')); }
  function file(blob, name, type) { const transfer = new win.DataTransfer(); transfer.items.add(new win.File([blob],name,{type})); el('attachment').files = transfer.files; }
  function action(id, kind) { doc.querySelector(`[data-id="${id}"][data-action="${kind}"]`).click(); }
  function close() { doc.dispatchEvent(new win.KeyboardEvent('keydown',{key:'Escape',bubbles:true})); }
  try {
    await load('/index.html');
    win.localStorage.setItem(key, JSON.stringify(legacy));
    win.localStorage.setItem('demandas_sidebar_closed','0');
    await reload();
    check('Registros antigos e campos adicionais intactos ao carregar', JSON.stringify(saved()) === JSON.stringify(legacy));
    check('CSS e JavaScript carregados', doc.querySelectorAll('.ticket').length === 3 && win.getComputedStyle(doc.querySelector('.app')).display === 'grid');
    check('Monitoramento de erros ativo', Array.isArray(win.__qaErrors));
    check('Restaurar demo e caixa demonstrativa ausentes', !el('resetBtn') && !doc.querySelector('.side-bottom'));
    check('Rodapé atualizado', doc.querySelector('footer').textContent.trim() === '© 2026 Livre Escolha');
    check('Título laranja e fonte exclusiva', win.getComputedStyle(doc.querySelector('h1')).color === 'rgb(245, 130, 40)' && win.getComputedStyle(doc.querySelector('h1')).fontFamily.includes('Plus Jakarta Sans') && !win.getComputedStyle(doc.querySelector('h2')).fontFamily.includes('Jakarta') && doc.querySelector('.eyebrow').textContent === 'GESTÃO OPERACIONAL');
    check('Tipos e responsáveis preservados', el('category').options.length === 5 && [...el('agent').options].slice(1).map(o=>o.value).join('|') === 'Felipe|Pedro|Vinícius|Kaique|Luíz');
    check('Métricas originais', ['total','pending','working','done'].map(id=>el(id).textContent).join('|') === '3|1|1|1');
    fill('sIcO');
    check('Autocompletar parcial e sem distinção de caixa', el('clientSuggestions').children.length > 40 && !el('clientSuggestions').hidden);
    value('client','mÉdIo');
    check('Autocompletar ignora acentos', el('clientSuggestions').textContent.includes('Médio Oeste'));
    press('client','ArrowDown');
    check('Navegação por teclado e ARIA', el('client').getAttribute('aria-activedescendant') === 'client-option-0');
    press('client','Enter');
    const company = el('client').value;
    check('Seleção preenche empresa e fecha lista', company === 'Sicoob Médio Oeste' && el('clientSuggestions').hidden);
    await submit();
    const selected = saved()[0];
    check('Associação persiste ID sem mudar esquema antigo', typeof selected.clientId === 'string' && selected.id === 5004 && JSON.stringify(saved().slice(1)) === JSON.stringify(legacy));
    const logo = doc.querySelector('.ticket .client-logo');
    await until(()=>logo.complete);
    check('Logo correta no card, dimensões fixas', logo.naturalWidth > 0 && logo.width === 32 && logo.height === 24 && win.getComputedStyle(logo).objectFit === 'contain');
    action(selected.id,'detail');
    const detailLogo = el('detailContent').querySelector('.client-logo');
    await until(()=>detailLogo.complete);
    check('Logo nos detalhes sem substituir o print', detailLogo.src === logo.src && el('detailContent').textContent.includes('Nenhum print anexado.'));
    detailLogo.src = 'data:image/png;base64,AAAA';
    await until(()=>detailLogo.style.visibility === 'hidden');
    check('Imagem inválida preserva nome e espaço', detailLogo.width === 48 && el('detailContent').textContent.includes(company));
    close();
    await reload();
    check('Associação e logo após recarregar', saved()[0].clientId === selected.clientId && !!doc.querySelector('.ticket .client-logo'));
    fill('sicoob'); press('client','ArrowUp');
    check('Seta para cima seleciona última opção', el('client').getAttribute('aria-activedescendant') === 'client-option-' + (el('clientSuggestions').children.length - 1));
    press('client','Escape');
    check('Escape fecha apenas as sugestões primeiro', el('clientSuggestions').hidden && el('createOverlay').classList.contains('show'));
    value('client','Sicoob'); el('clientSuggestions').firstElementChild.click();
    value('client','Empresa livre sem logo');
    await submit();
    check('Editar nome limpa vínculo e permite cadastro livre', !saved()[0].clientId && !doc.querySelector('.ticket').querySelector('.client-logo'));
    fill('Sicoob'); el('clientSuggestions').firstElementChild.click();
    const canvas = doc.createElement('canvas'); canvas.width = 1200; canvas.height = 600;
    const ctx = canvas.getContext('2d'); ctx.fillStyle='#fff';ctx.fillRect(0,0,1200,600);ctx.fillStyle='#111';ctx.font='20px Arial';
    for(let y=30;y<590;y+=28)ctx.fillText('QA SINTÉTICO — Contrato 123456789 / Telefone (44) 99999-1234 / Nome Cliente',20,y);
    const blob = await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
    file(blob,'print.png','image/png');
    el('createForm').requestSubmit(); el('createForm').requestSubmit();
    await until(()=>!el('createOverlay').classList.contains('show'));
    const attached = saved()[0];
    check('Print otimizado WebP e envio duplicado bloqueado', saved().length === 6 && attached.image.startsWith('data:image/webp;'));
    const decoded = new win.Image(); decoded.src=attached.image; await decoded.decode();
    check('Print preserva resolução e economiza pelo menos 10%', decoded.width===1200 && decoded.height===600 && attached.image.length < (await new Promise(resolve=>{const r=new win.FileReader();r.onload=()=>resolve(r.result);r.readAsDataURL(blob)})).length*.9);
    action(attached.id,'detail');
    check('Print e logo coexistem nos detalhes', !!el('detailContent').querySelector('.client-logo') && !!el('detailContent').querySelector('.zoomable'));
    el('detailContent').querySelector('.zoomable').dispatchEvent(new win.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
    check('Ampliação por teclado preserva print', el('zoomOverlay').classList.contains('show') && el('zoomImage').src===attached.image);
    el('zoomClose').click(); check('Fechar ampliação mantém detalhes', el('detailOverlay').classList.contains('show') && !el('zoomOverlay').classList.contains('show'));
    close();
    value('search',String(attached.id)); check('Pesquisa existente',doc.querySelectorAll('.ticket').length===1);
    value('typeFilter','MUDANÇA'); check('Filtro combinado',doc.querySelectorAll('.ticket').length===0);
    value('search','');value('typeFilter','');value('sort','old');
    check('Ordenação antiga',doc.querySelector('.ticket .id').textContent==='#5001');
    value('sort','priority');check('Ordenação por prioridade',doc.querySelector('.ticket').textContent.includes('Alta prioridade'));
    action(attached.id,'assume');value('agent','Vinícius');el('assumeForm').requestSubmit();
    check('Assumir demanda preserva logo e print', saved().find(x=>x.id===attached.id).status==='andamento' && saved().find(x=>x.id===attached.id).clientId===attached.clientId);
    win.confirm=()=>false;action(attached.id,'finish');check('Cancelar finalização preserva estado',saved().find(x=>x.id===attached.id).status==='andamento');
    win.confirm=()=>true;action(attached.id,'finish');check('Finalizar demanda',saved().find(x=>x.id===attached.id).status==='lancada');
    doc.querySelector('.tab[data-tab=lancada]').click();check('Aba por status',doc.querySelectorAll('.ticket').length===2);
    doc.querySelector('.nav-item[data-tab=todos]').click();
    action(attached.id,'detail');win.confirm=()=>false;el('removeDemand').click();check('Cancelar exclusão preserva demanda',saved().some(x=>x.id===attached.id));
    win.confirm=()=>true;el('removeDemand').click();check('Excluir demanda',!saved().some(x=>x.id===attached.id));
    el('toggleSidebar').click(); await reload();check('Sidebar recolhe e persiste',doc.body.classList.contains('sidebar-closed'));el('toggleSidebar').click();
    fill('Cancelar cadastro');doc.querySelector('[data-close=createOverlay]').click();check('Cancelar cadastro não altera registros',saved().length===5);
    fill('Formato inválido');file(new win.Blob(['não é PNG']),'invalido.png','image/png');el('createForm').requestSubmit();await until(()=>el('notice').textContent.includes('válida'));check('Assinatura inválida rejeitada',saved().length===5);
    file(new win.Blob([new Uint8Array(1048577)]),'grande.png','image/png');el('createForm').requestSubmit();await until(()=>el('notice').textContent.includes('até 1 MB'));check('Limite de upload preservado',saved().length===5);close();
    for (const width of [1920,1366,768,390,320]) {
      frame.style.width=width+'px';await wait(240);
      check('Layout sem overflow em '+width+'px',doc.documentElement.scrollWidth<=width);
      fill('sico');check('Sugestões contidas em '+width+'px',el('clientSuggestions').getBoundingClientRect().right<=width);close();
    }
    frame.style.width='1366px';
    const before = win.localStorage.getItem(key);
    for (const path of ['/central-demandas/index.html','/livre-escolha-demandas/index.html','/livre-escolha-demandas/central-demandas/index.html']) {
      await load(path); fill('Médio');press('client','ArrowDown');press('client','Enter');await submit();
      const image=doc.querySelector('.ticket .client-logo');await until(()=>image.complete);
      check('CSS, JS, catálogo e logo em '+path,image.naturalWidth>0 && win.getComputedStyle(doc.querySelector('.app')).display==='grid');
    }
    const baseHtml = await (await fetch('/central-demandas/index.html')).text();
    const emptyHtml = baseHtml.replace('<head>','<head><base href="http://127.0.0.1:8765/central-demandas/">').replace('<script src="assets/clientes/catalogo.js"></script>','<script>window.LivreEscolhaClientes=[];</script>');
    await load('',emptyHtml);fill('Cliente com catálogo vazio');await submit();check('Catálogo vazio não bloqueia aplicação',!saved()[0].clientId);
    const storageProto = win.Storage.prototype;
    const originalSet = storageProto.setItem;
    storageProto.setItem = function(k,v){if(k===key)throw new win.DOMException('Quota','QuotaExceededError');return originalSet.call(this,k,v)};
    const prior = win.localStorage.getItem(key);fill('Falha de quota');el('createForm').requestSubmit();await until(()=>el('notice').textContent.includes('Sem espaço'));
    check('Falha de armazenamento avisa e preserva registros',win.localStorage.getItem(key)===prior && el('createOverlay').classList.contains('show'));
    storageProto.setItem=originalSet;close();
    win.localStorage.setItem(key,'{inválido');await load('/index.html');
    check('Dados corrompidos não são apagados',win.localStorage.getItem(key)==='{inválido');
    fill('Não gravar sobre corrompidos');el('createForm').requestSubmit();await until(()=>el('notice').textContent.includes('segurança'));
    check('Escrita bloqueada preserva dados corrompidos',win.localStorage.getItem(key)==='{inválido');
    win.localStorage.setItem(key,before);await load('/index.html');
    errors.push(...(win.__qaErrors||[]));check('Sem erros JavaScript ou console nos fluxos normais',errors.length===0,errors);
  } catch (error) { errors.push(error.stack||String(error)); }
  const report={results,errors,passed:results.filter(r=>r.passed).length,failed:results.filter(r=>!r.passed).length};
  document.getElementById('result').textContent=JSON.stringify(report,null,2);
  return report;
})()
