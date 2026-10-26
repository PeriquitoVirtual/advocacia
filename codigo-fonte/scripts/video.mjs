// =============================================================================
// video.mjs · vídeo do topo em loop suave (vai e volta), leve, sem áudio
// -----------------------------------------------------------------------------
//   npm run video
//
// assets/source/hero.mp4 (Gravyx/Veo, 1920×1080, 8s): a câmera se aproxima
// devagar, uma luz quente atravessa o vidro e ela vira o rosto para a câmera.
// Para o loop não "pular", juntamos o vídeo com ele mesmo ao contrário (16s).
//   src/assets/video/topo-1280.mp4   (16:9, telas largas)
//   src/assets/video/topo-retrato.mp4 (9:16 recortado nela, celular)
//   src/assets/video/topo-poster.webp e topo-retrato-poster.webp (1º quadro)
// =============================================================================
import { execFileSync } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpeg from 'ffmpeg-static';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGEM = path.join(RAIZ, 'assets/source/hero.mp4');
const DESTINO = path.join(RAIZ, 'src/assets/video');
await mkdir(DESTINO, { recursive: true });

const vaiEVolta = (filtro) =>
  `[0:v]${filtro},split[a][b];[b]reverse,trim=start_frame=1,setpts=PTS-STARTPTS[r];[a][r]concat=n=2:v=1:a=0,format=yuv420p[v]`;

function codificar(filtro, saida, crf) {
  execFileSync(ffmpeg, [
    '-y', '-loglevel', 'error', '-i', ORIGEM,
    '-filter_complex', vaiEVolta(filtro), '-map', '[v]',
    '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf),
    '-profile:v', 'high', '-movflags', '+faststart',
    path.join(DESTINO, saida),
  ]);
}

function poster(filtro, saida) {
  execFileSync(ffmpeg, [
    '-y', '-loglevel', 'error', '-i', ORIGEM, '-vf', filtro, '-frames:v', '1',
    '-c:v', 'libwebp', '-quality', '80', path.join(DESTINO, saida),
  ]);
}

// Largo: 1280×720
codificar('scale=1280:-2', 'topo-1280.mp4', 27);
poster('scale=1280:-2', 'topo-poster.webp');
// Retrato: recorte 608×1080 centrado nela (x ≈ 58% da largura) → 540×960
const RECORTE = 'crop=608:1080:810:0,scale=540:-2';
codificar(RECORTE, 'topo-retrato.mp4', 28);
poster(RECORTE, 'topo-retrato-poster.webp');
console.log('vídeos em src/assets/video/');
