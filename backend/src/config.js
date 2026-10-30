import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
export const backendRoot = fileURLToPath(new URL('../', import.meta.url));
dotenv.config({ path: process.env.ENV_FILE || path.join(backendRoot, '.env'), quiet: true });
export function config() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 48) throw new Error('Configure SESSION_SECRET (minimo 48 caracteres) no .env.');
  const origin = new URL(process.env.APP_ORIGIN || 'http://127.0.0.1:3000').origin;
  const secure = process.env.COOKIE_SECURE === 'true';
  if (process.env.NODE_ENV === 'production' && (!secure || !origin.startsWith('https:'))) {
    throw new Error('Producao exige HTTPS e COOKIE_SECURE=true.');
  }
  return { secret, origin, secure, host: process.env.HOST || '127.0.0.1',
    port: Number(process.env.PORT || 3000), storage: path.resolve(process.env.STORAGE_DIR || path.join(backendRoot, 'storage')) };
}
