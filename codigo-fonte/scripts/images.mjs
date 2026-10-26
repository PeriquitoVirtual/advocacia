// =============================================================================
// images.mjs · gera as versões web das fotos
// -----------------------------------------------------------------------------
//   npm run images
//
// Lê assets/source/<nome>.(png|jpg) e escreve src/assets/img/<nome>-<largura>.webp
// nas larguras de LARGURAS que couberem na foto original (mais a largura
// original, se ela for menor que a maior da lista). Use no HTML com srcset:
//   <img src="/src/assets/img/clinica-1200.webp"
//        srcset="/src/assets/img/clinica-800.webp 800w, /src/assets/img/clinica-1200.webp 1200w" ...>
// =============================================================================
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGEM = path.join(RAIZ, 'assets/source');
const DESTINO = path.join(RAIZ, 'src/assets/img');
const LARGURAS = [480, 800, 1200, 1600];

await mkdir(DESTINO, { recursive: true });

for (const arquivo of (await readdir(ORIGEM)).sort()) {
  if (!/\.(png|jpe?g)$/i.test(arquivo)) continue;
  const nome = arquivo.replace(/\.[^.]+$/, '');
  const img = sharp(path.join(ORIGEM, arquivo));
  const { width } = await img.metadata();
  const alvos = LARGURAS.filter((l) => l < width);
  if (width <= LARGURAS.at(-1)) alvos.push(width);
  const feitos = [];
  for (const l of alvos) {
    const saida = path.join(DESTINO, `${nome}-${l}.webp`);
    await sharp(path.join(ORIGEM, arquivo)).resize({ width: l }).webp({ quality: 78, effort: 6 }).toFile(saida);
    feitos.push(l);
  }
  console.log(`${nome}: ${feitos.join(', ')}`);
}
