const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const fixture = require('./qa-supabase-fixture.cjs');
function load(seed = {}, url = 'https://example.test/livre-escolha-demandas/') {
  const { state, client } = fixture(seed);
  const app = { style: {} }, events = {}, intervals = [];
  const window = { LivreEscolhaSupabaseConfig: { projectUrl: 'https://nxqqcdddbhezuvhpemge.supabase.co' },
    LivreEscolhaSupabase: { client: async () => client, loginUrl: 'https://example.test/livre-escolha-demandas/central-demandas/login.html' },
    LivreEscolhaClientes: [{ id: 'catalog-id', nome: 'Empresa Teste', logo: 'logos/test.webp' }],
    addEventListener(name, fn) { events[name] = fn; } };
  const context = vm.createContext({ window, URL, URLSearchParams, Blob, Uint8Array, atob,
    setTimeout, clearTimeout, setInterval: fn => { intervals.push(fn); return 1; }, clearInterval() {},
    location: { href: url, protocol: new URL(url).protocol, replace: next => state.redirects.push(next) },
    history: { replaceState() {} },
    document: { querySelector: () => app, visibilityState: 'visible', addEventListener: (name, fn) => { events[name] = fn; } } });
  for (const file of ['supabase-auth.js', 'supabase-operations.js', 'api.js']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../central-demandas/js', file), 'utf8'), context);
  }
  return { api: window.LivreEscolhaAPI, auth: window.LivreEscolhaAuth, state, client, events, intervals, app };
}
const row = extra => ({ id: '9007199254740993', client: 'Empresa Teste', cliente_id: '33333333-3333-4333-8333-333333333333',
  category: 'CANCELAMENTO', requester: 'Teste', description: '', priority: 'Normal', status: 'pendente',
  criado_por: '11111111-1111-4111-8111-111111111111', responsavel_id: '22222222-2222-4222-8222-222222222222',
  criado_em: '2026-11-03T12:00:00Z', excluido_em: null, ...extra });
const body = extra => ({ client: 'Empresa Teste', category: 'CANCELAMENTO', requester: 'Teste', description: '',
  priority: 'Normal', chaveCriacao: '44444444-4444-4444-8444-444444444444', ...extra });

test('lista mapeia bigint, responsável, data, logo e exclusão lógica', async () => {
  const e = load(); await e.api.ready;
  e.state.tables.demandas.push(row(), row({ id: '2', excluido_em: '2026-11-03' }));
  const rows = await e.api.list();
  assert.equal(rows.length, 1); assert.equal(rows[0].id, '9007199254740993');
  assert.equal(rows[0].assignee, 'Pedro teste'); assert.equal(rows[0].clientId, 'catalog-id');
  assert.equal(rows[0].created, Date.parse('2026-11-03T12:00:00Z'));
  assert.ok(e.state.calls.some(call => call[0] === 'select' && call[2].includes('id::text')));
});
test('paginação consulta mais de 200 demandas', async () => {
  const e = load(); await e.api.ready;
  e.state.tables.demandas = Array.from({ length: 405 }, (_, i) => row({ id: String(i + 1) }));
  assert.equal((await e.api.list()).length, 405);
});
test('criação usa Auth, ignora status/papel forjados e repete pela mesma chave sem duplicar', async () => {
  const e = load(); await e.api.list();
  const created = await e.api.create(body({ criado_por: e.state.other, papel: 'admin', status: 'lancada', clientId: 'catalog-id' }));
  assert.equal((await e.api.create(body())).id, created.id);
  const inserted = e.state.calls.filter(call => call[0] === 'insert');
  assert.equal(inserted.length, 1);
  assert.equal(inserted[0][2].criado_por, e.state.uid);
  assert.equal(inserted[0][2].status, undefined); assert.equal(inserted[0][2].papel, undefined);
  assert.equal(inserted[0][2].cliente_id, e.state.tables.clientes[0].id);
});
test('upload privado registra somente metadados pela nova RPC', async () => {
  const e = load(); await e.api.ready;
  const image = 'data:image/png;base64,' + Buffer.from([137,80,78,71,13,10,26,10]).toString('base64');
  await e.api.create(body({ image, imageName: 'print.png' }));
  const upload = e.state.calls.find(call => call[0] === 'upload');
  assert.equal(upload[1], 'prints-demandas');
  assert.ok(upload[2].startsWith(e.state.uid + '/100/')); assert.equal(upload[4].upsert, false);
  assert.ok(e.state.calls.some(call => call[0] === 'rpc' && call[1] === 'registrar_anexo_demanda'));
  assert.equal(e.state.calls.find(call => call[0] === 'insert')[2].image, undefined);
});
test('falha de anexo mantém demanda, retorna aviso e permite retentar sem duplicação', async () => {
  const e = load(); await e.api.ready; e.state.rpcError = 'RPC não aplicada';
  const payload = body({ image: 'data:image/png;base64,iVBORw0KGgo=' });
  await assert.rejects(e.api.create(payload), /salva, mas o print/);
  assert.equal(e.state.tables.demandas.length, 1);
  e.state.rpcError = null; await e.api.create(payload);
  assert.equal(e.state.tables.demandas.length, 1);
});
test('URLs assinadas são aceitas somente quando emitidas pelo bucket esperado', async () => {
  const e = load(); await e.api.ready; e.state.tables.demandas.push(row());
  e.state.tables.anexos.push({ id: 'a', demanda_id: '9007199254740993', arquivo_path: e.state.uid + '/9007199254740993/a.webp' });
  const [item] = await e.api.list(); assert.ok(e.api.isImageUrl(item.image));
  assert.equal(e.api.isImageUrl('https://evil.test/image.png'), false);
});
test('perfil inativo e sessão ausente bloqueiam inicialização', async () => {
  for (const seed of [{ perfil: { ativo: false } }, { session: null }]) {
    const e = load(seed); await assert.rejects(e.api.ready);
    assert.equal(e.app.style.display, 'none'); assert.match(e.state.redirects.at(-1), /login.html\?reason=/);
  }
});
test('Realtime, conexão, retorno da aba e fallback notificam sem criar canais extras; unsubscribe funciona', async () => {
  const e = load(); await e.api.ready; let calls = 0;
  const unsubscribe = e.api.subscribe(() => calls++);
  e.state.changes[0](); e.state.subscribed('SUBSCRIBED'); e.events.online(); e.events.visibilitychange(); e.intervals[0]();
  assert.equal(calls, 5); assert.equal(e.state.channelCount, 2);
  unsubscribe(); e.state.changes[0](); assert.equal(calls, 5);
  e.events.pagehide(); assert.ok(e.state.removed);
});
test('histórico consulta tabela sem INSERT e resolve o autor', async () => {
  const e = load(); await e.api.ready;
  e.state.tables.historico.push({ id: '1', demanda_id: '42', usuario_id: e.state.other, acao: 'criar', criado_em: '2026-11-03' });
  assert.equal((await e.api.history('42'))[0].usuario, 'Pedro teste');
  assert.equal(e.state.calls.filter(call => call[0] === 'insert').length, 0);
});
test('logout redireciona no subcaminho e remove canal', async () => {
  const e = load(); await e.api.ready; await e.api.logout();
  assert.ok(e.state.removed); assert.match(e.state.redirects.at(-1), /livre-escolha-demandas\/central-demandas\/login.html/);
});
test('file:// não inicia API nem toca dados locais', () => {
  assert.equal(load({}, 'file:///tmp/index.html').api, undefined);
});
test('seleção do catálogo sem cliente remoto utiliza RPC específica, sem INSERT direto em clientes', async () => {
  const e = load(); await e.api.list(); e.api.clients = []; e.state.tables.clientes = [];
  await e.api.create(body({ clientId: 'catalog-id' }));
  assert.ok(e.state.calls.some(call => call[0] === 'rpc' && call[1] === 'obter_cliente_catalogo'));
  assert.equal(e.state.calls.some(call => call[0] === 'insert' && call[1] === 'clientes'), false);
  assert.ok(e.state.tables.demandas[0].cliente_id);
});
test('queda de conexão não encerra sessão e sessão expirada redireciona', async () => {
  const e = load(); await e.api.ready;
  e.client.auth.getUser = async () => ({ data: {}, error: { status: 0, name: 'AuthRetryableFetchError' } });
  await assert.rejects(e.api.list(), /conexão/); assert.equal(e.state.redirects.length, 0);
  e.client.auth.getUser = async () => ({ data: {}, error: { status: 401 } });
  await assert.rejects(e.api.list(), /Entre/); assert.ok(e.state.redirects.at(-1).includes('AUTH_REQUIRED'));
});
test('print indisponível não impede listar demandas e ID inseguro não é arredondado', async () => {
  const e = load(); await e.api.ready;
  e.state.tables.demandas.push(row()); e.state.tables.anexos.push({ id: 'a', demanda_id: row().id, arquivo_path: 'missing.webp' });
  e.client.storage.from = () => ({ createSignedUrls: async () => ({ error: { message: 'Arquivo ausente' } }) });
  assert.equal((await e.api.list())[0].image, 'unavailable');
  e.state.tables.demandas[0].id = Number.MAX_SAFE_INTEGER + 1;
  await assert.rejects(e.api.list(), /identificador inválido/);
});
