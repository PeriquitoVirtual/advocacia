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

  // ---------------------------------------------------------------- Explorar
  let espera;
  const recalcular = () => {
    clearTimeout(espera);
    espera = setTimeout(() => ScrollTrigger.refresh(), 60);
  };

  function alternar(card, abrir) {
    const botao = card.querySelector('.areas-card__botao');
    const painel = card.querySelector('.areas-card__painel');
    if (!botao || !painel) return;
    const aberto = botao.getAttribute('aria-expanded') === 'true';
    if (aberto === abrir) return;

    botao.setAttribute('aria-expanded', String(abrir));
    card.classList.toggle('is-aberto', abrir);
    gsap.killTweensOf(painel);

    if (reduce) {
      painel.hidden = !abrir;
      recalcular();
      return;
    }

    if (abrir) {
      if (painel.hidden) {
        painel.hidden = false;
        gsap.set(painel, { height: 0 });
      }
      gsap.to(painel, {
        height: 'auto',
        duration: 0.9,
        ease: 'expo.out',
        onComplete: () => {
          gsap.set(painel, { clearProps: 'height' });
          recalcular();
        },
      });
      gsap.fromTo(
        painel.querySelectorAll('li'),
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.05, delay: 0.08 },
      );
    } else {
      gsap.to(painel, {
        height: 0,
        duration: 0.6,
        ease: 'power3.out',
        onComplete: () => {
          painel.hidden = true;
          gsap.set(painel, { clearProps: 'height' });
          recalcular();
        },
      });
    }
  }

  linhas.forEach((linha) => {
    const cards = [...linha.querySelectorAll('.areas-card')];
    cards.forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('[data-wa]')) return;
        // Cliques dentro da lista aberta não fecham o card (ex.: selecionar texto).
        if (e.target.closest('.areas-card__painel')) return;
        if (!e.target.closest('button') && String(window.getSelection?.() || '').length) return;
        const botao = card.querySelector('.areas-card__botao');
        const abrir = botao?.getAttribute('aria-expanded') !== 'true';
        if (abrir) cards.forEach((outro) => outro !== card && alternar(outro, false));
        alternar(card, abrir);
      });
    });
  });

  // Esc fecha o card aberto que estiver com o foco.
  sec.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const card = e.target.closest?.('.areas-card.is-aberto');
    if (!card) return;
    alternar(card, false);
    card.querySelector('.areas-card__botao')?.focus();
  });

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
