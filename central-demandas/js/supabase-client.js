/* Cliente da integração Supabase.
 * Carregar supabase-config.js antes deste arquivo.
 * Sem conexão ao Node.js, sem leitura do .env e sem alterações no banco.
 */
(function () {
  'use strict';
  const scriptUrl = document.currentScript.src;
  const sourceRoot = new URL('../', scriptUrl);
  const sdkUrl = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.118.0/dist/umd/supabase.js';
  let pending;

  function configuration() {
    const config = window.LivreEscolhaSupabaseConfig;
    if (!config || Object.keys(config).some(key => !['projectUrl', 'publishableKey'].includes(key))) {
      throw new Error('Informe somente Project URL e publishable key na configuração pública.');
    }
    let url;
    try { url = new URL(config.projectUrl); } catch { /* Mensagem abaixo. */ }
    if (!url || url.protocol !== 'https:' || url.username || url.password || url.search || url.hash
        || url.pathname !== '/' || url.hostname.includes('SEU-PROJETO'.toLowerCase())) {
      throw new Error('Preencha a Project URL HTTPS em js/supabase-config.js.');
    }
    if (typeof config.publishableKey !== 'string'
        || !/^sb_publishable_[A-Za-z0-9_-]+$/.test(config.publishableKey)
        || config.publishableKey.includes('PREENCHER')) {
      throw new Error('Preencha a publishable key pública do Supabase (sb_publishable_).');
    }
    return { projectUrl: url.origin, publishableKey: config.publishableKey };
  }

  async function loadSdk() {
    if (window.supabase?.createClient) return window.supabase;
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = sdkUrl;
      script.crossOrigin = 'anonymous';
      const timeout = setTimeout(() => {
        script.remove(); reject(new Error('Tempo esgotado ao carregar o Supabase. Tente novamente.'));
      }, 20000);
      script.onload = () => { clearTimeout(timeout); resolve(); };
      script.onerror = () => {
        clearTimeout(timeout); script.remove();
        reject(new Error('Não foi possível carregar o Supabase. Verifique sua conexão.'));
      };
      document.head.append(script);
    });
    if (!window.supabase?.createClient) throw new Error('SDK Supabase indisponível.');
    return window.supabase;
  }

  function client() {
    if (!pending) {
      pending = (async () => {
        const config = configuration();
        const sdk = await loadSdk();
        return sdk.createClient(config.projectUrl, config.publishableKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            // Isola o armazenamento de sessão entre projetos Supabase.
            storageKey: 'livreescolha-auth-' + new URL(config.projectUrl).hostname
          }
        });
      })().catch(error => { pending = undefined; throw error; });
    }
    return pending;
  }

  window.LivreEscolhaSupabase = Object.freeze({
    client,
    loginUrl: new URL('login.html', sourceRoot).href,
    appUrl: new URL('index.html', sourceRoot).href
  });
})();
