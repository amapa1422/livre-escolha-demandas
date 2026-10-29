(async () => {
  const results = [];
  const errors = [];
  const key = 'livre_escolha_demandas_demo_v1';
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  function check(name, condition, details) {
    results.push({ name, passed: Boolean(condition), ...(details ? { details } : {}) });
    document.getElementById('result').textContent = JSON.stringify({progress: name, results});
    if (!condition) throw new Error(name + (details ? ': ' + JSON.stringify(details) : ''));
  }
  async function until(test) {
    for (let i = 0; i < 100; i++) { if (test()) return; await wait(20); }
    throw new Error('Tempo esgotado');
  }
  async function frame(path) {
    const element = document.createElement('iframe');
    element.style.cssText = 'position:absolute;top:100px;left:0;display:block;border:0;width:1366px;height:1000px';
    const loaded = new Promise(resolve => element.onload = resolve);
    element.src = path;
    document.body.append(element);
    await loaded;
    return element;
  }
  async function reload(frame) {
    errors.push(...(frame.contentWindow.__qaErrors || []));
    const loaded = new Promise(resolve => frame.onload = resolve);
    frame.contentWindow.location.reload();
    await loaded;
  }
  let current;
  let original;
  try {
    original = await frame('../demandas_otimizado%20(1).html');
    original.contentWindow.confirm = () => true;
    original.contentDocument.getElementById('resetBtn').click();
    const seed = original.contentWindow.localStorage.getItem(key);
    current = await frame('../central-demandas/index.html');
    current.contentWindow.localStorage.setItem(key, seed);
    current.contentWindow.localStorage.setItem('demandas_sidebar_closed', '0');
    await reload(current);
    await reload(original);
    let win = current.contentWindow;
    let doc = current.contentDocument;
    const el = id => doc.getElementById(id);
    const click = selector => doc.querySelector(selector).click();
    const value = (id, value) => {
      el(id).value = value;
      el(id).dispatchEvent(new win.Event(id === 'search' ? 'input' : 'change', { bubbles: true }));
    };
    const saved = () => JSON.parse(win.localStorage.getItem(key));
    const metrics = () => ['total','pending','working','done'].map(id => Number(el(id).textContent));
    const escape = () => doc.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    const submit = id => el(id).requestSubmit();
    const useFile = file => { const files = new win.DataTransfer(); files.items.add(file); el('attachment').files = files.files; };
    const fill = (client = 'QA Cliente') => {
      el('openModal').click(); value('client', client); value('category', 'CANCELAMENTO');
      value('requester', 'QA Solicitante'); value('description', 'Teste de regressão'); value('urgency', 'Alta');
    };
    function snapshot(frame) {
      const d = frame.contentDocument;
      const w = frame.contentWindow;
      return [...d.querySelectorAll('.app, .app *')].filter(e => e.getClientRects().length).map(e => {
        const rect = e.getBoundingClientRect();
        const css = w.getComputedStyle(e);
        return [e.tagName, ...['x','y','width','height'].map(k => Math.round(rect[k] * 100) / 100),
          ...['color','backgroundColor','fontSize','fontWeight','fontFamily','lineHeight','padding','margin','borderRadius','boxShadow','display','gap'].map(k => css[k])];
      });
    }
    for (const width of [1920, 1366, 768, 390, 320]) {
      original.style.width = current.style.width = width + 'px';
      await wait(250);
      snapshot(original); snapshot(current);
      await wait(100);
      const before = snapshot(original), after = snapshot(current);
      const differences = after.flatMap((entry, i) => JSON.stringify(entry) === JSON.stringify(before[i]) ? [] : [{ i, before: before[i], after: entry }]);
      check('Layout original preservado em ' + width + 'px', before.length === after.length && !differences.length, differences.slice(0, 3));
      check('Sem rolagem horizontal em ' + width + 'px', doc.documentElement.scrollWidth <= width);
    }
    current.style.width = '1366px';
    await wait(220);
    check('Painel inicial e quatro indicadores', JSON.stringify(metrics()) === '[5,2,1,2]');
    check('Quatro tipos e cinco responsáveis preservados', el('category').options.length === 5
      && [...el('agent').options].slice(1).map(o => o.value).join('|') === 'Felipe|Pedro|Vinícius|Kaique|Luíz');
    fill();
    value('client', ''); submit('createForm');
    check('Campos obrigatórios', el('createOverlay').classList.contains('show') && metrics()[0] === 5);
    value('client', '   '); submit('createForm');
    check('Cliente somente com espaços rejeitado', metrics()[0] === 5);
    value('client', 'QA Cliente');
    const canvas = doc.createElement('canvas'); canvas.width = 120; canvas.height = 60;
    const context = canvas.getContext('2d'); context.fillStyle = '#f58228'; context.fillRect(0,0,120,60);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    useFile(new win.File([blob], 'print.png', { type: 'image/png' }));
    submit('createForm'); submit('createForm');
    await until(() => !el('createOverlay').classList.contains('show'));
    const id = saved()[0].id;
    check('Cadastro com PNG e proteção contra envio duplicado', saved().length === 6 && saved()[0].image.startsWith('data:image/png;base64,'));
    check('Indicadores após cadastro', JSON.stringify(metrics()) === '[6,3,1,2]');
    value('search', 'QA Cliente'); check('Pesquisa instantânea', doc.querySelectorAll('.ticket').length === 1);
    value('typeFilter', 'MUDANÇA'); check('Filtro exclui outro tipo', doc.querySelectorAll('.ticket').length === 0);
    value('typeFilter', 'CANCELAMENTO'); check('Filtro encontra tipo', doc.querySelectorAll('.ticket').length === 1);
    doc.querySelector('[data-action="assume"]').focus();
    click('[data-action="assume"]'); value('agent', 'Vinícius'); submit('assumeForm');
    check('Assumir: responsável e status', saved()[0].assignee === 'Vinícius' && saved()[0].status === 'andamento' && JSON.stringify(metrics()) === '[6,2,2,2]');
    check('Foco preservado após atualizar cartão', doc.activeElement.dataset.action === 'finish');
    click('[data-action="detail"]');
    await until(() => doc.querySelector('.zoomable').complete);
    check('Detalhes exibem print', doc.querySelector('.zoomable').naturalWidth === 120);
    click('.zoomable');
    await until(() => el('zoomImage').complete);
    check('Zoom preserva proporção', el('zoomOverlay').classList.contains('show') && el('zoomImage').naturalWidth / el('zoomImage').naturalHeight === 2);
    el('zoomClose').click(); check('Fechamento pelo botão mantém detalhes', !el('zoomOverlay').classList.contains('show') && el('detailOverlay').classList.contains('show'));
    click('.zoom-hint'); el('zoomOverlay').click(); check('Fechamento pelo overlay', !el('zoomOverlay').classList.contains('show'));
    const photo = doc.querySelector('.zoomable'); photo.focus();
    photo.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    check('Zoom por teclado', el('zoomOverlay').classList.contains('show'));
    escape(); check('ESC mantém comportamento original de fechar todos os modais', !doc.querySelector('.overlay.show'));
    win.confirm = () => false; click('[data-action="finish"]');
    check('Cancelar finalização', saved()[0].status === 'andamento');
    win.confirm = () => true; click('[data-action="finish"]');
    check('Marcar lançada e atualizar indicadores', saved()[0].status === 'lancada' && JSON.stringify(metrics()) === '[6,2,1,3]');
    value('search', ''); value('typeFilter', '');
    for (const [tab, count] of [['pendente',2],['andamento',1],['lancada',3],['todos',6]]) {
      click('.tabs [data-tab="'+tab+'"]');
      check('Aba '+tab, doc.querySelectorAll('.ticket').length === count && doc.querySelector('.nav-item.active').dataset.tab === tab);
      click('.nav [data-tab="'+tab+'"]');
      check('Menu '+tab, doc.querySelectorAll('.ticket').length === count && doc.querySelector('.tab.active').dataset.tab === tab);
    }
    value('sort', 'old'); check('Ordenar antigas', doc.querySelector('.ticket .id').textContent === '#1041');
    value('sort', 'recent'); check('Ordenar recentes', doc.querySelector('.ticket .id').textContent === '#'+id);
    value('sort', 'priority'); check('Ordenar prioridade', [...doc.querySelectorAll('.ticket')].slice(0,3).every(e => e.querySelector('.priority')));
    el('toggleSidebar').click(); await wait(230);
    check('Recolher barra', doc.body.classList.contains('sidebar-closed') && win.localStorage.getItem('demandas_sidebar_closed') === '1');
    await reload(current); win = current.contentWindow; doc = current.contentDocument;
    check('Persistência após recarregar', saved()[0].status === 'lancada' && saved()[0].image && doc.body.classList.contains('sidebar-closed'));
    el('toggleSidebar').click(); check('Expandir barra', !doc.body.classList.contains('sidebar-closed'));
    click('[data-action="detail"][data-id="'+id+'"]');
    win.confirm = () => false; el('removeDemand').click(); check('Cancelar exclusão', saved().length === 6);
    win.confirm = () => true; el('removeDemand').click(); check('Excluir com confirmação', saved().length === 5 && metrics()[0] === 5);
    el('openModal').focus(); el('openModal').click();
    const first = doc.querySelector('#createOverlay .x'); const last = doc.querySelector('#createForm [type="submit"]');
    last.focus(); doc.dispatchEvent(new win.KeyboardEvent('keydown', {key:'Tab', bubbles:true, cancelable:true}));
    check('Foco contido no modal', doc.activeElement === first && doc.querySelector('.app').inert);
    first.focus(); doc.dispatchEvent(new win.KeyboardEvent('keydown', {key:'Tab', shiftKey:true, bubbles:true, cancelable:true}));
    check('Shift+Tab contido no modal', doc.activeElement === last);
    escape(); check('Foco retorna ao acionador', doc.activeElement === el('openModal') && !doc.querySelector('.app').inert);
    fill('<img src=x onerror="window.__xss=1">'); value('description','<script>window.__xss=1</script>'); submit('createForm');
    check('Textos cadastrados não executam HTML', !win.__xss && !doc.querySelector('.ticket h3 img') && doc.querySelector('.ticket h3').textContent.includes('<img'));
    click('[data-action="detail"]'); check('Detalhes escapam HTML', !win.__xss && !doc.querySelector('#detailContent script')); escape();
    for (const type of ['image/jpeg','image/webp']) {
      fill(type);
      const imageCanvas = doc.createElement('canvas'); imageCanvas.width = 120; imageCanvas.height = 60;
      const blob = await new Promise(resolve => imageCanvas.toBlob(resolve, type));
      useFile(new win.File([blob], 'print', { type })); submit('createForm');
      await until(() => !el('createOverlay').classList.contains('show'));
      check('Anexo '+type, saved()[0].image.startsWith('data:'+type+';base64,'));
    }
    fill('Inválido');
    for (const [name, file] of [
      ['Arquivo acima de 1 MB', new win.File([new Uint8Array(1048577)],'large.png',{type:'image/png'})],
      ['Tipo não permitido', new win.File(['texto'],'file.txt',{type:'text/plain'})],
      ['Imagem falsa', new win.File(['texto'],'fake.png',{type:'image/png'})],
      ['Imagem truncada', new win.File([new Uint8Array([137,80,78,71,13,10,26,10])],'bad.png',{type:'image/png'})]
    ]) {
      const count = saved().length; useFile(file); submit('createForm');
      await until(() => !doc.querySelector('#createForm [type="submit"]').disabled);
      check(name+' rejeitado', saved().length === count && el('createOverlay').classList.contains('show'));
    }
    escape();
    const realReader = win.FileReader;
    win.FileReader = class { readAsDataURL() { this.onerror(); } };
    fill('Erro leitura'); useFile(new win.File([blob],'print.png',{type:'image/png'})); submit('createForm');
    await until(() => !doc.querySelector('#createForm [type="submit"]').disabled);
    check('Falha de FileReader tratada', el('notice').textContent.includes('Não foi possível ler'));
    win.FileReader = realReader; escape();
    const realSet = win.Storage.prototype.setItem;
    const beforeFailure = win.localStorage.getItem(key);
    win.Storage.prototype.setItem = function () { throw new win.DOMException('Quota','QuotaExceededError'); };
    fill('Sem espaço'); submit('createForm');
    check('Falha ao criar preserva dados e formulário', win.localStorage.getItem(key) === beforeFailure && el('createOverlay').classList.contains('show'));
    escape(); click('[data-action="assume"]'); value('agent','Felipe'); submit('assumeForm');
    check('Falha ao assumir mantém pendente', win.localStorage.getItem(key) === beforeFailure && el('assumeOverlay').classList.contains('show')); escape();
    win.confirm = () => true; click('[data-action="finish"]');
    check('Falha ao finalizar mantém andamento', win.localStorage.getItem(key) === beforeFailure && doc.querySelector('[data-action="finish"]'));
    click('[data-action="detail"]'); el('removeDemand').click();
    check('Falha ao excluir mantém registro e modal', win.localStorage.getItem(key) === beforeFailure && el('detailOverlay').classList.contains('show')); escape();
    el('resetBtn').click(); check('Falha ao restaurar mantém dados', win.localStorage.getItem(key) === beforeFailure);
    win.Storage.prototype.setItem = realSet;
    win.confirm = () => false; el('resetBtn').click(); check('Cancelar restauração', win.localStorage.getItem(key) === beforeFailure);
    win.confirm = () => true; el('resetBtn').click(); check('Restaurar demo', saved().length === 5 && saved().some(x => x.assignee === 'Ana'));
    const unsafe = saved(); unsafe[0].image = 'x" onerror="window.__xss=1';
    win.localStorage.setItem(key, JSON.stringify(unsafe)); await reload(current); win = current.contentWindow; doc = current.contentDocument;
    click('[data-action="detail"]'); check('Imagem adulterada não injeta atributos', !win.__xss && !doc.querySelector('#detailContent img')); escape();
    win.localStorage.setItem(key,'{dados quebrados'); await reload(current); win = current.contentWindow; doc = current.contentDocument;
    fill('Não sobrescrever'); submit('createForm');
    check('JSON inválido preservado sem sobrescrita', win.localStorage.getItem(key) === '{dados quebrados'); escape();
    const mixed = JSON.parse(seed); mixed.push({id:'<img>',status:'invalido'});
    const mixedRaw = JSON.stringify(mixed); win.localStorage.setItem(key,mixedRaw);
    await reload(current); win = current.contentWindow; doc = current.contentDocument;
    check('Registro inválido não impede consulta dos válidos', metrics()[0] === 5);
    fill('Não sobrescrever'); submit('createForm'); check('Registros inválidos não são apagados', win.localStorage.getItem(key) === mixedRaw); escape();
    win.localStorage.setItem(key, seed); await reload(current); win = current.contentWindow; doc = current.contentDocument;
    for (const width of [768,390,320]) {
      current.style.width = width+'px'; await wait(250); fill('Mobile');
      const modal = doc.querySelector('#createOverlay .modal').getBoundingClientRect();
      check('Formulário utilizável em '+width+'px', modal.left >= 0 && modal.right <= width && doc.documentElement.scrollWidth <= width);
      escape(); click('[data-action="detail"]');
      check('Detalhes sem overflow em '+width+'px', doc.documentElement.scrollWidth <= width); escape();
    }
    errors.push(...(win.__qaErrors || []));
    check('Sem erros JavaScript/console', errors.length === 0, errors);
  } catch (error) {
    results.push({name:'Execução completa',passed:false,details:error.stack});
  }
  const report = { browser:navigator.userAgent, results, passed:results.filter(x=>x.passed).length, failed:results.filter(x=>!x.passed).length, errors };
  document.getElementById('result').textContent = JSON.stringify(report,null,2);
  return report;
})();
