import { createInterface } from 'node:readline/promises';
import { Writable } from 'node:stream';
import { randomUUID } from 'node:crypto';
import { hashPassword } from '../src/password.js';
import { pool } from '../src/db.js';
let hidden = false;
const output = new Writable({ write(chunk, encoding, cb) { if (!hidden) process.stdout.write(chunk, encoding); cb(); } });
const rl = createInterface({ input: process.stdin, output, terminal: true });
try {
  const nome = (await rl.question('Nome: ')).trim();
  const email = (await rl.question('Email individual: ')).trim().toLowerCase();
  const papel = (await rl.question('Papel (funcionario/admin): ')).trim() || 'funcionario';
  process.stdout.write('Senha (12 a 128 caracteres, oculta): '); hidden = true;
  const password = await rl.question(''); hidden = false; process.stdout.write('\n');
  if (!nome || nome.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !['admin','funcionario'].includes(papel)) throw new Error('Dados invalidos.');
  await pool.query('INSERT INTO usuarios(id,nome,email,senha_hash,papel) VALUES($1,$2,$3,$4,$5)', [randomUUID(), nome, email, await hashPassword(password), papel]);
  console.log('Usuario individual criado. Nenhuma senha padrao foi definida.');
} catch (error) { console.error('Usuario nao criado:', error.code || error.message); process.exitCode = 1; }
finally { rl.close(); await pool.end(); }
