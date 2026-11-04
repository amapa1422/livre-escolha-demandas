// Testes isolados de preparação; não validam Auth, banco, RLS ou Realtime reais.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../central-demandas/js/supabase-client.js'), 'utf8');

function environment(config, prefix = '/livre-escolha-demandas/', sdk = true) {
  const calls = [], scripts = [];
  const window = { LivreEscolhaSupabaseConfig: config };
  const createClient = (...args) => { calls.push(args); return { synthetic: true }; };
  if (sdk) window.supabase = { createClient };
  const document = {
    currentScript: { src: `https://amapa1422.github.io${prefix}central-demandas/js/supabase-client.js` },
    createElement: () => ({ remove() {} }),
    head: { append: script => scripts.push(script) }
  };
  vm.runInNewContext(source, { window, document, URL, setTimeout, clearTimeout });
  return { window, calls, scripts, createClient, api: window.LivreEscolhaSupabase };
}
const valid = () => ({ projectUrl: 'https://example.supabase.co', publishableKey: 'sb_publishable_synthetic' });

test('carregamento não conecta; cliente único mesmo com chamadas concorrentes', async () => {
  const env = environment(valid());
  assert.equal(env.calls.length, 0);
  const clients = await Promise.all([env.api.client(), env.api.client(), env.api.client()]);
  assert.equal(env.calls.length, 1);
  assert.equal(clients[0], clients[1]);
  assert.equal(env.calls[0][0], valid().projectUrl);
  assert.equal(env.calls[0][1], valid().publishableKey);
  assert.deepEqual(JSON.parse(JSON.stringify(env.calls[0][2])), { auth: {
    persistSession: true, autoRefreshToken: true, detectSessionInUrl: true,
    storageKey: 'livreescolha-auth-example.supabase.co'
  } });
});

test('URLs mantêm prefixo Pages e funcionam em servidor na raiz', () => {
  const pages = environment(valid()).api;
  assert.equal(pages.loginUrl, 'https://amapa1422.github.io/livre-escolha-demandas/central-demandas/login.html');
  assert.equal(pages.appUrl, 'https://amapa1422.github.io/livre-escolha-demandas/central-demandas/index.html');
  assert.equal(environment(valid(), '/').api.loginUrl, 'https://amapa1422.github.io/central-demandas/login.html');
});

test('configuração vazia, placeholders, chaves privadas e propriedades extras são rejeitados antes da rede', async () => {
  for (const config of [undefined, {}, { projectUrl: '', publishableKey: '' },
    { ...valid(), publishableKey: 'sb_secret_synthetic' },
    { ...valid(), publishableKey: 'eyJhbGciOi.synthetic' },
    { ...valid(), publishableKey: 'sb_publishable_PREENCHER' },
    { ...valid(), serviceRole: 'synthetic' },
    { ...valid(), projectUrl: 'http://example.supabase.co' },
    { ...valid(), projectUrl: 'https://user:password@example.supabase.co' },
    { ...valid(), projectUrl: 'https://example.supabase.co/private' },
    { ...valid(), projectUrl: 'https://example.supabase.co/?secret=synthetic' },
    { ...valid(), projectUrl: 'https://SEU-PROJETO.supabase.co' }]) {
    const env = environment(config, undefined, false);
    await assert.rejects(env.api.client());
    assert.equal(env.calls.length, 0);
    assert.equal(env.scripts.length, 0);
  }
});

test('configuração pode ser corrigida após falha sem recriar o módulo', async () => {
  const env = environment({});
  await assert.rejects(env.api.client());
  env.window.LivreEscolhaSupabaseConfig = valid();
  assert.equal((await env.api.client()).synthetic, true);
});

test('SDK usa versão fixa, um carregamento e permite nova tentativa após falha', async () => {
  const env = environment(valid(), undefined, false);
  const failed = env.api.client();
  const assertion = assert.rejects(failed, /conexão/);
  env.scripts[0].onerror();
  await assertion;
  const first = env.api.client();
  const second = env.api.client();
  assert.equal(env.scripts.length, 2);
  assert.equal(env.scripts[1].src, 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.118.0/dist/umd/supabase.js');
  env.window.supabase = { createClient: env.createClient };
  env.scripts[1].onload();
  assert.equal(await first, await second);
  assert.equal(env.calls.length, 1);
});
