import sharp from 'sharp';

const MAX_BYTES = 2 * 1024 * 1024;
export async function validateAttachment(file) {
  if (file == null) return null;
  if (typeof file.dataUrl !== 'string' || file.dataUrl.length > Math.ceil(MAX_BYTES / 3) * 4 + 40) throw new Error('Invalid attachment size');
  const match = /^data:image\/(png|jpeg);base64,([A-Za-z0-9+/]+={0,2})$/.exec(file.dataUrl);
  if (!match) throw new Error('Only PNG and JPEG attachments are supported');
  const buffer = Buffer.from(match[2], 'base64');
  if (!buffer.length || buffer.length > MAX_BYTES || buffer.toString('base64') !== match[2]) throw new Error('Invalid attachment encoding');
  const decoder = sharp(buffer, { limitInputPixels: 16000000, failOn: 'warning', animated: false });
  const info = await decoder.metadata();
  if (!['png', 'jpeg'].includes(info.format) || (info.pages || 1) > 1 || info.format !== match[1]) throw new Error('Invalid attachment format');
  // Decode and re-encode pixels: do not preserve uploaded metadata or trailing payloads.
  const output = await decoder.png().toBuffer();
  if (output.length > MAX_BYTES) throw new Error('Processed attachment is too large');
  const name = String(file.name || 'engraving').replace(/\.[^.]*$/, '').replace(/[^\p{L}\p{N} _-]/gu, '').slice(0, 80) || 'engraving';
  return { name: name + '.png', type: 'image/png', size: output.length, dataUrl: 'data:image/png;base64,' + output.toString('base64') };
}
