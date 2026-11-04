(async function () {
  'use strict';
  const form = document.getElementById('loginForm'), button = form.querySelector('button[type="submit"]');
  const message = document.getElementById('loginError'), email = document.getElementById('email');
  const password = document.getElementById('password'), confirm = document.getElementById('confirmPassword');
  const recover = document.getElementById('recoverPassword'), auth = window.LivreEscolhaAuth;
  let passwordMode = new URL(location.href).searchParams.get('reason') === 'PASSWORD_RECOVERY';
  function mode() {
    document.getElementById('confirmField').hidden = !passwordMode;
    email.closest('.field').hidden = passwordMode;
    email.required = !passwordMode; confirm.required = passwordMode;
    password.autocomplete = passwordMode ? 'new-password' : 'current-password';
    password.minLength = passwordMode ? 8 : 1;
    button.textContent = passwordMode ? 'Salvar senha e entrar' : 'Entrar';
    recover.hidden = passwordMode;
    if (passwordMode) document.getElementById('loginIntro').textContent = 'Defina sua senha para acessar a central.';
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (button.disabled || !form.reportValidity()) return;
    button.disabled = true; message.textContent = '';
    try {
      if (passwordMode) {
        if (password.value !== confirm.value) throw new Error('As senhas não coincidem.');
        await auth.setPassword(password.value);
      } else await auth.signIn(email.value.trim(), password.value);
      password.value = ''; confirm.value = '';
      location.replace(window.LivreEscolhaSupabase.appUrl);
    } catch (error) { message.textContent = error.message; button.disabled = false; }
  });
  recover.addEventListener('click', async () => {
    if (recover.disabled) return;
    if (!email.reportValidity()) { email.focus(); return; }
    recover.disabled = true;
    try {
      await auth.recover(email.value.trim());
      message.textContent = 'Se a conta estiver autorizada, você receberá um e-mail para recuperar a senha.';
    } catch (error) { message.textContent = error.message; }
    finally { recover.disabled = false; }
  });
  try {
    const state = await auth.initializeCallback();
    passwordMode ||= state.passwordFlow;
    mode();
    if (state.session) {
      await auth.profile();
      if (!passwordMode) { location.replace(window.LivreEscolhaSupabase.appUrl); return; }
    } else if (passwordMode) throw new Error('O link expirou ou é inválido. Solicite outro convite ou recuperação.');
    button.disabled = false;
    if (new URL(location.href).searchParams.get('reason') === 'PROFILE_INACTIVE') {
      message.textContent = 'Sua conta não possui um perfil ativo autorizado. Contate o administrador.';
    }
  } catch (error) {
    message.textContent = error.message;
    if (!passwordMode) button.disabled = false;
  }
})();
