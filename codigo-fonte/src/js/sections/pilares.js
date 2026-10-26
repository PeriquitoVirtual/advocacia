// =============================================================================
// pilares.js · cards entram em sequência (sobem + máscara); "Saiba mais"
// expande um parágrafo no próprio card, um por vez.
// Números: genéricos do motion.js (data-reveal + data-contar).
// =============================================================================
export default function init(ctx) {
  const { gsap, ScrollTrigger, reduce } = ctx;
  const secao = document.getElementById('pilares');
  if (!secao) return;

  const cards = [...secao.querySelectorAll('[data-pil-card]')];

  /* ---------------------------------------------------------- Expandir */
  const setAberto = (card, aberto) => {
    const btn = card.querySelector('[data-pil-mais]');
    const extra = card.querySelector('[data-pil-extra]');
    card.classList.toggle('is-aberto', aberto);
    btn.setAttribute('aria-expanded', String(aberto));
    extra.inert = !aberto;
  };

  let refresh = 0;
  const reajustar = () => {
    clearTimeout(refresh);
    refresh = setTimeout(() => ScrollTrigger.refresh(), 120);
  };

  cards.forEach((card) => {
    const btn = card.querySelector('[data-pil-mais]');
    const extra = card.querySelector('[data-pil-extra]');
    btn.addEventListener('click', () => {
      const abrir = !card.classList.contains('is-aberto');
      cards.forEach((c) => c !== card && c.classList.contains('is-aberto') && setAberto(c, false));
      setAberto(card, abrir);
      if (reduce) reajustar();
    });
    extra.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'grid-template-rows') reajustar();
    });
  });

  /* ---------------------------------------------------------- Entrada */
  if (reduce) return;
  gsap.fromTo(cards, { clipPath: 'inset(100% 0% 0% 0%)', y: 24 }, {
    clipPath: 'inset(0% 0% 0% 0%)',
    y: 0,
    duration: 1.2,
    ease: 'expo.out',
    stagger: 0.1,
    clearProps: 'clipPath,transform',
    scrollTrigger: { trigger: secao, start: 'top 85%', once: true },
  });
  secao.classList.add('is-pronto');
}
