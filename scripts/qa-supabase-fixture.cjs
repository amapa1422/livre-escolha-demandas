/* Fixture sintética compartilhada por testes VM e navegador; nunca publicada. */
function fixture(seed = {}) {
  const uid = '11111111-1111-4111-8111-111111111111';
  const other = '22222222-2222-4222-8222-222222222222';
  const state = {
    uid, other, calls: [], authEvents: [], changes: [], broadcasts: [], channelCount: 0, redirects: [],
    perfil: { id: uid, nome: 'Felipe teste', papel: 'admin', ativo: true },
    tables: { perfis: [{ id: uid, nome: 'Felipe teste', papel: 'admin', ativo: true },
      { id: other, nome: 'Pedro teste', papel: 'funcionario', ativo: true }],
      clientes: [{ id: '33333333-3333-4333-8333-333333333333', nome: 'Empresa Teste', ativo: true }],
      demandas: [], anexos: [], historico: [], edicoes_demandas: [] }, session: { user: { id: uid } },
    ...seed
  };
  const ok = data => ({ data, error: null });
  function query(table) {
    let filters = [], offset = 0, last = Infinity, mode, payload;
    const q = {
      select(fields) { state.calls.push(['select', table, fields]); return q; },
      eq(key, value) { filters.push(row => String(row[key]) === String(value)); return q; },
      is(key, value) { filters.push(row => (row[key] ?? null) === value); return q; },
      order() { return q; },
      range(start, end) { offset = start; last = end; return q; },
      insert(body) { state.calls.push(['insert', table, body]); payload = body; return q; },
      single() { mode = 'one'; return q; }, maybeSingle() { mode = 'maybe'; return q; },
      then(resolve, reject) {
        return Promise.resolve().then(() => {
          if (state.failTable === table) return { data: null, error: { code: '42501', message: 'Denied' } };
          if (payload) {
            const row = { id: String(100 + state.tables.demandas.length), criado_em: new Date().toISOString(),
              status: 'pendente', responsavel_id: null, excluido_em: null, ...payload };
            state.tables[table].push(row); payload = undefined; return ok(row);
          }
          let rows = state.tables[table].filter(row => filters.every(filter => filter(row)));
          if (table === 'perfis' && filters.length && state.perfil) rows = [{ ...state.perfil }];
          rows = rows.slice(offset, last + 1);
          return ok(mode ? rows[0] || null : rows.map(row => ({ ...row })));
        }).then(resolve, reject);
      }
    };
    return q;
  }
  const client = {
    from: query,
    auth: {
      onAuthStateChange(fn) { state.authEvents.push(fn); return { data: { subscription: { unsubscribe() {} } } }; },
      async getUser() { return state.session ? ok({ user: state.session.user }) : { data: {}, error: { status: 401 } }; },
      async getSession() { return ok({ session: state.session }); },
      async signInWithPassword(body) { state.calls.push(['login', body]); state.session = { user: { id: uid } }; return ok(state.session); },
      async signOut() { state.session = null; state.authEvents.forEach(fn => fn('SIGNED_OUT', null)); return ok(null); },
      async resetPasswordForEmail(...args) { state.calls.push(['recover', ...args]); return ok(null); },
      async updateUser(body) { state.calls.push(['password', body]); return ok(null); },
      async verifyOtp(body) { state.calls.push(['otp', body]); return ok(null); }
    },
    realtime: { async setAuth() {} },
    channel(name, options) { state.channelCount++; return {
      on(type, config, fn) { (type === 'broadcast' ? state.broadcasts : state.changes).push(fn); return this; },
      subscribe(fn) { if (options?.config?.private) state.broadcastSubscribed = fn; else state.subscribed = fn; return this; }
    }; },
    async removeChannel() { state.removed = true; },
    storage: { from(bucket) { return {
      async createSignedUrls(paths) { return ok(paths.map(path => ({ path,
        signedUrl: 'https://nxqqcdddbhezuvhpemge.supabase.co/storage/v1/object/sign/' + bucket + '/' + path + '?token=synthetic' }))); },
      async upload(path, blob, options) { state.calls.push(['upload', bucket, path, blob.size, options]); return ok({ path }); }
    }; } },
    async rpc(name, args) {
      state.calls.push(['rpc', name, args]);
      if (state.rpcError) return { data: null, error: { message: state.rpcError } };
      if (name === 'obter_cliente_catalogo') {
        const id = '33333333-3333-4333-8333-333333333333';
        state.tables.clientes.push({ id, nome: args.p_nome, ativo: true });
        return ok(id);
      }
      const row = state.tables.demandas.find(row => row.id === args.p_id);
      if (name === 'assumir_demanda' && row) { row.status = 'andamento'; row.responsavel_id = args.p_responsavel; }
      if (name === 'finalizar_demanda' && row) row.status = 'lancada';
      if (name === 'excluir_demanda' && row) row.excluido_em = new Date().toISOString();
      if (name === 'registrar_anexo_demanda' && !state.tables.anexos.some(item => item.demanda_id === args.p_demanda_id)) {
        state.tables.anexos.push({ id: '55555555-5555-4555-8555-555555555555', demanda_id: args.p_demanda_id, arquivo_path: args.p_arquivo_path });
      }
      (name === 'excluir_demanda' ? state.broadcasts : state.changes).forEach(fn => fn());
      return ok(null);
    }
  };
  return { state, client };
}
module.exports = fixture;
