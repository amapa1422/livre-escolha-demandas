import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
const derive = promisify(scrypt);
const options = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
export async function hashPassword(password) {
  if (typeof password !== 'string' || password.length < 12 || password.length > 128) throw new Error('Senha deve ter entre 12 e 128 caracteres.');
  const salt = randomBytes(16).toString('hex');
  const key = await derive(password, salt, 64, options);
  return `scrypt$32768$8$1$${salt}$${key.toString('hex')}`;
}
export async function verifyPassword(password, encoded) {
  if (typeof password !== 'string' || password.length > 128) return false;
  const [, n, r, p, salt, hex] = encoded.split('$');
  if (n !== '32768' || r !== '8' || p !== '1' || !/^[a-f0-9]{128}$/.test(hex || '')) return false;
  const key = await derive(password, salt, 64, options);
  return timingSafeEqual(key, Buffer.from(hex, 'hex'));
}
