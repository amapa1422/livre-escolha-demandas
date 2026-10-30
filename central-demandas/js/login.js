(async function () {
  'use strict';
  const form = document.getElementById('loginForm');
  const button = form.querySelector('button');
  const message = document.getElementById('loginError');
  let csrf;
  async function initialize() {
    const res = await fetch('/api/auth/session', { credentials: 'same-origin' });
    if (!res.ok) throw new Error('Não foi possível conectar. Recarregue a página.');
    const state = await res.json();
    if (state.user) { location.replace('/'); return; }
    csrf = state.csrfToken; button.disabled = false;
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (button.disabled || !form.reportValidity()) return;
    button.disabled = true; message.textContent = '';
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
        body: JSON.stringify({ email: document.getElementById('email').value.trim(), password: document.getElementById('password').value }) });
      if (!res.ok) throw new Error((await res.json()).error || 'Não foi possível entrar.');
      document.getElementById('password').value = ''; location.replace('/');
    } catch (error) { message.textContent = error.message || 'Falha de conexão. Tente novamente.'; button.disabled = false; }
  });
  try { await initialize(); } catch (error) { message.textContent = error.message; }
})();
