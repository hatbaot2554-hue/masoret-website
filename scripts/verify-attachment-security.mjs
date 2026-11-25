import assert from 'node:assert/strict';
import sharp from 'sharp';
import { validateAttachment } from '../app/lib/validateAttachment.mjs';
const input = await sharp({ create: { width: 4, height: 4, channels: 3, background: '#ffffff' } }).png().toBuffer();
const file = { name: '../test.png', dataUrl: 'data:image/png;base64,' + input.toString('base64') };
const result = await validateAttachment(file);
assert.equal(result.name, 'test.png');
assert.equal(result.type, 'image/png');
assert.equal((await sharp(Buffer.from(result.dataUrl.split(',')[1], 'base64')).metadata()).format, 'png');
for (const bad of ['data:text/html;base64,PGgxPmJhZDwvaDE+', 'data:image/svg+xml;base64,PHN2Zz4=', 'data:application/pdf;base64,JVBERi0=', 'https://example.invalid/file', 'data:image/png;base64,PGgxPmJhZDwvaDE+']) {
  await assert.rejects(validateAttachment({ dataUrl: bad }));
}
await assert.rejects(validateAttachment({ dataUrl: 'data:image/png;base64,' + 'A'.repeat(3000000) }));
const withTail = { ...file, dataUrl: 'data:image/png;base64,' + Buffer.concat([input, Buffer.from('<script>test-only</script>')]).toString('base64') };
const cleaned = await validateAttachment(withTail);
assert.ok(!Buffer.from(cleaned.dataUrl.split(',')[1], 'base64').includes(Buffer.from('<script>')));
console.log('PASS: valid images re-encoded, paths sanitized, active types/fake images/oversize rejected, appended payload removed.');
