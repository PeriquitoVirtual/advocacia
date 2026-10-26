// =============================================================================
// motion.js · base de movimento da página (GSAP + ScrollTrigger + SplitText + Lenis)
// -----------------------------------------------------------------------------
// Princípios: saídas longas e suaves (expo.out / power3.out), deslocamentos
// curtos (≤ 32px), nada de bounce, nada que gire sem motivo. Movimento
// reduzido: sem Lenis, sem reveals, tudo visível e estático.
//
// Genéricos (qualquer dobra pode usar só com atributos no HTML):
//   data-split                 título sobe linha a linha por trás de uma máscara
//   data-split="manual"        só parte em linhas; a dobra anima (ex.: topo)
//   data-reveal                sobe 28px + aparece ao entrar na tela
//   data-reveal="fade|scale"   variações
//   data-reveal-delay="0.2"    atraso em segundos
//   data-contar="400"          contador (usa data-sufixo="+" e data-prefixo)
//
// Cada dobra exporta `init(ctx)` (ver main.js) e recebe:
//   { gsap, ScrollTrigger, SplitText, lenis, reduce, desktop }
// =============================================================================
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);
gsap.defaults({ ease: 'power3.out', duration: 0.9 });

export const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/** true em telas com mouse (hover real); use para interações de ponteiro. */
export const desktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export let lenis = null;

export function iniciarRolagem() {
  if (reduce) return null;
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
    smoothWheel: true,
    anchors: { offset: -12 },
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

/** Rola até um alvo (seletor ou elemento) com Lenis, ou nativo sem ele. */
export function rolarPara(alvo, opts = {}) {
  const el = typeof alvo === 'string' ? document.querySelector(alvo) : alvo;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -12, ...opts });
  else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

/** Títulos [data-split]: linhas sobem por trás de uma máscara ao entrar na tela. */
export function partirTitulos(root = document) {
  root.querySelectorAll('[data-split]').forEach((el) => {
    const manual = el.dataset.split === 'manual';
    if (reduce) {
      el.classList.add('is-split');
      return;
    }
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit(self) {
        el.classList.add('is-split');
        if (manual) return undefined;
        return gsap.from(self.lines, {
          yPercent: 112,
          duration: 1.15,
          ease: 'expo.out',
          stagger: 0.09,
          delay: Number(el.dataset.revealDelay) || 0,
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
        });
      },
    });
  });
}

/** [data-reveal]: aparece em lotes ao entrar na tela. */
export function revelar() {
  if (reduce) return;
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    once: true,
    onEnter: (lote) =>
      lote.forEach((el, i) =>
        gsap.to(el, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          ease: 'expo.out',
          delay: (Number(el.dataset.revealDelay) || 0) + i * 0.08,
          overwrite: true,
        }),
      ),
  });
}

/** [data-contar]: conta de 0 até o valor quando entra na tela. */
export function contadores(root = document) {
  root.querySelectorAll('[data-contar]').forEach((el) => {
    const alvo = Number(el.dataset.contar);
    const pre = el.dataset.prefixo || '';
    const suf = el.dataset.sufixo || '';
    const fmt = (v) => `${pre}${Math.round(v).toLocaleString('pt-BR')}${suf}`;
    if (reduce) {
      el.textContent = fmt(alvo);
      return;
    }
    const obj = { v: 0 };
    el.textContent = fmt(0);
    gsap.to(obj, {
      v: alvo,
      duration: 1.8,
      ease: 'power2.out',
      delay: Number(el.dataset.revealDelay) || 0,
      onUpdate: () => {
        el.textContent = fmt(obj.v);
      },
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    });
  });
}

export { gsap, ScrollTrigger, SplitText };
