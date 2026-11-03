import { initAreasModal } from '../areas-modal.js';
// =============================================================================
// Áreas · #areas
// - Cada linha: a foto abre por máscara (do lado de fora para dentro) com
//   escala interna 1.12→1 e parallax leve (scrub); os dois cards sobem em
//   sequência.
// - "Explorar": abre a lista de serviços com altura animada; uma por vez
//   por linha. O card cresce e a foto da linha acompanha (grid stretch).
// =============================================================================
export default function init(ctx) {
  const { gsap, ScrollTrigger, reduce } = ctx;
  const sec = document.getElementById('areas');
  if (!sec) return;

  const linhas = [...sec.querySelectorAll('.areas-linha')];

  initAreasModal(sec, ctx);

  if (reduce) return;

  // ---------------------------------------------------------------- Movimento
  const R = 'round 6px';
  linhas.forEach((linha) => {
    const foto = linha.querySelector('.areas-foto');
    const mov = linha.querySelector('.areas-foto__mov');
    const img = linha.querySelector('.areas-foto img');
    const retratoFixo = foto?.classList.contains('areas-foto--retrato');
    const cards = linha.querySelectorAll('.areas-card');
    const inv = linha.classList.contains('areas-linha--inv');
    const fechada = inv ? `inset(0% 0% 0% 100% ${R})` : `inset(0% 100% 0% 0% ${R})`;

    const tl = gsap.timeline({ scrollTrigger: { trigger: linha, start: 'top 82%', once: true } });
    if (foto && img) {
      tl.fromTo(
        foto,
        { clipPath: fechada },
        { clipPath: `inset(0% 0% 0% 0% ${R})`, duration: 1.4, ease: 'power3.inOut' },
        0,
      ).fromTo(img, { scale: retratoFixo ? 1 : 1.12 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, 0.15);
    }
    if (cards.length) {
      tl.fromTo(
        cards,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.12 },
        0.3,
      );
    }

    if (foto && mov && !retratoFixo) {
      gsap.fromTo(
        mov,
        { y: -36 },
        {
          y: 36,
          ease: 'none',
          scrollTrigger: { trigger: foto, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    }
  });
}
