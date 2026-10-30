// Isolated schema in the existing PostgreSQL database. Never edits public users/data.
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID, createHash } from 'node:crypto';
import pg from 'pg';
import sharp from 'sharp';
import { io as clientSocket } from 'socket.io-client';
import { once } from 'node:events';
import { pool } from '../src/db.js';
import { backendRoot } from '../src/config.js';
import { hashPassword } from '../src/password.js';
import { createApplication } from '../src/server.js';
import { chromium } from 'playwright-core';

const schema = `qa_backend_${randomUUID().replaceAll('-', '')}`;
assert.match(schema, /^qa_backend_[a-f0-9]{32}$/);
const adminPool = new pg.Pool({ max: 2 });
const root = path.resolve(backendRoot, '..');
const evidence = path.join(root, '.qa/backend');
const storage = path.join(backendRoot, 'storage', schema);
const origin = 'http://127.0.0.1:3001';
const checks = [];
let runtime, browser;
let createdSchema = false;
const password = randomUUID() + randomUUID();
const users = ['admin', 'funcionario', 'funcionario'].map((papel, i) => ({ id: randomUUID(), nome: `QA Pessoa ${i}`, email: `qa${i}@example.invalid`, papel }));
async function check(name, work) { await work(); checks.push(name); console.log(`OK: ${name}`); }
async function fingerprint() {
  // Sensitive content remains in memory only; report only whether it changed.
  const data = (await adminPool.query(`SELECT 'usuarios' t,coalesce(jsonb_agg(to_jsonb(u) ORDER BY id),'[]') data FROM public.usuarios u
    UNION ALL SELECT 'demandas',coalesce(jsonb_agg(to_jsonb(d) ORDER BY id),'[]') FROM public.demandas d
    UNION ALL SELECT 'anexos',coalesce(jsonb_agg(to_jsonb(a) ORDER BY id),'[]') FROM public.anexos a
    UNION ALL SELECT 'historico',coalesce(jsonb_agg(to_jsonb(h) ORDER BY id),'[]') FROM public.historico h
    UNION ALL SELECT 'clientes',coalesce(jsonb_agg(to_jsonb(c) ORDER BY id),'[]') FROM public.clientes c`)).rows;
  return createHash('sha256').update(JSON.stringify(data)).digest('hex');
}
const before = await fingerprint();
function client() {
  let cookie, csrf;
  return {
    get cookie() { return cookie; }, get csrf() { return csrf; },
    async call(url, method = 'GET', body, extra = {}) {
      const response = await fetch(origin + url, { method, redirect: 'manual', headers: {
        ...(cookie ? { Cookie: cookie } : {}), ...(method !== 'GET' ? { Origin: origin, 'X-CSRF-Token': csrf } : {}),
        ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...extra },
        body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body) });
      const setCookie = response.headers.get('set-cookie');
      if (setCookie) cookie = setCookie.split(';')[0];
      const text = await response.text();
      let data; try { data = JSON.parse(text); } catch { data = text; }
      if (data?.csrfToken) csrf = data.csrfToken;
      return { status: response.status, data, headers: response.headers };
    },
    async login(user) {
      await this.call('/api/auth/session');
      const old = cookie;
      const response = await this.call('/api/auth/login', 'POST', { email: user.email.toUpperCase(), password });
      assert.equal(response.status, 200); assert.notEqual(cookie, old);
      assert.match(response.headers.get('set-cookie'), /HttpOnly/i);
      assert.match(response.headers.get('set-cookie'), /SameSite=Strict/i);
    }
  };
}
const payload = () => ({ client: 'QA Empresa', category: 'CANCELAMENTO', requester: 'QA Solicitante', priority: 'Alta', description: 'Dados sintéticos de teste', chaveCriacao: randomUUID() });
const sockets = [];
async function connect(c) {
  const socket = clientSocket(origin, { auth: { csrfToken: c.csrf }, extraHeaders: { Cookie: c.cookie, Origin: origin }, reconnection: false });
  sockets.push(socket);
  await Promise.race([once(socket, 'connect'), once(socket, 'connect_error').then(([error]) => { throw error; }),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Socket timeout')), 5000).unref())]);
  return socket;
}
try {
  await adminPool.query(`CREATE SCHEMA "${schema}"`); createdSchema = true;
  pool.options.options = `-c search_path=${schema}`;
  await pool.query(await readFile(path.join(backendRoot, 'migrations/001_initial.sql'), 'utf8'));
  for (const user of users) await pool.query('INSERT INTO usuarios(id,nome,email,papel,senha_hash) VALUES($1,$2,$3,$4,$5)',
    [user.id, user.nome, user.email, user.papel, await hashPassword(password)]);
  runtime = await createApplication({ port: 3001, origin, host: '127.0.0.1', storage });
  // A read-only copy of the pre-change frontend provides the visual baseline.
  const backup = path.join(root, '_CONTROLE_PROJETO/backups/2026-10-30_105255_backend_1b8df768/central-demandas');
  await new Promise((resolve, reject) => { runtime.http.once('error', reject); runtime.http.listen(3001, '127.0.0.1', resolve); });
  const a = client(), f = client(), other = client(), anonymous = client();
  await check('PostgreSQL e HTTP iniciados; rotas e arquivos privados protegidos', async () => {
    assert.equal((await a.call('/api/health')).status, 200);
    assert.equal((await anonymous.call('/api/demandas')).status, 401);
    assert.equal((await anonymous.call('/')).status, 302);
    for (const url of ['/backend/.env', '/.env', '/storage/', '/migrations/001_initial.sql']) assert.equal((await a.call(url)).status, 404);
  });
  await check('Login admin e funcionários com scrypt e rotação de sessão', async () => {
    await a.login(users[0]); await f.login(users[1]); await other.login(users[2]);
    assert.equal((await a.call('/api/auth/session')).data.user.papel, 'admin');
    assert.equal((await f.call('/api/auth/session')).data.user.papel, 'funcionario');
    assert.equal((await f.call('/api/usuarios')).data.length, 1);
    assert.equal((await a.call('/api/usuarios')).data.length, 3);
  });
  await check('Senha inválida, CSRF, origem externa e login protegido', async () => {
    const bad = client(); await bad.call('/api/auth/session');
    assert.equal((await bad.call('/api/auth/login', 'POST', { email: users[0].email, password: 'incorreta' })).status, 401);
    assert.equal((await f.call('/api/demandas', 'POST', payload(), { 'X-CSRF-Token': '' })).status, 403);
    assert.equal((await f.call('/api/demandas', 'POST', payload(), { Origin: 'https://externo.invalid' })).status, 403);
    assert.equal((await bad.call('/api/auth/login', 'POST', { email: users[0].email, password }, { 'X-CSRF-Token': '' })).status, 403);
  });
  const s1 = await connect(f), s2 = await connect(other);
  let id;
  await check('Criação, persistência, idempotência concorrente e dois sockets autenticados', async () => {
    const event1 = once(s1, 'demandas:alterada'), event2 = once(s2, 'demandas:alterada');
    const body = payload();
    const results = await Promise.all([f.call('/api/demandas', 'POST', body), f.call('/api/demandas', 'POST', body)]);
    assert.deepEqual(results.map(r => r.status).sort(), [200, 201]);
    assert.equal(results[0].data.id, results[1].data.id); id = results[0].data.id;
    assert.equal((await event1)[0].id, id); assert.equal((await event2)[0].id, id);
    assert.equal((await pool.query('SELECT status FROM demandas WHERE id=$1', [id])).rows[0].status, 'pendente');
    assert.equal((await f.call(`/api/demandas/${id}`)).data.id, id);
  });
  await check('Corrida de tomada: exatamente um sucesso e um conflito', async () => {
    const results = await Promise.all([f.call(`/api/demandas/${id}/assumir`, 'POST'), other.call(`/api/demandas/${id}/assumir`, 'POST')]);
    assert.deepEqual(results.map(r => r.status).sort(), [200, 409]);
    const winner = results[0].status === 200 ? f : other;
    const loser = winner === f ? other : f;
    assert.equal((await loser.call(`/api/demandas/${id}/finalizar`, 'POST')).status, 403);
    assert.equal((await winner.call(`/api/demandas/${id}/finalizar`, 'POST')).status, 200);
    assert.equal((await winner.call(`/api/demandas/${id}/finalizar`, 'POST')).status, 409);
    assert.equal((await f.call(`/api/demandas/${id}`, 'DELETE')).status, 403);
  });
  let imageId;
  const png = await sharp({ create: { width: 32, height: 24, channels: 3, background: '#f58228' } }).png().toBuffer();
  await check('PNG privado na criação, logo do catálogo e validação do print', async () => {
    const catalog = (await f.call('/api/clientes')).data;
    const created = await f.call('/api/demandas', 'POST', { ...payload(), client: catalog[0].nome, clientId: catalog[0].id,
      image: `data:image/png;base64,${png.toString('base64')}`, imageName: 'print.png' });
    assert.equal(created.status, 201); assert.equal(created.data.clientId, catalog[0].id);
    imageId = created.data.id;
    assert.equal((await f.call(created.data.image)).status, 200);
    assert.equal((await anonymous.call(created.data.image)).status, 401);
    assert.equal((await f.call('/api/demandas', 'POST', { ...payload(), image: 'data:image/png;base64,YWJj' })).status, 400);
    assert.equal((await f.call('/api/demandas', 'POST', { ...payload(), category: 'INEXISTENTE' })).status, 400);
  });
  await check('Upload multipart: criador/admin, um anexo, MIME real e limite', async () => {
    const row = (await f.call('/api/demandas', 'POST', payload())).data;
    const form = () => { const body = new FormData(); body.append('anexo', new Blob([png], { type: 'image/png' }), 'qa.png'); return body; };
    assert.equal((await other.call(`/api/demandas/${row.id}/anexo`, 'POST', form())).status, 403);
    assert.equal((await f.call(`/api/demandas/${row.id}/anexo`, 'POST', form())).status, 201);
    assert.equal((await f.call(`/api/demandas/${row.id}/anexo`, 'POST', form())).status, 409);
    const newRow = (await f.call('/api/demandas', 'POST', payload())).data;
    const large = new FormData(); large.append('anexo', new Blob([Buffer.alloc(1048577)]), 'grande.png');
    assert.equal((await f.call(`/api/demandas/${newRow.id}/anexo`, 'POST', large)).status, 400);
  });
  await check('Histórico transacional e exclusão lógica somente admin', async () => {
    assert.deepEqual((await f.call(`/api/demandas/${id}/historico`)).data.map(h => h.acao), ['criar', 'assumir', 'finalizar']);
    assert.equal((await a.call(`/api/demandas/${id}`, 'DELETE')).status, 204);
    assert.equal((await a.call(`/api/demandas/${id}`)).status, 404);
    assert.deepEqual((await a.call(`/api/demandas/${id}/historico`)).data.map(h => h.acao), ['criar', 'assumir', 'finalizar', 'excluir']);
    assert.equal((await f.call(`/api/demandas/${id}/historico`)).status, 404);
    assert.ok((await pool.query('SELECT excluido_em FROM demandas WHERE id=$1', [id])).rows[0].excluido_em);
  });
  await check('Socket rejeita visitante; logout revoga HTTP e conexão aberta', async () => {
    const forbidden = clientSocket(origin, { extraHeaders: { Origin: origin }, reconnection: false }); sockets.push(forbidden);
    await once(forbidden, 'connect_error');
    const disconnected = once(s2, 'disconnect');
    assert.equal((await other.call('/api/auth/logout', 'POST')).status, 204); await disconnected;
    assert.equal((await other.call('/api/demandas')).status, 401);
  });
  await mkdir(evidence, { recursive: true });
  const consoleErrors = [];
  browser = await chromium.launch({ executablePath: process.env.QA_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const context1 = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const context2 = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  for (const ctx of [context1, context2]) ctx.on('page', p => {
    p.on('pageerror', error => consoleErrors.push(error.message));
    p.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  });
  const p1 = await context1.newPage(), p2 = await context2.newPage();
  async function browserLogin(page, user) {
    await page.goto(origin);
    await page.locator('#email').fill(user.email); await page.locator('#password').fill(password);
    await page.getByRole('button', { name: 'Entrar', exact: true }).click();
    await page.waitForURL(origin + '/'); await page.locator('.ticket').first().waitFor();
  }
  await check('Chrome: login admin/funcionário, criar, visualizar em dois contextos', async () => {
    await browserLogin(p1, users[0]); await browserLogin(p2, users[1]);
    await p1.locator('#openModal').click();
    await p1.locator('#client').fill('QA Navegadores'); await p1.locator('#category').selectOption('MUDANÇA');
    await p1.locator('#requester').fill('QA');
    await p1.locator('#attachment').setInputFiles({ name: 'qa.png', mimeType: 'image/png', buffer: png });
    await p1.getByRole('button', { name: 'Criar demanda', exact: true }).click();
    await p1.waitForFunction(() => !document.getElementById('createOverlay').classList.contains('show'));
    await p2.locator('.ticket').filter({ hasText: 'QA Navegadores' }).waitFor();
    await p1.reload(); await p1.locator('.ticket').filter({ hasText: 'QA Navegadores' }).waitFor();
  });
  await check('Chrome: assumir/finalizar sincronizados, detalhes, print, zoom e histórico', async () => {
    const ticket = p2.locator('.ticket').filter({ hasText: 'QA Navegadores' });
    await ticket.getByRole('button', { name: /Assumir caso/ }).click();
    assert.equal(await p2.locator('#agent').inputValue(), users[1].id);
    await p2.locator('#assumeForm').getByRole('button', { name: 'Confirmar', exact: true }).click();
    await p1.locator('.ticket').filter({ hasText: 'QA Navegadores' }).getByRole('button', { name: /Marcar lançada/ }).waitFor();
    p2.once('dialog', dialog => dialog.accept());
    await ticket.getByRole('button', { name: /Marcar lançada/ }).click();
    await p1.waitForFunction(() => [...document.querySelectorAll('.ticket')].some(t => t.textContent.includes('QA Navegadores') && t.querySelector('.badge.done')));
    await ticket.getByRole('button', { name: /Ver detalhes/ }).click();
    await p2.locator('.zoomable').waitFor(); await p2.locator('.zoom-hint').click();
    await p2.locator('#zoomOverlay.show').waitFor();
    assert.equal(await p2.locator('#zoomImage').evaluate(img => img.complete && img.naturalWidth > 0), true);
    await p2.locator('#zoomClose').click();
    assert.equal(await p2.locator('#removeDemand').count(), 0);
    await p2.locator('#showHistory').click();
    await p2.locator('#demandHistory').getByText(/finalizar/).waitFor();
    await p2.locator('[data-close="detailOverlay"]').first().click();
  });
  await check('Chrome: filtros, logos, preferência da barra e preservação de localStorage', async () => {
    await p1.locator('#search').fill('QA Navegadores');
    assert.equal(await p1.locator('.ticket').count(), 1);
    await p1.locator('#search').fill('');
    await p1.locator('#typeFilter').selectOption('CONSULTA DE FIDELIDADE'); assert.equal(await p1.locator('.ticket').count(), 0);
    await p1.locator('#typeFilter').selectOption('');
    assert.ok(await p1.locator('.client-logo').count());
    await p1.locator('#toggleSidebar').click(); await p1.reload();
    await p1.waitForFunction(() => document.body.classList.contains('sidebar-closed'));
    await p1.locator('#toggleSidebar').click();
    assert.equal(await p1.evaluate(() => localStorage.getItem('livre_escolha_demandas_demo_v1')), null);
  });
  const cssBefore = await readFile(path.join(backup, 'css/style.css'));
  await check('CSS aprovado idêntico byte a byte; geometria/estilos comparados em 5 larguras', async () => {
    assert.deepEqual(await readFile(path.join(root, 'central-demandas/css/style.css')), cssBefore);
    const records = (await f.call('/api/demandas')).data;
    const baseContext = await browser.newContext();
    await baseContext.addInitScript(records => localStorage.setItem('livre_escolha_demandas_demo_v1', JSON.stringify(records)), records);
    await baseContext.route('**/baseline/**', async route => {
      const relative = new URL(route.request().url()).pathname.slice('/baseline/'.length);
      const filename = path.resolve(backup, relative);
      if (!filename.startsWith(backup + path.sep)) return route.abort();
      try { await route.fulfill({ path: filename }); }
      catch { await route.fulfill({ path: path.join(root, 'central-demandas', relative) }); }
    });
    const basePage = await baseContext.newPage();
    await basePage.goto(origin + '/baseline/index.html');
    const snapshot = page => page.evaluate(() => ['.app', '.main', '.metrics', '.toolbar', '.tabs', '.ticket', '.client-logo'].map(selector => {
      const el = document.querySelector(selector); if (!el) return null;
      const rect = el.getBoundingClientRect(), s = getComputedStyle(el);
      return { selector, x: Math.round(rect.x), width: Math.round(rect.width), height: Math.round(rect.height),
        background: s.backgroundColor, color: s.color, font: s.fontFamily, radius: s.borderRadius };
    }));
    for (const width of [1920, 1366, 768, 390, 320]) {
      await p1.setViewportSize({ width, height: 900 }); await basePage.setViewportSize({ width, height: 900 });
      await p1.locator('.ticket').first().waitFor(); await basePage.locator('.ticket').first().waitFor();
      // Wait for the approved sidebar and responsive transitions to settle.
      await p1.waitForTimeout(250);
      assert.deepEqual(await snapshot(p1), await snapshot(basePage), `Visual ${width}px`);
      assert.equal(await p1.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      if ([1366, 390].includes(width)) await p1.screenshot({ path: path.join(evidence, `desktop-${width}.png`), fullPage: true });
    }
    await baseContext.close();
  });
  await check('Chrome: logout e proteção após encerrar sessão', async () => {
    await p2.getByRole('button', { name: 'Sair', exact: true }).click();
    await p2.waitForURL(origin + '/login');
    await p2.goto(origin); await p2.waitForURL(origin + '/login');
  });
  await check('Navegadores sem erros de JavaScript/console', async () => assert.deepEqual(consoleErrors, []));
  await check('Dados e hashes dos usuários reais preservados', async () => assert.equal(await fingerprint(), before));
  await writeFile(path.join(evidence, 'results.json'), JSON.stringify({ recordedAt: new Date().toISOString(), checks, consoleErrors,
    database: 'Existing PostgreSQL, isolated temporary schema', publicDataUnchanged: true,
    actualUserPasswordsTested: false, note: 'Login testado com contas sintéticas; nenhuma senha real solicitada ou redefinida.' }, null, 2));
} finally {
  for (const socket of sockets) socket.disconnect();
  await browser?.close();
  await runtime?.close();
  await pool.end();
  if (createdSchema) await adminPool.query(`DROP SCHEMA "${schema}" CASCADE`);
  await adminPool.end();
  // Only generated private fixture files, with strict containment check.
  assert.equal(path.dirname(storage), path.join(backendRoot, 'storage'));
  assert.match(path.basename(storage), /^qa_backend_[a-f0-9]{32}$/);
  await rm(storage, { recursive: true, force: true });
}
console.log(`${checks.length} grupos de testes aprovados.`);
