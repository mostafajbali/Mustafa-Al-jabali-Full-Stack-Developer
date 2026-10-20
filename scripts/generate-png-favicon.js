import fs from 'fs';
import zlib from 'zlib';

function createCRC32Table() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c >>> 0;
  }
  return table;
}

const crcTable = createCRC32Table();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(8 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const typeAndData = buf.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

function renderFavicon(size) {
  // buffer size * size * 4 (RGBA)
  const img = Buffer.alloc(size * size * 4);
  
  function setPixel(x, y, r, g, b, a = 255) {
    if (x < 0 || x >= size || y < 0 || y >= size) return;
    const idx = (y * size + x) * 4;
    // Alpha blending
    const srcA = a / 255;
    const dstA = img[idx + 3] / 255;
    const outA = srcA + dstA * (1 - srcA);
    if (outA > 0) {
      img[idx] = Math.round((r * srcA + img[idx] * dstA * (1 - srcA)) / outA);
      img[idx + 1] = Math.round((g * srcA + img[idx + 1] * dstA * (1 - srcA)) / outA);
      img[idx + 2] = Math.round((b * srcA + img[idx + 2] * dstA * (1 - srcA)) / outA);
      img[idx + 3] = Math.round(outA * 255);
    }
  }

  function drawLine(x0, y0, x1, y1, r, g, b, width = 1.5) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.hypot(dx, dy);
    const steps = Math.ceil(len * 3);
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const cx = x0 + dx * t;
      const cy = y0 + dy * t;
      for (let ox = -Math.ceil(width); ox <= Math.ceil(width); ox++) {
        for (let oy = -Math.ceil(width); oy <= Math.ceil(width); oy++) {
          const dist = Math.hypot(ox, oy);
          if (dist <= width) {
            const alpha = Math.max(0, Math.min(255, Math.round((1 - dist / (width + 0.5)) * 255)));
            setPixel(Math.round(cx + ox), Math.round(cy + oy), r, g, b, alpha);
          }
        }
      }
    }
  }

  // Draw rounded rect background
  const radius = size * 0.22;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Determine distance from rounded box
      const dx = Math.max(0, Math.max(radius - x, x - (size - 1 - radius)));
      const dy = Math.max(0, Math.max(radius - y, y - (size - 1 - radius)));
      const dist = Math.hypot(dx, dy);
      if (dist <= radius) {
        // gradient navy fill
        const gradT = (x + y) / (size * 2);
        const bgR = Math.round(15 * (1 - gradT) + 2 * gradT);
        const bgG = Math.round(23 * (1 - gradT) + 6 * gradT);
        const bgB = Math.round(42 * (1 - gradT) + 23 * gradT);
        
        // Edge antialiasing
        const edgeDist = radius - dist;
        const alpha = edgeDist < 1 ? Math.round(edgeDist * 255) : 255;
        if (alpha > 0) {
          setPixel(x, y, bgR, bgG, bgB, alpha);
          
          // Border glow on outer edge (within 1.5px)
          if (edgeDist <= 1.8) {
            const borderAlpha = Math.round((1 - Math.abs(edgeDist - 0.9) / 0.9) * 220);
            setPixel(x, y, 0, 240, 255, Math.max(0, borderAlpha));
          }
        }
      }
    }
  }

  // Draw Code Brackets < / >
  const scale = size / 32;
  const strokeW = Math.max(1, 1.4 * scale);

  // Left bracket <
  drawLine(11 * scale, 10 * scale, 5.5 * scale, 16 * scale, 0, 240, 255, strokeW);
  drawLine(5.5 * scale, 16 * scale, 11 * scale, 22 * scale, 0, 240, 255, strokeW);

  // Slash /
  drawLine(18 * scale, 8 * scale, 14 * scale, 24 * scale, 56, 189, 248, strokeW * 0.9);

  // Right bracket >
  drawLine(21 * scale, 10 * scale, 26.5 * scale, 16 * scale, 0, 240, 255, strokeW);
  drawLine(26.5 * scale, 16 * scale, 21 * scale, 22 * scale, 0, 240, 255, strokeW);

  // Status dot
  const dotY = Math.round(5.5 * scale);
  const dotX = Math.round(16 * scale);
  const dotR = Math.max(1, Math.round(1.2 * scale));
  for (let oy = -dotR; oy <= dotR; oy++) {
    for (let ox = -dotR; ox <= dotR; ox++) {
      if (Math.hypot(ox, oy) <= dotR) {
        setPixel(dotX + ox, dotY + oy, 0, 240, 255, 255);
      }
    }
  }

  // Build raw uncompressed rows with filter type 0
  const rowLen = 1 + size * 4;
  const uncompressed = Buffer.alloc(rowLen * size);
  for (let y = 0; y < size; y++) {
    const rowOffset = y * rowLen;
    uncompressed[rowOffset] = 0; // Filter: None
    img.copy(uncompressed, rowOffset + 1, y * size * 4, (y + 1) * size * 4);
  }

  const compressed = zlib.deflateSync(uncompressed, { level: 9 });

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);
  ihdrData.writeUInt32BE(size, 4);
  ihdrData[8] = 8; // Bit depth
  ihdrData[9] = 6; // Color type: RGBA
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Generate sizes
fs.writeFileSync('public/favicon-16x16.png', renderFavicon(16));
fs.writeFileSync('public/favicon-32x32.png', renderFavicon(32));
fs.writeFileSync('public/favicon.png', renderFavicon(64));
fs.writeFileSync('public/apple-touch-icon.png', renderFavicon(180));
console.log('Successfully generated favicon-16x16.png, favicon-32x32.png, favicon.png, apple-touch-icon.png');
