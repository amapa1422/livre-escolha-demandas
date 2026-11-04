/* Supabase: preserva o contrato da interface; file:// mantém dados locais independentes. */
(function () {
  'use strict';
  if (location.protocol === 'file:') return;
  const auth = window.LivreEscolhaAuth, config = window.LivreEscolhaSupabase;
  const listeners = new Set(), imageUrls = new Map();
  const catalog = Array.isArray(window.LivreEscolhaClientes) ? window.LivreEscolhaClientes : [];
  const columns = 'id::text,client,cliente_id,category,requester,description,priority,status,criado_por,responsavel_id,criado_em,excluido_em,chave_criacao';
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  let client, operations, channel, invalidationChannel, timer, stopped = false;
  const app = document.querySelector('.app');
  if (app) app.style.display = 'none';
  function emit() { if (!stopped) listeners.forEach(fn => fn()); }
  function check(result) {
    if (result.error) throw new Error(result.error.code === '42501'
      ? 'Operação sem permissão. Consulte o administrador; as permissões do banco não foram alteradas.'
      : result.error.message || 'Falha de conexão com o Supabase. Tente novamente.');
    return result.data;
  }
  function stop() {
    stopped = true; clearInterval(timer);
    if (channel) { client.removeChannel(channel).catch(() => {}); channel = null; }
    if (invalidationChannel) { client.removeChannel(invalidationChannel).catch(() => {}); invalidationChannel = null; }
    imageUrls.clear();
  }
  function redirect(reason = '') {
    stop(); if (app) app.style.display = 'none';
    location.replace(config.loginUrl + (reason ? '?reason=' + encodeURIComponent(reason) : ''));
  }
  async function authorize() {
    try { api.user = await auth.profile(); return api.user; }
    catch (error) {
      if (['AUTH_REQUIRED', 'PROFILE_INACTIVE'].includes(error.code)) redirect(error.code);
      throw error;
    }
  }
  async function pages(table, fields, decorate = query => query) {
    const rows = [], size = 200;
    for (let offset = 0; ; offset += size) {
      const batch = check(await decorate(client.from(table).select(fields)).order('id').range(offset, offset + size - 1)) || [];
      rows.push(...batch);
      if (batch.length < size) return rows;
    }
  }
  async function profiles() {
    const rows = await pages('perfis', 'id,nome,papel,ativo');
    api.users = rows.filter(row => row.ativo && ['admin', 'funcionario'].includes(row.papel));
    return new Map(rows.map(row => [row.id, row.nome]));
  }
  function mapDemand(row, names, image = '') {
    if (!/^[1-9][0-9]*$/.test(row.id) || (typeof row.id === 'number' && !Number.isSafeInteger(row.id))) {
      throw new Error('O servidor retornou um identificador inválido.');
    }
    const selected = row.cliente_id && api.clients.find(item => item.id === row.cliente_id);
    const logo = selected && catalog.find(item => normalize(item.nome) === normalize(selected.nome)
      && normalize(row.client) === normalize(selected.nome));
    return { id: String(row.id), client: row.client, category: row.category, requester: row.requester,
      description: row.description, priority: row.priority, status: row.status,
      assignee: row.responsavel_id ? names.get(row.responsavel_id) || row.responsavel_id : '',
      created: Date.parse(row.criado_em), clientId: logo?.id, image };
  }
  async function signedImages(attachments) {
    const now = Date.now();
    for (const [url, expires] of imageUrls) if (expires < now) imageUrls.delete(url);
    const paths = [...new Set(attachments.map(row => row.arquivo_path))], mapped = new Map();
    for (let i = 0; i < paths.length; i += 100) {
      const { data, error } = await client.storage.from('prints-demandas').createSignedUrls(paths.slice(i, i + 100), 120);
      if (error) continue;
      for (const item of data || []) {
        if (!item.error && item.signedUrl) {
          const url = new URL(item.signedUrl, window.LivreEscolhaSupabaseConfig.projectUrl);
          if (url.origin === new URL(window.LivreEscolhaSupabaseConfig.projectUrl).origin
              && url.pathname.startsWith('/storage/v1/object/sign/prints-demandas/')) {
            mapped.set(item.path, url.href); imageUrls.set(url.href, now + 120000);
          }
        }
      }
    }
    return new Map(attachments.map(row => [String(row.demanda_id), mapped.get(row.arquivo_path) || 'unavailable']));
  }
  async function uploadPrint(row, body, user) {
    if (!body.image) return;
    // Base64 existe só em memória. O banco recebe metadados, nunca a imagem.
    const match = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/]+={0,2})$/.exec(body.image);
    if (!match) throw new Error('Print inválido. Selecione PNG, JPEG ou WebP.');
    const binary = atob(match[2]);
    if (!binary.length || binary.length > 1048576) throw new Error('Escolha um print de até 1 MB.');
    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
    const valid = match[1] === 'image/png' ? [137,80,78,71,13,10,26,10].every((value, i) => bytes[i] === value)
      : match[1] === 'image/jpeg' ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
        : String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP';
    if (!valid) throw new Error('O formato do print não corresponde ao arquivo.');
    const extension = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' }[match[1]];
    const path = user.id + '/' + row.id + '/' + body.chaveCriacao + '.' + extension;
    const uploaded = await client.storage.from('prints-demandas').upload(path, new Blob([bytes], { type: match[1] }),
      { contentType: match[1], upsert: false, cacheControl: '0' });
    if (uploaded.error && !['409', 'Duplicate'].includes(String(uploaded.error.statusCode || uploaded.error.code))) check(uploaded);
    check(await client.rpc('registrar_anexo_demanda', { p_demanda_id: String(row.id), p_arquivo_path: path,
      p_nome_original: (body.imageName || 'print.' + extension).slice(0, 255) }));
  }
  const api = {
    user: null, users: [], clients: [],
    isImageUrl: url => imageUrls.has(url) && imageUrls.get(url) > Date.now(),
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    async list() {
      await api.ready; await authorize();
      const names = await profiles();
      api.clients = await pages('clientes', 'id,nome,ativo', query => query.eq('ativo', true));
      const rows = await pages('demandas', columns, query => query.is('excluido_em', null));
      const attachments = await pages('anexos', 'id,demanda_id::text,arquivo_path');
      const images = await signedImages(attachments);
      return rows.map(row => mapDemand(row, names, images.get(String(row.id)) || ''));
    },
    async create(body) {
      await api.ready; const user = await authorize();
      if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(body.chaveCriacao || '')) throw new Error('Chave de criação inválida.');
      const existing = () => client.from('demandas').select(columns).eq('criado_por', user.id)
        .eq('chave_criacao', body.chaveCriacao).maybeSingle();
      let row = check(await existing());
      if (!row) {
        const chosen = catalog.find(item => item.id === body.clientId && normalize(item.nome) === normalize(body.client));
        const matches = chosen ? api.clients.filter(item => normalize(item.nome) === normalize(chosen.nome)) : [];
        let clienteId = matches.length === 1 ? matches[0].id : null;
        if (chosen && !clienteId) clienteId = check(await client.rpc('obter_cliente_catalogo', {
          p_nome: chosen.nome, p_logo_path: chosen.logo
        }));
        const payload = { client: body.client, cliente_id: clienteId,
          category: body.category, requester: body.requester, description: body.description,
          priority: body.priority, criado_por: user.id, chave_criacao: body.chaveCriacao };
        const result = await client.from('demandas').insert(payload).select(columns).single();
        row = result.error?.code === '23505' ? check(await existing()) : check(result);
        if (!row) throw new Error('Não foi possível recuperar a demanda criada. Tente novamente.');
      }
      if (row.excluido_em) throw new Error('A demanda #' + row.id + ' desta tentativa já foi excluída.');
      try { await uploadPrint(row, body, user); }
      catch (error) {
        emit();
        throw new Error('Demanda #' + row.id + ' salva, mas o print não foi concluído: ' + error.message
          + ' Tente enviar novamente com o formulário aberto; a mesma demanda será reutilizada.');
      }
      emit(); return { id: String(row.id) };
    },
    async action(id, action, body) { await api.ready; await authorize(); const data = await operations.action(id, action, body); emit(); return data; },
    async remove(id) { await api.ready; await authorize(); const data = await operations.remove(id); emit(); return data; },
    async history(id) {
      await api.ready; await authorize(); const names = await profiles();
      return (await pages('historico', 'id::text,usuario_id,acao,criado_em', query => query.eq('demanda_id', id)))
        .map(row => ({ ...row, usuario: names.get(row.usuario_id) || row.usuario_id }));
    },
    async logout() { await auth.logout(); redirect(); }
  };
  window.LivreEscolhaAPI = api;
  api.ready = (async () => {
    client = await auth.client();
    if (auth.passwordFlow) { redirect('PASSWORD_RECOVERY'); throw new Error('Defina sua senha para continuar.'); }
    await authorize(); await profiles();
    operations = window.LivreEscolhaSupabaseOperations(client);
    channel = client.channel('livreescolha-demandas')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'demandas' }, emit)
      .subscribe(status => { if (status === 'SUBSCRIBED') emit(); });
    // A RLS oculta a linha excluída, impedindo seu postgres_changes de chegar.
    // O banco envia apenas {} neste tópico privado; toda leitura continua sob RLS.
    await client.realtime.setAuth();
    invalidationChannel = client.channel('livreescolha-demandas-invalidate', { config: { private: true } })
      .on('broadcast', { event: 'invalidate' }, emit)
      .subscribe(status => { if (status === 'SUBSCRIBED') emit(); });
    client.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) redirect('AUTH_REQUIRED');
      if (event === 'PASSWORD_RECOVERY') redirect('PASSWORD_RECOVERY');
      if (event === 'TOKEN_REFRESHED') setTimeout(emit, 0);
    });
    timer = setInterval(() => { if (document.visibilityState !== 'hidden') emit(); }, 45000);
    window.addEventListener('online', emit);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') emit(); });
    window.addEventListener('pagehide', stop);
    window.addEventListener('pageshow', event => { if (event.persisted) location.reload(); });
    if (app) app.style.display = '';
    return api;
  })();
  api.ready.catch(() => { if (!stopped && app) app.style.display = ''; });
})();
