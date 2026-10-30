import express from 'express';
import helmet from 'helmet';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { rateLimit } from 'express-rate-limit';
import multer from 'multer';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import { randomBytes, randomUUID, timingSafeEqual, createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { config, backendRoot } from './config.js';
import { pool, transaction } from './db.js';
import { verifyPassword, hashPassword } from './password.js';
import { MAX_IMAGE_BYTES, storeImage } from './images.js';

const publicRoot = path.resolve(backendRoot, '../central-demandas');
const categories = ['CANCELAMENTO', 'CONSULTA DE FIDELIDADE', 'TRANSFERÊNCIA DE TITULARIDADE', 'MUDANÇA'];
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const fail = (status, message) => { throw Object.assign(new Error(message), { status }); };
const token = () => randomBytes(32).toString('hex');
const equal = (a, b) => typeof a === 'string' && typeof b === 'string'
  && /^[a-f0-9]{64}$/.test(a) && /^[a-f0-9]{64}$/.test(b) && timingSafeEqual(Buffer.from(a), Buffer.from(b));
const callback = fn => new Promise((resolve, reject) => fn(error => error ? reject(error) : resolve()));
const select = `SELECT d.*, a.id AS anexo_id FROM demandas d LEFT JOIN anexos a ON a.demanda_id=d.id`;
function record(row) {
  return { id: row.id, client: row.client, clientId: row.catalogId || undefined,
    category: row.category, requester: row.requester, priority: row.priority,
    description: row.description, status: row.status, assignee: row.assignee,
    created: new Date(row.created).getTime(), version: row.version,
    image: row.anexo_id ? `/api/anexos/${row.anexo_id}` : '' };
}

export async function createApplication(overrides = {}) {
  const cfg = { ...config(), ...overrides };
  const catalog = JSON.parse(await readFile(path.join(publicRoot, 'assets/clientes/clientes.json'), 'utf8'));
  // The approved static catalog uses string IDs; PostgreSQL clientes uses UUIDs.
  const clientUUID = id => {
    const hex = createHash('sha256').update(`livre-escolha:${id}`).digest('hex').slice(0, 32);
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-5${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20)}`;
  };
  const catalogById = new Map(catalog.map(c => [c.id, c]));
  const catalogByUUID = new Map(catalog.map(c => [clientUUID(c.id), c.id]));
  const present = row => record({ ...row, catalogId: catalogByUUID.get(row.cliente_id) });
  const app = express();
  const http = createServer(app);
  app.disable('x-powered-by');
  // Use the configured origin consistently, including when opened as localhost.
  app.use((req, res, next) => {
    if (['GET', 'HEAD'].includes(req.method) && req.get('host') !== new URL(cfg.origin).host) {
      return res.redirect(302, cfg.origin + req.originalUrl);
    }
    next();
  });
  if (process.env.TRUST_PROXY === '1') app.set('trust proxy', 1);
  app.use(helmet({ strictTransportSecurity: cfg.secure ? undefined : false,
    contentSecurityPolicy: { directives: {
      defaultSrc: ["'self'"], scriptSrc: ["'self'"], styleSrc: ["'self'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'], imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'"], objectSrc: ["'none'"], frameAncestors: ["'none'"],
      upgradeInsecureRequests: cfg.secure ? [] : null
    } } }));
  const Store = connectPgSimple(session);
  const store = new Store({ pool, tableName: 'sessoes', createTableIfMissing: false,
    errorLog: () => console.error('Falha no armazenamento de sessoes PostgreSQL.') });
  const sessionMiddleware = session({ store, name: 'le.sid', secret: cfg.secret,
    resave: false, saveUninitialized: false, rolling: false,
    cookie: { httpOnly: true, sameSite: 'strict', secure: cfg.secure, maxAge: 8 * 60 * 60 * 1000 } });
  app.use('/api', (req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  app.use(sessionMiddleware);
  app.use('/api', rateLimit({ windowMs: 60000, limit: 600, standardHeaders: 'draft-8', legacyHeaders: false,
    message: { error: 'Muitas requisições. Aguarde um minuto.' } }));
  app.use(express.json({ limit: '1500kb', strict: true }));
  // Origin + synchronizer token protect JSON and multipart mutations, including login/logout.
  app.use('/api', (req, res, next) => {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      if (req.get('origin') !== cfg.origin || !equal(req.get('x-csrf-token'), req.session.csrf)) {
        return res.status(403).json({ error: 'Origem ou token de segurança inválido. Reabra a página.' });
      }
    }
    next();
  });
  async function userFor(sess) {
    if (!sess?.userId || !sess.cookie?.expires || new Date(sess.cookie.expires) <= new Date()) return null;
    return (await pool.query('SELECT id,nome,email,papel FROM usuarios WHERE id=$1 AND ativo=true', [sess.userId])).rows[0];
  }
  const auth = async (req, res, next) => {
    req.user = await userFor(req.session);
    if (!req.user) return res.status(401).json({ error: 'Entre para continuar.' });
    next();
  };
  app.get('/api/auth/session', async (req, res) => {
    req.session.csrf ||= token();
    res.json({ user: await userFor(req.session) || null, csrfToken: req.session.csrf });
  });
  const dummyHash = await hashPassword(token());
  app.post('/api/auth/login', rateLimit({ windowMs: 15 * 60000, limit: 30, skipSuccessfulRequests: true,
    standardHeaders: 'draft-8', legacyHeaders: false, message: { error: 'Muitas tentativas. Aguarde 15 minutos.' } }), async (req, res) => {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || email.length > 254 || typeof password !== 'string' || password.length > 128) fail(400, 'Informe e-mail e senha válidos.');
    const row = (await pool.query('SELECT * FROM usuarios WHERE lower(email)=$1 AND ativo=true', [email.trim().toLowerCase()])).rows[0];
    if (!await verifyPassword(password, row?.senha_hash || dummyHash) || !row) fail(401, 'E-mail ou senha inválidos.');
    const previous = req.sessionID;
    await callback(cb => req.session.regenerate(cb));
    io.in(`session:${previous}`).disconnectSockets(true);
    req.session.userId = row.id;
    req.session.csrf = token();
    await callback(cb => req.session.save(cb));
    res.json({ user: { id: row.id, nome: row.nome, email: row.email, papel: row.papel }, csrfToken: req.session.csrf });
  });
  app.post('/api/auth/logout', auth, async (req, res) => {
    const sid = req.sessionID;
    await callback(cb => req.session.destroy(cb));
    io.in(`session:${sid}`).disconnectSockets(true);
    res.clearCookie('le.sid', { path: '/', httpOnly: true, sameSite: 'strict', secure: cfg.secure }).sendStatus(204);
  });
  app.get('/api/health', async (req, res) => { await pool.query('SELECT 1'); res.json({ ok: true }); });
  app.use('/api', auth);
  app.get('/api/usuarios', async (req, res) => {
    res.json(req.user.papel === 'admin'
      ? (await pool.query('SELECT id,nome,papel FROM usuarios WHERE ativo=true ORDER BY nome,id')).rows
      : [{ id: req.user.id, nome: req.user.nome, papel: req.user.papel }]);
  });
  app.get('/api/clientes', (req, res) => res.json(catalog));
  app.get('/api/demandas', async (req, res) => {
    res.json((await pool.query(`${select} WHERE d.excluido_em IS NULL ORDER BY d.created DESC,d.id DESC`)).rows.map(present));
  });
  const demandId = req => {
    if (!/^[1-9][0-9]{0,9}$/.test(req.params.id) || Number(req.params.id) > 2147483647) fail(400, 'ID inválido.');
    return Number(req.params.id);
  };
  async function activeDemand(db, id, lock = false) {
    const row = (await db.query(`SELECT * FROM demandas WHERE id=$1 AND excluido_em IS NULL${lock ? ' FOR UPDATE' : ''}`, [id])).rows[0];
    if (!row) fail(404, 'Demanda não encontrada.');
    return row;
  }
  const history = (db, id, user, action, before, after) => db.query(
    'INSERT INTO historico(demanda_id,usuario_id,acao,antes,depois) VALUES($1,$2,$3,$4,$5)', [id, user.id, action, before, after]);
  async function insertImage(db, demand, image) {
    await db.query(`INSERT INTO anexos(id,demanda_id,nome_original,original_path,arquivo_path,mime,bytes,largura,altura,sha256)
      VALUES($1,$2,$3,$4,$4,$5,$6,$7,$8,$9)`, [image.id, demand, image.name, image.relative, image.meta.mime,
      image.bytes, image.meta.width, image.meta.height, image.meta.sha256]);
  }
  app.post('/api/demandas', async (req, res) => {
    const body = req.body || {};
    function text(key, max, required = true) {
      const value = body[key] ?? '';
      if (typeof value !== 'string' || value.trim().length > max || (required && !value.trim())) fail(400, `Campo ${key} inválido.`);
      return value.trim();
    }
    const values = { client: text('client', 100), category: text('category', 80), requester: text('requester', 80),
      priority: text('priority', 10), description: text('description', 2500, false) };
    if (!categories.includes(values.category) || !['Normal', 'Alta'].includes(values.priority)) fail(400, 'Tipo ou prioridade inválido.');
    if (!uuid.test(body.chaveCriacao || '')) fail(400, 'Informe uma chave de criação UUID.');
    const client = body.clientId ? catalogById.get(body.clientId) : null;
    if (body.clientId && (!client || client.nome !== values.client)) fail(400, 'Selecione novamente o cliente do catálogo.');
    let buffer;
    if (body.image) {
      if (typeof body.image !== 'string' || body.image.length > 1400000 || !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(body.image)) fail(400, 'Print inválido.');
      buffer = Buffer.from(body.image.split(',')[1], 'base64');
    }
    let image;
    let committed = false;
    let reused = false;
    let result;
    try {
      result = await transaction(async db => {
        // Serialize retries of the same operation, without blocking unrelated creations.
        await db.query('SELECT pg_advisory_xact_lock(hashtextextended($1,0))', [`${req.user.id}:${body.chaveCriacao}`]);
        const existing = (await db.query(`${select} WHERE d.criado_por=$1 AND d.chave_criacao=$2`, [req.user.id, body.chaveCriacao])).rows[0];
        if (existing) { if (existing.excluido_em) fail(409, 'Esta criação já foi excluída. Use uma nova chave.'); reused = true; return present(existing); }
        if (client) await db.query(`INSERT INTO clientes(id,nome,nome_normalizado,logo_path,arquivo_original)
          VALUES($1,$2,$3,$4,$5) ON CONFLICT(id) DO NOTHING`, [clientUUID(client.id), client.nome, client.nome_normalizado, client.logo, client.arquivo_original]);
        const row = (await db.query(`INSERT INTO demandas(client,cliente_id,category,requester,priority,description,criado_por,chave_criacao)
          VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`, [values.client, client ? clientUUID(client.id) : null,
          values.category, values.requester, values.priority, values.description, req.user.id, body.chaveCriacao])).rows[0];
        if (buffer) { image = await storeImage(buffer, body.imageName, cfg.storage); await insertImage(db, row.id, image); }
        await history(db, row.id, req.user, 'criar', null, row);
        return present({ ...row, anexo_id: image?.id });
      });
      committed = true;
    } finally { if (!committed && image) await image.cleanup(); }
    if (!reused) await changed(result.id, 'criar');
    res.status(reused ? 200 : 201).json(result);
  });
  app.get('/api/demandas/:id', async (req, res) => {
    const row = (await pool.query(`${select} WHERE d.id=$1 AND d.excluido_em IS NULL`, [demandId(req)])).rows[0];
    if (!row) fail(404, 'Demanda não encontrada.');
    res.json(present(row));
  });
  app.get('/api/demandas/:id/historico', async (req, res) => {
    const id = demandId(req);
    const row = (await pool.query('SELECT * FROM demandas WHERE id=$1', [id])).rows[0];
    if (!row || (row.excluido_em && req.user.papel !== 'admin')) fail(404, 'Demanda não encontrada.');
    res.json((await pool.query(`SELECT h.id,h.acao,h.antes,h.depois,h.criado_em,u.nome AS usuario
      FROM historico h JOIN usuarios u ON u.id=h.usuario_id WHERE demanda_id=$1 ORDER BY h.id`, [id])).rows);
  });
  async function assignedTo(db, row, user) {
    if (user.papel === 'admin') return true;
    // Ownership comes from immutable user IDs in the audit, never from display names.
    const event = (await db.query("SELECT depois FROM historico WHERE demanda_id=$1 AND acao='assumir' ORDER BY id DESC LIMIT 1", [row.id])).rows[0];
    return event?.depois?.responsavel_id === user.id;
  }
  async function mutate(req, action) {
    const id = demandId(req);
    await transaction(async db => {
      const before = await activeDemand(db, id, true);
      let after;
      if (action === 'assumir') {
        if (before.status !== 'pendente') fail(409, 'Esta demanda já foi assumida ou finalizada.');
        const assigneeId = req.body?.assigneeId || req.user.id;
        if (!uuid.test(assigneeId)) fail(400, 'Responsável inválido.');
        if (req.user.papel !== 'admin' && assigneeId !== req.user.id) fail(403, 'Você só pode assumir para si.');
        const assignee = (await db.query('SELECT id,nome FROM usuarios WHERE id=$1 AND ativo=true', [assigneeId])).rows[0];
        if (!assignee) fail(400, 'Responsável indisponível.');
        after = (await db.query("UPDATE demandas SET status='andamento',assignee=$2,version=version+1,atualizado_em=now() WHERE id=$1 RETURNING *", [id, assignee.nome])).rows[0];
        after.responsavel_id = assignee.id;
      } else if (action === 'finalizar') {
        if (!await assignedTo(db, before, req.user)) fail(403, 'Somente o responsável ou administrador pode finalizar.');
        if (before.status !== 'andamento') fail(409, 'Somente demandas em andamento podem ser finalizadas.');
        after = (await db.query("UPDATE demandas SET status='lancada',version=version+1,atualizado_em=now() WHERE id=$1 RETURNING *", [id])).rows[0];
      } else {
        if (req.user.papel !== 'admin') fail(403, 'Somente administradores podem excluir demandas.');
        after = (await db.query('UPDATE demandas SET excluido_em=now(),version=version+1,atualizado_em=now() WHERE id=$1 RETURNING *', [id])).rows[0];
      }
      await history(db, id, req.user, action, before, after);
    });
    await changed(id, action);
    return id;
  }
  for (const action of ['assumir', 'finalizar']) app.post(`/api/demandas/:id/${action}`, async (req, res) => {
    const id = await mutate(req, action);
    res.json(present((await pool.query(`${select} WHERE d.id=$1`, [id])).rows[0]));
  });
  app.delete('/api/demandas/:id', async (req, res) => { await mutate(req, 'excluir'); res.sendStatus(204); });
  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_IMAGE_BYTES, files: 1, fields: 0, parts: 1 } });
  app.post('/api/demandas/:id/anexo', upload.single('anexo'), async (req, res) => {
    const id = demandId(req);
    if (!req.file) fail(400, 'Envie o arquivo no campo anexo.');
    let image;
    let committed = false;
    try {
      await transaction(async db => {
        const row = await activeDemand(db, id, true);
        if (row.criado_por !== req.user.id && req.user.papel !== 'admin') fail(403, 'Somente o criador ou administrador pode anexar.');
        if ((await db.query('SELECT id FROM anexos WHERE demanda_id=$1', [id])).rowCount) fail(409, 'A demanda já possui um print.');
        image = await storeImage(req.file.buffer, req.file.originalname, cfg.storage);
        await insertImage(db, id, image);
      });
      committed = true;
    } finally { if (!committed && image) await image.cleanup(); }
    await changed(id, 'anexo');
    res.status(201).json({ image: `/api/anexos/${image.id}` });
  });
  app.get('/api/anexos/:id', async (req, res) => {
    if (!uuid.test(req.params.id)) fail(400, 'ID inválido.');
    const row = (await pool.query(`SELECT a.* FROM anexos a JOIN demandas d ON d.id=a.demanda_id
      WHERE a.id=$1 AND d.excluido_em IS NULL`, [req.params.id])).rows[0];
    if (!row) fail(404, 'Anexo não encontrado.');
    const filename = path.resolve(cfg.storage, row.arquivo_path);
    if (!filename.startsWith(path.resolve(cfg.storage) + path.sep)) fail(404, 'Anexo não encontrado.');
    res.type(row.mime).set('Content-Disposition', 'inline').sendFile(filename);
  });
  app.use('/api', (req, res) => res.status(404).json({ error: 'Rota não encontrada.' }));
  app.get('/favicon.ico', (req, res) => res.sendStatus(204));
  app.get('/login', (req, res) => res.sendFile(path.join(publicRoot, 'login.html')));
  app.get(['/', '/index.html', '/central-demandas/', '/central-demandas/index.html'], async (req, res) => {
    if (!await userFor(req.session)) return res.redirect('/login');
    res.set('Cache-Control', 'no-store').sendFile(path.join(publicRoot, 'index.html'));
  });
  // Only the approved public directory is exposed, never .env, SQL or private storage.
  app.use('/central-demandas', express.static(publicRoot, { index: false, dotfiles: 'deny' }));
  app.use(express.static(publicRoot, { index: false, dotfiles: 'deny' }));
  app.use((req, res) => res.sendStatus(404));
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    const status = error instanceof multer.MulterError ? 400 : (error.status || (error.code === '23505' ? 409 : 500));
    if (status >= 500) console.error('Falha interna na requisicao:', error.code || error.name);
    res.status(status).json({ error: status >= 500 ? 'Não foi possível concluir a operação. Tente novamente.'
      : error instanceof multer.MulterError ? 'Envie somente um print de até 1 MB.' : error.message });
  });
  const io = new Server(http, { maxHttpBufferSize: 10000, serveClient: true,
    allowRequest: (req, cb) => cb(null, req.headers.origin === cfg.origin
      || (!req.headers.origin && req.headers.host === new URL(cfg.origin).host
        && (!req.headers['sec-fetch-site'] || req.headers['sec-fetch-site'] === 'same-origin'))) });
  io.engine.use(sessionMiddleware);
  io.use(async (socket, next) => {
    try {
      if (!equal(socket.handshake.auth?.csrfToken, socket.request.session?.csrf) || !await userFor(socket.request.session)) throw new Error();
      next();
    } catch { next(new Error('Sessão inválida. Entre novamente.')); }
  });
  async function socketValid(socket) {
    try {
      await callback(cb => socket.request.session.reload(cb));
      return Boolean(await userFor(socket.request.session));
    } catch { return false; }
  }
  io.on('connection', socket => {
    socket.join(`session:${socket.request.sessionID}`);
    const interval = setInterval(async () => { if (!await socketValid(socket)) socket.disconnect(true); }, 30000);
    interval.unref();
    socket.on('disconnect', () => clearInterval(interval));
  });
  async function changed(id, action) {
    // Publish only after COMMIT; failed mutations never generate a successful update.
    // Revalidate so logout, deactivation and expiry also revoke existing connections.
    await Promise.all([...io.sockets.sockets.values()].map(async socket => {
      if (await socketValid(socket)) socket.emit('demandas:alterada', { id, action });
      else socket.disconnect(true);
    }));
  }
  return { app, http, io, cfg, async close() {
    await new Promise(resolve => io.close(resolve));
    if (http.listening) await new Promise((resolve, reject) => http.close(e => e ? reject(e) : resolve()));
    store.close();
  } };
}

async function main() {
  let runtime;
  try {
    runtime = await createApplication();
    await pool.query('SELECT 1 FROM usuarios LIMIT 1');
    await new Promise((resolve, reject) => { runtime.http.once('error', reject); runtime.http.listen(runtime.cfg.port, runtime.cfg.host, resolve); });
    console.log(`LivreEscolha Demandas: ${runtime.cfg.origin} (PostgreSQL conectado)`);
    let closing = false;
    const shutdown = async () => {
      if (closing) return;
      closing = true;
      const deadline = setTimeout(() => process.exit(1), 10000).unref();
      try { await runtime.close(); await pool.end(); clearTimeout(deadline); }
      catch { console.error('Falha ao encerrar conexoes.'); process.exitCode = 1; }
    };
    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
  } catch (error) {
    console.error('Servidor nao iniciado:', error.code || (error.status ? error.message : error.name), 'Verifique .env, PostgreSQL e porta.');
    if (runtime) await runtime.close();
    await pool.end(); process.exitCode = 1;
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) await main();
