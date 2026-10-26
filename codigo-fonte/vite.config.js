import { readFileSync } from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';

// base: BASE_PATH (ex.: '/advocacia/varela/') publica a página numa
// subpasta do projeto único da Vercel (ver ../Vercel Demonstracao/). Sem ela, '/'.
const base = process.env.BASE_PATH || '/';

// Cada dobra mora num arquivo próprio em src/partials/. No index.html,
//   <!-- @include partials/hero.html -->
// é trocado pelo conteúdo do arquivo antes do Vite processar o HTML, então
// os caminhos de imagem dentro das dobras (/src/assets/img/...) também
// ganham hash e o `base`.
const RAIZ_PARTIALS = path.resolve(import.meta.dirname, 'src');
const incluiPartials = {
  name: 'inclui-partials',
  enforce: 'pre',
  transformIndexHtml: {
    order: 'pre',
    handler(html, ctx) {
      return html.replace(/<!--\s*@include\s+([\w./-]+)\s*-->/g, (_, arquivo) => {
        const caminho = path.join(RAIZ_PARTIALS, arquivo);
        ctx.server?.watcher.add(caminho);
        return readFileSync(caminho, 'utf8');
      });
    },
  },
  handleHotUpdate({ file, server }) {
    if (file.startsWith(path.join(RAIZ_PARTIALS, 'partials'))) {
      server.ws.send({ type: 'full-reload' });
      return [];
    }
    return undefined;
  },
};

export default defineConfig({
  base,
  plugins: [incluiPartials],
  build: { assetsInlineLimit: 0 },
  server: { host: '127.0.0.1', port: 5250 },
});
