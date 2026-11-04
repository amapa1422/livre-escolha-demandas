const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const fixture = require('./qa-supabase-fixture.cjs');
function setup(seed = {}, suffix = '') {
  const e = fixture(seed), replaced = [];
  const window = { LivreEscolhaSupabase: { client: async () => e.client,
    loginUrl: 'https://example.test/livre-escolha-demandas/central-demandas/login.html' } };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../central-demandas/js/supabase-auth.js'), 'utf8'), {
    window, URL, URLSearchParams, location: { href: window.LivreEscolhaSupabase.loginUrl + suffix },
    history: { replaceState: (...args) => replaced.push(args) }
  });
  return { ...e, auth: window.LivreEscolhaAuth, replaced };
}
test('login verifica o perfil real e não altera privilégios', async () => {
  const e = setup(); const user = await e.auth.signIn('test@example.test', 'synthetic');
  assert.equal(user.papel, 'admin'); assert.equal(e.state.calls.filter(call => call[0] === 'insert').length, 0);
});
test('perfil desativado encerra sessão e bloqueia acesso', async () => {
  const e = setup({ perfil: { ativo: false } });
  await assert.rejects(e.auth.profile(), { code: 'PROFILE_INACTIVE' }); assert.equal(e.state.session, null);
});
test('recuperação usa callback do subcaminho e não permite cadastro público', async () => {
  const e = setup(); await e.auth.recover('test@example.test');
  const call = e.state.calls.find(call => call[0] === 'recover');
  assert.equal(call[2].redirectTo, 'https://example.test/livre-escolha-demandas/central-demandas/login.html?mode=recovery');
  assert.equal(e.auth.signUp, undefined);
});
test('convite por token_hash e recuperação pelo hash iniciam definição de senha', async () => {
  const e = setup({}, '?token_hash=synthetic&type=invite');
  assert.equal((await e.auth.initializeCallback()).passwordFlow, true);
  assert.equal(e.state.calls.find(call => call[0] === 'otp')[1].type, 'invite');
  assert.ok(e.replaced.length);
  const r = setup({}, '#type=recovery&access_token=synthetic');
  assert.equal((await r.auth.initializeCallback()).passwordFlow, true);
  await r.auth.setPassword('synthetic-strong-password'); assert.equal(r.auth.passwordFlow, false);
});
test('callback inválido gera mensagem sem expor o token na URL', async () => {
  const e = setup({}, '#error_description=expired');
  await assert.rejects(e.auth.initializeCallback(), /expirou/); assert.ok(e.replaced.length);
});
