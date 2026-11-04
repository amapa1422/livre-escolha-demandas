// Contrato RPC simulado; não comprova autorização/concorrência no banco remoto.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const window = {};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../central-demandas/js/supabase-operations.js'), 'utf8'), { window });
const uuid = '12345678-1234-1234-1234-123456789abc';

test('ações usam somente as três RPCs e os argumentos confirmados', async () => {
  const calls = [];
  const api = window.LivreEscolhaSupabaseOperations({ rpc: async (name, args) => {
    calls.push([name, JSON.parse(JSON.stringify(args))]); return { data: 'ok', error: null };
  } });
  assert.equal(await api.action(42, 'assumir', { assigneeId: uuid, papel: 'admin' }), 'ok');
  await api.action('9007199254740993', 'finalizar');
  await api.remove(42);
  assert.deepEqual(calls, [
    ['assumir_demanda', { p_id: '42', p_responsavel: uuid }],
    ['finalizar_demanda', { p_id: '9007199254740993' }],
    ['excluir_demanda', { p_id: '42' }]
  ]);
});

test('erros de permissão ou concorrência retornados pela RPC são propagados', async () => {
  const api = window.LivreEscolhaSupabaseOperations({ rpc: async () => ({ error: { message: 'Demanda já assumida.' } }) });
  await assert.rejects(api.action(42, 'assumir', { assigneeId: uuid }), /já assumida/);
});

test('identificadores inválidos e ações desconhecidas não geram chamadas', async () => {
  let calls = 0;
  const api = window.LivreEscolhaSupabaseOperations({ rpc: async () => { calls++; } });
  for (const id of [0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1, '9223372036854775808', '1;delete', null, {}, '']) {
    await assert.rejects(api.remove(id));
  }
  await assert.rejects(api.action(42, 'assumir', { assigneeId: 'Felipe' }));
  await assert.rejects(api.action(42, 'reabrir'));
  assert.equal(calls, 0);
});
