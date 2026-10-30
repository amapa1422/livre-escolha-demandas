import sharp from 'sharp';
import { createHash, randomUUID } from 'node:crypto';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';

export const MAX_IMAGE_BYTES = 1024 * 1024;
export async function validateImage(buffer) {
  if (!Buffer.isBuffer(buffer) || !buffer.length || buffer.length > MAX_IMAGE_BYTES) {
    throw Object.assign(new Error('Escolha uma imagem de até 1 MB.'), { status: 400 });
  }
  try {
    const image = sharp(buffer, { limitInputPixels: 40000000, animated: true, failOn: 'warning' });
    const meta = await image.metadata();
    if (!['png', 'jpeg', 'webp'].includes(meta.format) || (meta.pages || 1) !== 1) throw new Error();
    // Decode every pixel, including files whose header looks valid but content is truncated.
    await image.clone().raw().toBuffer();
    return { mime: `image/${meta.format}`, width: meta.width, height: meta.height,
      sha256: createHash('sha256').update(buffer).digest('hex') };
  } catch {
    throw Object.assign(new Error('Use uma imagem PNG, JPG ou WebP válida, sem animação (até 40 milhões de pixels).'), { status: 400 });
  }
}

export async function storeImage(buffer, name, storage) {
  const meta = await validateImage(buffer);
  const id = randomUUID();
  const relative = `anexos/${id}.${meta.mime.split('/')[1]}`;
  const absolute = path.join(storage, relative);
  await mkdir(path.dirname(absolute), { recursive: true });
  try { await writeFile(absolute, buffer, { flag: 'wx', mode: 0o600 }); }
  catch (error) { await rm(absolute, { force: true }).catch(() => {}); throw error; }
  return { id, relative, meta, name: path.basename(name || 'print').slice(0, 255),
    bytes: buffer.length, cleanup: () => rm(absolute, { force: true }) };
}
