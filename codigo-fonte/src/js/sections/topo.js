// =============================================================================
// topo.js · entrada do card com vídeo, parallax, vídeo que pausa fora da tela,
// barra que vira fixa (some ao descer, volta ao subir) e menu de telas pequenas.
// =============================================================================
import { rolarPara } from '../motion.js';

const MQ_RETRATO = '(max-width: 767px)';
const MQ_MENU = '(max-width: 1023px)';

export default function init(ctx) {
  const { gsap, ScrollTrigger, reduce } = ctx;
  const secao = document.getElementById('topo');
  if (!secao) return;

  const barra = secao.querySelector('[data-topo-barra]');
  const card = secao.querySelector('[data-topo-card]');
  const video = secao.querySelector('[data-topo-video]');

  iniciarVideo(video, card, reduce);
  iniciarBarra(barra, ScrollTrigger);
  iniciarMenu(secao, ctx);
  iniciarLinks(secao, ctx);

  if (reduce) return;
  entrada(secao, gsap);
  rolagem(secao, gsap);
}

/* ------------------------------------------------------------ Vídeo */
function iniciarVideo(video, card, reduce) {
  if (!video || reduce) return;
  const mq = window.matchMedia(MQ_RETRATO);
  let visivel = true;

  video.preload = 'auto';
  video.addEventListener('playing', () => video.classList.add('is-tocando'));

  const tocar = () => {
    if (!visivel || document.hidden) return;
    const p = video.play();
    if (p && p.catch) p.catch(() => {}); // autoplay bloqueado: fica o pôster
  };

  // Troca de fonte (16:9 ↔ retrato) ao cruzar 768px: o <source media> é
  // reavaliado no load().
  mq.addEventListener('change', () => {
    video.classList.remove('is-tocando');
    video.load();
    tocar();
  });

  // Pausa fora da tela, retoma quando volta.
  if ('IntersectionObserver' in window && card) {
    new IntersectionObserver(
      ([e]) => {
        visivel = e.isIntersecting;
        if (visivel) tocar();
        else video.pause();
      },
      { threshold: 0.02 },
    ).observe(card);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) video.pause();
    else tocar();
  });

  tocar();
}

/* ------------------------------------------------------------ Barra fixa */
function iniciarBarra(barra, ScrollTrigger) {
  if (!barra) return;
  const slot = barra.parentElement;
  let fixa = false;
  let visivel = false;
  let ultimo = window.scrollY;

  const limite = () => slot.offsetTop + slot.offsetHeight + 8;

  const setFixa = (v) => {
    if (v === fixa) return;
    fixa = v;
    // Entra/sai do modo fixo sem animar a troca (evita o "deslize" falso).
    barra.classList.add('sem-transicao');
    barra.classList.toggle('is-fixa', v);
    if (!v) barra.classList.remove('is-visivel');
    visivel = false;
    void barra.offsetHeight;
    barra.classList.remove('sem-transicao');
  };

  const setVisivel = (v) => {
    if (v === visivel) return;
    visivel = v;
    barra.classList.toggle('is-visivel', v);
  };

  const atualizar = (y) => {
    if (document.documentElement.classList.contains('menu-aberto')) return;
    const desce = y > ultimo;
    if (Math.abs(y - ultimo) < 2) return;
    ultimo = y;

    if (!fixa && y > limite()) setFixa(true);
    else if (fixa && y <= 2) setFixa(false);
    if (fixa) setVisivel(!desce);
  };

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => atualizar(self.scroll()),
  });

  // Foco por teclado numa pílula escondida: mostra a barra.
  barra.addEventListener('focusin', () => {
    if (fixa) setVisivel(true);
  });

  if (window.scrollY > limite()) setFixa(true);
}

/* ------------------------------------------------------------ Menu */
function iniciarMenu(secao, ctx) {
  const { gsap, reduce } = ctx;
  const abrir = secao.querySelector('[data-topo-abrir]');
  const painel = secao.querySelector('[data-topo-menu]');
  const fechar = secao.querySelector('[data-topo-fechar]');
  if (!abrir || !painel) return;

  const html = document.documentElement;
  const mq = window.matchMedia(MQ_MENU);
  let aberto = false;
  let anim = null;

  const focaveis = () =>
    [...painel.querySelectorAll('a[href], button:not([disabled])')].filter(
      (el) => el.offsetParent !== null,
    );

  const onKey = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      fecharMenu();
      return;
    }
    if (e.key !== 'Tab') return;
    const lista = focaveis();
    if (!lista.length) return;
    const primeiro = lista[0];
    const ultimo = lista[lista.length - 1];
    if (e.shiftKey && document.activeElement === primeiro) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primeiro.focus();
    }
  };

  function abrirMenu() {
    if (aberto) return;
    aberto = true;
    anim?.kill();
    painel.hidden = false;
    abrir.setAttribute('aria-expanded', 'true');
    html.classList.add('menu-aberto');
    ctx.lenis?.stop();
    document.addEventListener('keydown', onKey);

    const itens = painel.querySelectorAll('.topo-menu__lista > li, .topo-menu__pe > *');
    if (!reduce) {
      anim = gsap
        .timeline()
        .fromTo(
          painel,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'expo.inOut' },
        )
        .fromTo(
          itens,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06 },
          0.35,
        );
    }
    (fechar || focaveis()[0])?.focus();
  }

  function fecharMenu({ devolverFoco = true } = {}) {
    if (!aberto) return;
    aberto = false;
    abrir.setAttribute('aria-expanded', 'false');
    html.classList.remove('menu-aberto');
    ctx.lenis?.start();
    document.removeEventListener('keydown', onKey);
    anim?.kill();

    const esconder = () => {
      painel.hidden = true;
      gsap.set(painel, { clearProps: 'clipPath' });
    };
    if (reduce || !devolverFoco) esconder();
    else {
      anim = gsap.to(painel, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 0.6,
        ease: 'expo.inOut',
        onComplete: esconder,
      });
    }
    if (devolverFoco) abrir.focus();
  }

  abrir.addEventListener('click', abrirMenu);
  fechar?.addEventListener('click', () => fecharMenu());

  // Link do menu: fecha na hora (libera a rolagem) e leva o foco à seção.
  painel.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const alvo = document.querySelector(a.getAttribute('href'));
      fecharMenu({ devolverFoco: false });
      if (!alvo) return;
      e.preventDefault();
      rolarPara(alvo);
      focarSecao(alvo);
    });
  });

  // WhatsApp do painel também fecha o menu.
  painel.querySelectorAll('[data-wa]').forEach((a) =>
    a.addEventListener('click', () => fecharMenu({ devolverFoco: false })),
  );

  mq.addEventListener('change', (e) => {
    if (!e.matches) fecharMenu({ devolverFoco: false });
  });
}

/* ------------------------------------------------------------ Links internos */
function iniciarLinks(secao, ctx) {
  const links = secao.querySelectorAll(
    '.topo-nav a[href^="#"]:not([data-wa]), .topo-logo[href^="#"], [data-topo-mais]',
  );
  links.forEach((a) => {
    a.addEventListener('click', (e) => {
      const alvo = document.querySelector(a.getAttribute('href'));
      if (!alvo) return;
      e.preventDefault();
      if (alvo.id === 'topo') {
        if (ctx.lenis) ctx.lenis.scrollTo(0);
        else window.scrollTo({ top: 0 });
      } else rolarPara(alvo);
      focarSecao(alvo);
    });
  });
}

function focarSecao(alvo) {
  if (!alvo.hasAttribute('tabindex')) alvo.setAttribute('tabindex', '-1');
  alvo.focus({ preventScroll: true });
}

/* ------------------------------------------------------------ Entrada */
function entrada(secao, gsap) {
  const card = secao.querySelector('[data-topo-card]');
  const midiaIn = secao.querySelector('[data-topo-midia-in]');
  const linhas = secao.querySelectorAll('[data-topo-linha]');
  const entra = secao.querySelectorAll('[data-topo-entra]');
  const mais = secao.querySelector('[data-topo-mais]');
  const barraItens = secao.querySelectorAll(
    '.topo-barra__in > .topo-logo, .topo-barra__in > .topo-menu-btn, .topo-nav__lista > li',
  );

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  tl.fromTo(
    card,
    { clipPath: 'inset(50% 0% 50% 0% round 6px)' },
    {
      clipPath: 'inset(0% 0% 0% 0% round 6px)',
      duration: 1.25,
      ease: 'expo.inOut',
      clearProps: 'clipPath',
    },
    0,
  )
    .fromTo(midiaIn, { scale: 1.08 }, { scale: 1, duration: 2, ease: 'power3.out' }, 0)
    .fromTo(
      barraItens,
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.05, clearProps: 'transform' },
      0.15,
    )
    .fromTo(
      linhas,
      { opacity: 0, letterSpacing: '0.4em' },
      {
        opacity: 1,
        letterSpacing: '0.06em',
        duration: 1.35,
        stagger: 0.14,
        clearProps: 'letterSpacing',
      },
      0.5,
    )
    .fromTo(
      entra,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.09, clearProps: 'transform' },
      1.0,
    )
    .fromTo(mais, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1 }, 1.15);

  // Estados iniciais já estão inline: o CSS de "antes do JS" pode sair.
  secao.classList.add('is-pronto');
}

/* ------------------------------------------------------------ Rolagem */
function rolagem(secao, gsap) {
  const midia = secao.querySelector('[data-topo-midia]');
  const titulo = secao.querySelector('[data-topo-titulo]');
  const card = secao.querySelector('[data-topo-card]');

  const st = { trigger: card, start: 'top top', end: 'bottom top', scrub: true };

  gsap.fromTo(midia, { y: 0 }, { y: 60, ease: 'none', scrollTrigger: st });
  gsap.fromTo(
    titulo,
    { y: 0, opacity: 1 },
    { y: -56, opacity: 0.15, ease: 'none', scrollTrigger: { ...st, start: 'top+=80 top' } },
  );
}
