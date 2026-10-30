import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pool, transaction } from '../src/db.js';
export async function migrate() {
  await transaction(async db => {
    await db.query("SELECT pg_advisory_xact_lock(197429, 1)");
    await db.query('CREATE TABLE IF NOT EXISTS schema_migrations (nome text PRIMARY KEY, sha256 text NOT NULL, aplicado_em timestamptz NOT NULL DEFAULT now())');
    for (const name of (await readdir(new URL('../migrations/', import.meta.url))).filter(n => n.endsWith('.sql')).sort()) {
      const sql = await readFile(new URL(`../migrations/${name}`, import.meta.url), 'utf8');
      const hash = createHash('sha256').update(sql).digest('hex');
      const { rows } = await db.query('SELECT sha256 FROM schema_migrations WHERE nome=$1', [name]);
      if (rows.length) { if (rows[0].sha256 !== hash) throw new Error(`Migracao aplicada foi alterada: ${name}`); continue; }
      await db.query(sql);
      await db.query('INSERT INTO schema_migrations(nome,sha256) VALUES($1,$2)', [name, hash]);
    }
  });
}
if (process.argv[1]?.endsWith('migrate.js')) {
  try { await migrate(); console.log('Migracoes PostgreSQL conferidas e aplicadas.'); }
  catch (error) { console.error('Falha na migracao:', error.code || error.message); process.exitCode = 1; }
  finally { await pool.end(); }
}
