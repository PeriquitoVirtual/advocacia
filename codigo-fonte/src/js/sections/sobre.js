// =============================================================================
// Sobre · #escritorio
// Foto: máscara abre de baixo para cima + escala interna 1.12→1; depois um
// parallax leve por dentro (scrub). Colunas de texto entram em fade.
// O título usa o genérico data-split (motion.js).
// =============================================================================
export default function init(ctx) {
  const { gsap, reduce } = ctx;
  const sec = document.getElementById('escritorio');
  if (!sec || reduce) return;

  const foto = sec.querySelector('.sobre-foto');
  const mov = sec.querySelector('.sobre-foto__mov');
  const img = sec.querySelector('.sobre-foto img');
  const colunas = sec.querySelectorAll('.sobre-coluna');

  if (foto && img) {
    gsap
      .timeline({ scrollTrigger: { trigger: foto, start: 'top 82%', once: true } })
      .fromTo(
        foto,
        { clipPath: 'inset(100% 0% 0% 0% round 6px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 6px)', duration: 1.4, ease: 'power3.inOut' },
      )
      .fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, 0.15);
  }

  if (foto && mov) {
    gsap.fromTo(
      mov,
      { y: -40 },
      {
        y: 40,
        ease: 'none',
        scrollTrigger: { trigger: foto, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  }

  if (colunas.length) {
    gsap.fromTo(
      colunas,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.14,
        delay: 0.25,
        scrollTrigger: { trigger: colunas[0], start: 'top 90%', once: true },
      },
    );
  }
}
