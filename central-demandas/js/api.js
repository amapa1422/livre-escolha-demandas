/* API PostgreSQL. Abertura file:// continua independente e preserva dados locais. */
(function () {
  'use strict';
  if (location.protocol === 'file:') return;
  let csrfToken;
  let socket;
  const listeners = new Set();
  async function request(url, options = {}) {
    const response = await fetch(url, { credentials: 'same-origin', ...options,
      headers: { ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(options.method && options.method !== 'GET' ? { 'X-CSRF-Token': csrfToken } : {}), ...options.headers } });
    if (response.status === 401 && !url.endsWith('/login')) { location.replace('/login'); throw new Error('Sessão encerrada.'); }
    if (response.status === 204) return null;
    const body = await response.json().catch(() => ({ error: 'Servidor indisponível. Abra o sistema pelo servidor Node.js.' }));
    if (!response.ok) throw new Error(body.error || 'Não foi possível concluir a operação.');
    return body;
  }
  const api = {
    request,
    list: () => request('/api/demandas'),
    create: body => request('/api/demandas', { method: 'POST', body: JSON.stringify(body) }),
    action: (id, action, body = {}) => request(`/api/demandas/${id}/${action}`, { method: 'POST', body: JSON.stringify(body) }),
    remove: id => request(`/api/demandas/${id}`, { method: 'DELETE' }),
    history: id => request(`/api/demandas/${id}/historico`),
    subscribe: fn => listeners.add(fn),
    async logout() {
      await request('/api/auth/logout', { method: 'POST' });
      socket?.disconnect(); location.replace('/login');
    }
  };
  api.ready = (async () => {
    const state = await request('/api/auth/session');
    if (!state.user) { location.replace('/login'); throw new Error('Entre para continuar.'); }
    csrfToken = state.csrfToken;
    api.user = state.user;
    api.users = await request('/api/usuarios');
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/socket.io/socket.io.js'; script.onload = resolve;
      script.onerror = () => reject(new Error('Não foi possível conectar as atualizações. Recarregue a página.'));
      document.head.append(script);
    });
    socket = window.io({ auth: { csrfToken } });
    socket.on('demandas:alterada', () => listeners.forEach(fn => fn()));
    // Re-fetch on every connection, including reconnects after missed notifications.
    socket.on('connect', () => listeners.forEach(fn => fn()));
    socket.on('connect_error', async () => {
      try { if (!(await request('/api/auth/session')).user) location.replace('/login'); }
      catch { /* A reconexão automática tentará novamente. */ }
    });
    socket.on('disconnect', reason => {
      if (reason === 'io server disconnect') location.replace('/login');
    });
    return api;
  })();
  window.LivreEscolhaAPI = api;
})();
