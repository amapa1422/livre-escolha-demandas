import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { validateImage, MAX_IMAGE_BYTES } from '../src/images.js';

test('decodifica PNG/JPEG/WebP e rejeita arquivos falsos, truncados e grandes', async () => {
  for (const format of ['png', 'jpeg', 'webp']) {
    const buffer = await sharp({ create: { width: 32, height: 24, channels: 3, background: '#f58228' } })[format]().toBuffer();
    const actual = await validateImage(buffer);
    assert.equal(actual.mime, `image/${format}`);
    assert.equal(actual.width, 32); assert.equal(actual.height, 24);
    await assert.rejects(validateImage(buffer.subarray(0, 16)));
  }
  await assert.rejects(validateImage(Buffer.from('<svg><script>alert(1)</script></svg>')));
  await assert.rejects(validateImage(Buffer.alloc(MAX_IMAGE_BYTES + 1)));
});
