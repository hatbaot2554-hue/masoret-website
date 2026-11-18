import assert from 'node:assert/strict';
import { fileToAttachment, MAX_ATTACHMENT_BYTES } from '../app/lib/engravingAttachment.mjs';
assert.equal(await fileToAttachment(null), null);
await assert.rejects(fileToAttachment({ size: MAX_ATTACHMENT_BYTES + 1 }), /2MB/);
globalThis.FileReader = class {
  readAsDataURL() { this.result = 'data:application/pdf;base64,dGVzdA=='; this.onload(); }
};
assert.equal((await fileToAttachment({ name: 'test.pdf', type: 'application/pdf', size: 4 })).dataUrl, 'data:application/pdf;base64,dGVzdA==');
globalThis.FileReader = class { readAsDataURL() { this.onerror(); } };
await assert.rejects(fileToAttachment({ size: 4 }));
globalThis.FileReader = class { readAsDataURL() { this.result = null; this.onload(); } };
await assert.rejects(fileToAttachment({ size: 4 }));
console.log('PASS: empty, oversized, complete attachment, read failure and invalid result.');
