import './config.js';
import pg from 'pg';
export const pool = new pg.Pool({ max: 10, connectionTimeoutMillis: 5000, idleTimeoutMillis: 30000,
  statement_timeout: 15000, application_name: 'livre_escolha_demandas' });
pool.on('error', () => console.error('Conexao PostgreSQL interrompida. Verifique o servico.'));
export async function transaction(work) {
  const db = await pool.connect();
  try { await db.query('BEGIN'); const result = await work(db); await db.query('COMMIT'); return result; }
  catch (error) { await db.query('ROLLBACK'); throw error; }
  finally { db.release(); }
}
