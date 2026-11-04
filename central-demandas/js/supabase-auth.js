/* Auth compartilhado; privilégios são verificados pelo banco. */
(function () {
  'use strict';
  const callback = new URL(location.href);
  const hash = new URLSearchParams(callback.hash.slice(1));
  let passwordFlow = ['invite', 'recovery'].includes(hash.get('type') || callback.searchParams.get('mode'));
  let subscription;
  async function client() {
    const instance = await window.LivreEscolhaSupabase.client();
    if (!subscription) subscription = instance.auth.onAuthStateChange(event => {
      // Não aguardar chamadas Auth dentro deste callback (lock do SDK).
      if (event === 'PASSWORD_RECOVERY') passwordFlow = true;
    }).data.subscription;
    return instance;
  }
  async function profile() {
    const instance = await client();
    const { data, error } = await instance.auth.getUser();
    if (error || !data.user) {
      if (error && ![400, 401, 403].includes(error.status) && error.name !== 'AuthSessionMissingError') {
        throw new Error('Não foi possível verificar sua sessão. Confira a conexão e tente novamente.');
      }
      throw Object.assign(new Error('Entre com sua conta para continuar.'), { code: 'AUTH_REQUIRED' });
    }
    const result = await instance.from('perfis').select('id,nome,papel,ativo').eq('id', data.user.id).maybeSingle();
    if (result.error) throw new Error('Não foi possível consultar seu perfil. Confira a conexão e as permissões.');
    if (!result.data?.ativo || !['admin', 'funcionario'].includes(result.data.papel)) {
      await instance.auth.signOut({ scope: 'local' });
      throw Object.assign(new Error('Sua conta não possui um perfil ativo autorizado. Contate o administrador.'), { code: 'PROFILE_INACTIVE' });
    }
    return Object.freeze({ ...result.data });
  }
  window.LivreEscolhaAuth = Object.freeze({
    client, profile,
    get passwordFlow() { return passwordFlow; },
    async initializeCallback() {
      const instance = await client();
      if (hash.get('error_description') || callback.searchParams.get('error_description')) {
        history.replaceState(null, '', callback.pathname);
        throw new Error('O link expirou ou é inválido. Solicite outro convite ou recuperação.');
      }
      const token_hash = callback.searchParams.get('token_hash');
      const type = callback.searchParams.get('type');
      if (token_hash && ['invite', 'recovery'].includes(type)) {
        const { error } = await instance.auth.verifyOtp({ token_hash, type });
        history.replaceState(null, '', callback.pathname + '?mode=' + type);
        if (error) throw new Error('O link expirou ou já foi utilizado. Solicite outro link.');
        passwordFlow = true;
      }
      const { data, error } = await instance.auth.getSession();
      if (error) throw new Error('Não foi possível recuperar a sessão. Solicite outro link ou entre novamente.');
      return { session: data.session, passwordFlow };
    },
    async signIn(email, password) {
      const instance = await client();
      const { error } = await instance.auth.signInWithPassword({ email, password });
      if (error) throw new Error('Não foi possível entrar. Confira e-mail, senha e conexão.');
      return profile();
    },
    async recover(email) {
      const instance = await client();
      const { error } = await instance.auth.resetPasswordForEmail(email, {
        redirectTo: window.LivreEscolhaSupabase.loginUrl + '?mode=recovery'
      });
      if (error) throw new Error('Não foi possível solicitar a recuperação. Aguarde e tente novamente.');
    },
    async setPassword(password) {
      const instance = await client();
      await profile();
      const { error } = await instance.auth.updateUser({ password });
      if (error) throw new Error('Não foi possível definir a senha. Confira as regras de senha do projeto.');
      passwordFlow = false;
    },
    async logout() {
      const instance = await client();
      const { error } = await instance.auth.signOut({ scope: 'local' });
      if (error) throw new Error('Não foi possível sair. Verifique a conexão e tente novamente.');
    }
  });
})();
