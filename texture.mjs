// Zero-dependency procedural seamless 640x640 Retina parchment relief generator.
// Keeps Notara's exact light Techo paper color (#ece7dc) unchanged while rendering
// unmistakable raking-light vellum creases, cold-press dimples, fibers & rag specks.

import { deflateSync } from 'node:zlib';

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcInput = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function encodeRgbPng(width, height, rgb) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = width * 3 + 1;
  const raw = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y += 1) {
    const rowStart = y * stride;
    raw[rowStart] = 0;
    rgb.copy(raw, rowStart + 1, y * width * 3, (y + 1) * width * 3);
  }
  const idat = deflateSync(raw, { level: 6 });
  return Buffer.concat([
    signature,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', idat),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

function hash2d(ix, iy, seed) {
  let h = (ix * 374761393 + iy * 668265263 + seed * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

function periodicNoise(u, v, period, seed) {
  const x = (((u % 1) + 1) % 1) * period;
  const y = (((v % 1) + 1) % 1) * period;
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const sx = fx * fx * fx * (fx * (fx * 6 - 15) + 10); // quintic C2 smoothstep for crisp normals
  const sy = fy * fy * fy * (fy * (fy * 6 - 15) + 10);

  const ix0 = ((x0 % period) + period) % period;
  const iy0 = ((y0 % period) + period) % period;
  const ix1 = (ix0 + 1) % period;
  const iy1 = (iy0 + 1) % period;

  const n00 = hash2d(ix0, iy0, seed);
  const n10 = hash2d(ix1, iy0, seed);
  const n01 = hash2d(ix0, iy1, seed);
  const n11 = hash2d(ix1, iy1, seed);

  const nx0 = n00 + (n10 - n00) * sx;
  const nx1 = n01 + (n11 - n01) * sx;
  return (nx0 + (nx1 - nx0) * sy) * 2 - 1;
}

export function generateParchmentPngBuffer(size = 640) {
  const heightMap = new Float32Array(size * size);
  const toneMap = new Float32Array(size * size);

  for (let y = 0; y < size; y += 1) {
    const v = y / size;
    for (let x = 0; x < size; x += 1) {
      const u = x / size;

      // Two-octave domain warp creates genuine organic animal-vellum / crumpled-sheet flow
      const wx =
        periodicNoise(u, v, 4, 11) * 0.052 +
        periodicNoise(u, v, 10, 23) * 0.021;
      const wy =
        periodicNoise(u, v, 4, 37) * 0.052 +
        periodicNoise(u, v, 10, 53) * 0.021;

      const uu = u + wx;
      const vv = v + wy;

      // Signature parchment crease veins (sharp ridged folds)
      const crease1 = Math.pow(1 - Math.abs(periodicNoise(uu, vv, 5, 101)), 4.5);
      const crease2 = Math.pow(1 - Math.abs(periodicNoise(uu + 0.17, vv - 0.11, 9, 131)), 5.0);
      const fineVeins = Math.pow(1 - Math.abs(periodicNoise(uu, vv, 19, 163)), 4.0);
      const creases = crease1 * 0.95 + crease2 * 0.72 + fineVeins * 0.42;

      // Tactile vellum dimples & cold-press rag topography
      const rumple = periodicNoise(uu, vv, 4, 211) * 0.75;
      const dimples =
        periodicNoise(uu, vv, 14, 307) * 0.58 +
        periodicNoise(u + wx * 0.4, v + wy * 0.4, 30, 401) * 0.46 +
        periodicNoise(u, v, 64, 463) * 0.34;
      const microPores =
        periodicNoise(u, v, 128, 503) * 0.22 +
        periodicNoise(u, v, 240, 607) * 0.14;

      const idx = y * size + x;
      heightMap[idx] = rumple + dimples + microPores + creases * 0.88;

      // Zero-mean translucent density variation (keeps overall color strictly #ece7dc)
      toneMap[idx] =
        periodicNoise(uu, vv, 3, 811) * 5.2 +
        periodicNoise(uu, vv, 7, 907) * 3.1 -
        (creases - 0.25) * 3.4;
    }
  }

  let rng = 20261118;
  const rand = () => {
    rng = (Math.imul(rng, 1664525) + 1013904223) >>> 0;
    return rng / 4294967296;
  };

  const addSoftDot = (fx, fy, toneDelta, heightDelta) => {
    const x0 = Math.floor(fx);
    const y0 = Math.floor(fy);
    const tx = fx - x0;
    const ty = fy - y0;
    const weights = [
      [(1 - tx) * (1 - ty), 0, 0],
      [tx * (1 - ty), 1, 0],
      [(1 - tx) * ty, 0, 1],
      [tx * ty, 1, 1],
    ];
    for (const [w, dx, dy] of weights) {
      const px = (((x0 + dx) % size) + size) % size;
      const py = (((y0 + dy) % size) + size) % size;
      const i = py * size + px;
      toneMap[i] += toneDelta * w;
      heightMap[i] += heightDelta * w;
    }
  };

  // Anti-aliased curved organic fibers embedded in the parchment sheet
  for (let f = 0; f < 460; f += 1) {
    let fx = rand() * size;
    let fy = rand() * size;
    let angle = rand() * Math.PI * 2;
    const curvature = (rand() - 0.5) * 0.15;
    const steps = 14 + Math.floor(rand() * 28);
    const darkFiber = rand() > 0.38;
    const tDelta = darkFiber ? -6.2 : 5.0;
    const hDelta = darkFiber ? -0.22 : 0.24;

    for (let s = 0; s < steps; s += 1) {
      const taper = Math.sin((Math.PI * (s + 0.5)) / steps);
      addSoftDot(fx, fy, tDelta * taper, hDelta * taper);
      angle += curvature;
      fx += Math.cos(angle) * 0.8;
      fy += Math.sin(angle) * 0.8;
    }
  }

  // Subtle natural rag / husk specks characteristic of genuine handmade paper & vellum
  for (let p = 0; p < 220; p += 1) {
    const px = rand() * size;
    const py = rand() * size;
    const strength = -5.5 - rand() * 6.5;
    addSoftDot(px, py, strength, -0.18);
  }

  const baseR = 236;
  const baseG = 231;
  const baseB = 220;
  const rgb = Buffer.alloc(size * size * 3);
  const clampByte = (v) => (v < 0 ? 0 : v > 255 ? 255 : Math.round(v));

  for (let y = 0; y < size; y += 1) {
    const ym1 = (y - 1 + size) % size;
    const yp1 = (y + 1) % size;
    const ym2 = (y - 2 + size) % size;
    const yp2 = (y + 2 + size) % size;

    for (let x = 0; x < size; x += 1) {
      const xm1 = (x - 1 + size) % size;
      const xp1 = (x + 1 + size) % size;
      const xm2 = (x - 2 + size) % size;
      const xp2 = (x + 2 + size) % size;

      // Multi-radius surface normal captures both sharp fibers and broad vellum folds
      const dhdx =
        (heightMap[y * size + xp1] - heightMap[y * size + xm1]) * 0.65 +
        (heightMap[y * size + xp2] - heightMap[y * size + xm2]) * 0.45;
      const dhdy =
        (heightMap[yp1 * size + x] - heightMap[ym1 * size + x]) * 0.65 +
        (heightMap[yp2 * size + x] - heightMap[ym2 * size + x]) * 0.45;

      const relief = (dhdx * 0.74 + dhdy * 0.67) * 9.6;
      const delta = relief + toneMap[y * size + x];

      const outIdx = (y * size + x) * 3;
      rgb[outIdx] = clampByte(baseR + delta * 0.95);
      rgb[outIdx + 1] = clampByte(baseG + delta * 0.98);
      rgb[outIdx + 2] = clampByte(baseB + delta * 1.05);
    }
  }

  return encodeRgbPng(size, size, rgb);
}
