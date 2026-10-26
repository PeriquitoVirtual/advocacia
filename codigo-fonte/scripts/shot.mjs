// =============================================================================
// shot.mjs · print da página com Playwright (Chromium headless)
// -----------------------------------------------------------------------------
//   node scripts/shot.mjs --url http://127.0.0.1:5250/ --width 1440 --height 900 \
//        --out .tmp-shots/hero.png [--selector '#hero'] [--full] [--wait 1200] \
//        [--reduced-motion] [--mobile] [--dpr 2] [--no-js] [--scroll-through]
//
// --selector   rola até o elemento, espera e recorta SÓ ele
// --full       página inteira (rola até o fim antes, para disparar reveals)
// --wait       ms de espera antes do print (padrão 800)
// --mobile     emula toque + isMobile (use com --width 390 --height 844)
// --no-js      desliga o JavaScript (confere o HTML pré-renderizado; use no preview)
// --scroll-through  percorre a página toda antes (com --selector também)
// Erros e avisos do console (ex.: hidratação) são impressos no fim.
// =============================================================================
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

function lerArgs(argv) {
  const a = {};
  for (let i = 0; i < argv.length; i += 1) {
    const k = argv[i];
    if (!k.startsWith('--')) continue;
    const nome = k.slice(2);
    const prox = argv[i + 1];
    if (prox === undefined || prox.startsWith('--')) a[nome] = true;
    else {
      a[nome] = prox;
      i += 1;
    }
  }
  return a;
}

const args = lerArgs(process.argv.slice(2));
const url = args.url || 'http://127.0.0.1:5250/';
const width = Number(args.width) || 1440;
const height = Number(args.height) || 900;
const espera = args.wait !== undefined ? Number(args.wait) : 800;
const saida = path.resolve(args.out || `.tmp-shots/shot-${width}x${height}-${Date.now()}.png`);

async function percorre(page) {
  await page.evaluate(async () => {
    const passo = Math.max(200, Math.floor(window.innerHeight * 0.8));
    const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
    for (let y = 0; y < document.documentElement.scrollHeight; y += passo) {
      window.scrollTo(0, y);
      await pausa(120);
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await pausa(250);
  });
}

async function main() {
  await mkdir(path.dirname(saida), { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const logs = [];
  try {
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: Number(args.dpr) || 1,
      reducedMotion: args['reduced-motion'] ? 'reduce' : 'no-preference',
      isMobile: Boolean(args.mobile),
      hasTouch: Boolean(args.mobile),
      javaScriptEnabled: !args['no-js'],
      locale: 'pt-BR',
      timezoneId: 'America/Fortaleza',
    });
    const page = await context.newPage();
    page.on('console', (m) => {
      if (m.type() === 'error' || m.type() === 'warning') logs.push(`[console.${m.type()}] ${m.text()}`);
    });
    page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
    page.on('requestfailed', (r) => logs.push(`[requestfailed] ${r.url()} ${r.failure()?.errorText || ''}`));

    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    await page.evaluate(() => document.fonts?.ready);

    if (args.full || args['scroll-through']) await percorre(page);

    if (args.selector) {
      const alvo = page.locator(args.selector).first();
      await alvo.waitFor({ state: 'attached', timeout: 10000 });
      await alvo.evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
      await page.waitForTimeout(espera);
      await alvo.screenshot({ path: saida, animations: 'allow' });
    } else {
      if (args.full) await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(espera);
      await page.screenshot({ path: saida, fullPage: Boolean(args.full), animations: 'allow' });
    }
    console.log(`✓ print: ${path.relative(process.cwd(), saida)} (${width}x${height}${args.selector ? `, ${args.selector}` : ''}${args.full ? ', página inteira' : ''})`);
  } finally {
    await browser.close();
  }
  if (logs.length) {
    console.log(`\nConsole (${logs.length}):`);
    for (const l of logs) console.log(`  ${l}`);
  } else {
    console.log('Console limpo (sem erros ou avisos).');
  }
}

main().catch((e) => {
  console.error(`✗ shot: ${e.message}`);
  process.exit(1);
});
