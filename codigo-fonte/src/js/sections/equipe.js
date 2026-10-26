// =============================================================================
// equipe · retratos revelam por máscara em sequência; botão "Trajetória" abre
// a faixa com a mini-bio (toque/teclado; no mouse ela sobe no hover);
// indicador de progresso do carrossel no celular.
// =============================================================================
export default function init(ctx) {
  const secao = document.querySelector('#equipe');
  if (!secao) return;
  const { gsap, reduce } = ctx;
  const grade = secao.querySelector('.eq-grade');
  const cards = [...secao.querySelectorAll('.eq-socio')];

  // ---------------------------------------------------------- Trajetória
  const fechar = (card) => {
    card.classList.remove('is-aberto');
    card.querySelector('.eq-mais')?.setAttribute('aria-expanded', 'false');
  };

  cards.forEach((card) => {
    const botao = card.querySelector('.eq-mais');
    if (!botao) return;
    botao.addEventListener('click', () => {
      const abrir = !card.classList.contains('is-aberto');
      cards.forEach((c) => c !== card && fechar(c));
      card.classList.toggle('is-aberto', abrir);
      botao.setAttribute('aria-expanded', String(abrir));
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && card.classList.contains('is-aberto')) {
        fechar(card);
        botao.focus();
      }
    });
  });

  // ---------------------------------------------------------- Carrossel (celular)
  const luz = secao.querySelector('.eq-trilho__luz');
  if (grade && luz) {
    let pedido = 0;
    const atualizar = () => {
      pedido = 0;
      const max = grade.scrollWidth - grade.clientWidth;
      const fracao = max > 0 ? (grade.scrollLeft + grade.clientWidth) / grade.scrollWidth : 1;
      luz.style.transform = `scaleX(${fracao.toFixed(4)})`;
    };
    grade.addEventListener(
      'scroll',
      () => {
        if (!pedido) pedido = requestAnimationFrame(atualizar);
      },
      { passive: true },
    );
    window.addEventListener('resize', atualizar, { passive: true });
    atualizar();
  }

  // ---------------------------------------------------------- Entrada dos retratos
  if (reduce || !grade) return;
  const fotos = cards.map((c) => c.querySelector('.eq-foto'));
  const imgs = cards.map((c) => c.querySelector('.eq-zoom img'));

  const tl = gsap.timeline({
    paused: true,
    defaults: { duration: 1.4, ease: 'expo.out' },
  });
  tl.fromTo(
    fotos,
    { clipPath: 'inset(100% 0% 0% 0%)' },
    { clipPath: 'inset(0% 0% 0% 0%)', stagger: 0.14 },
    0,
  ).fromTo(imgs, { scale: 1.12 }, { scale: 1, duration: 1.8, stagger: 0.14, clearProps: 'transform' }, 0);

  ctx.ScrollTrigger.create({
    trigger: grade,
    start: 'top 82%',
    once: true,
    onEnter: () => tl.play(),
  });
}
