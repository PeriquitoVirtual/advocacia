// =============================================================================
// main.js · liga a página: estilos, rolagem suave, WhatsApp, botões e dobras
// Cada dobra mora em ./sections/<nome>.js e exporta `default function init(ctx)`.
// Para acrescentar uma dobra: crie o partial, o CSS e o JS e registre aqui.
// =============================================================================
import '@fontsource-variable/josefin-sans';
import '@fontsource/barlow-condensed/400.css';
import '@fontsource/barlow-condensed/500.css';
import '@fontsource/barlow-condensed/600.css';
import '@fontsource/barlow/400.css';
import '@fontsource/barlow/500.css';
import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/components.css';
import '../styles/hero-neon.css';
import '../styles/nav-emerald.css';
import '../styles/sections/topo.css';
import '../styles/sections/pilares.css';
import '../styles/sections/sobre.css';
import '../styles/sections/areas.css';
import '../styles/sections/metodo.css';
import '../styles/sections/equipe.css';
import '../styles/sections/duvidas.css';
import '../styles/sections/contato.css';
import '../styles/conversao.css';
import '../styles/topo-editorial.css';
import '../styles/whatsapp-flutuante.css';
import '../styles/paleta-marinho.css';

import { linkWhatsApp } from './config.js';
import initMedicao from './medicao.js';
import {
  contadores,
  desktop,
  gsap,
  iniciarRolagem,
  lenis as _lenis,
  partirTitulos,
  reduce,
  revelar,
  ScrollTrigger,
  SplitText,
} from './motion.js';

import topo from './sections/topo.js';
import pilares from './sections/pilares.js';
import sobre from './sections/sobre.js';
import areas from './sections/areas.js';
import metodo from './sections/metodo.js';
import equipe from './sections/equipe.js';
import duvidas from './sections/duvidas.js';
import contato from './sections/contato.js';

const DOBRAS = { topo, pilares, sobre, areas, metodo, equipe, duvidas, contato };
initMedicao();

// Links de WhatsApp: <a data-wa="contexto">
document.querySelectorAll('[data-wa]').forEach((a) => {
  a.href = linkWhatsApp(a.dataset.wa);
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  // Sinal local, sem cookies, armazenamento ou envio a serviços externos.
  // A integração com Google Ads/Analytics depende dos IDs reais e do consentimento.
  a.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('whatsapp_click', {
      detail: { contexto: a.dataset.wa, secao: a.closest('section')?.id || 'global' },
    }));
  });
});

// Rótulo dos botões duplicado para o deslize no hover (o 2º é decorativo).
document.querySelectorAll('.btn__rotulo').forEach((r) => {
  if (r.children.length) return;
  const t = r.textContent.trim();
  r.innerHTML = '';
  const a = document.createElement('span');
  a.textContent = t;
  const b = document.createElement('span');
  b.textContent = t;
  b.setAttribute('aria-hidden', 'true');
  r.append(a, b);
});

// O módulo subiu: o fallback do index.html não deve mais desligar o movimento.
window.__movimentoOk = true;

async function iniciar() {
  const lenis = iniciarRolagem() ?? _lenis;
  // Títulos partidos dependem da fonte final (largura das linhas).
  try {
    await document.fonts.ready;
  } catch {
    /* segue com a fonte que houver */
  }
  const ctx = { gsap, ScrollTrigger, SplitText, lenis, reduce, desktop };
  for (const [nome, init] of Object.entries(DOBRAS)) {
    try {
      init(ctx);
    } catch (erro) {
      console.error(`[${nome}]`, erro);
    }
  }
  partirTitulos();
  revelar();
  contadores();
  if (document.readyState === 'complete') ScrollTrigger.refresh();
  else window.addEventListener('load', () => ScrollTrigger.refresh());
}

iniciar();
