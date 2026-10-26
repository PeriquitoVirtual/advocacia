// =============================================================================
// contato.js · foto (máscara abrindo + parallax interno leve), selo
// "Aberto/Fechado agora" pelo fuso de São Paulo, wordmark do rodapé e o
// botão flutuante de WhatsApp (aparece depois do topo, some no contato e
// com o menu aberto).
// =============================================================================
const ABRE = 9 * 60; // 9h
const FECHA = 18 * 60; // 18h

/** true se agora, em São Paulo, é dia útil entre 9h e 18h. */
function abertoAgora() {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const valor = (tipo) => partes.find((p) => p.type === tipo)?.value ?? '';
  const minutos = Number(valor('hour')) * 60 + Number(valor('minute'));
  const util = !['Sat', 'Sun'].includes(valor('weekday'));
  return util && minutos >= ABRE && minutos < FECHA;
}

function selo(secao) {
  const el = secao.querySelector('.contato-selo');
  if (!el) return;
  const texto = el.querySelector('.contato-selo__texto');
  const atualizar = () => {
    const aberto = abertoAgora();
    el.classList.toggle('is-aberto', aberto);
    texto.textContent = aberto ? 'Aberto agora' : 'Fechado agora';
    el.hidden = false;
  };
  atualizar();
  setInterval(atualizar, 60_000);
}

function flutuante(secao) {
  const botao = document.querySelector('.contato-flutua');
  if (!botao) return;
  const html = document.documentElement;
  const topo = document.getElementById('topo');
  let pendente = false;

  const avaliar = () => {
    pendente = false;
    const vh = window.innerHeight;
    const passouTopo = topo ? topo.getBoundingClientRect().bottom <= 0 : window.scrollY > vh;
    const noContato = secao.getBoundingClientRect().top < vh;
    const menu = html.classList.contains('menu-aberto');
    botao.classList.toggle('is-visivel', passouTopo && !noContato && !menu);
  };
  const agendar = () => {
    if (pendente) return;
    pendente = true;
    requestAnimationFrame(avaliar);
  };

  window.addEventListener('scroll', agendar, { passive: true });
  window.addEventListener('resize', agendar);
  new MutationObserver(agendar).observe(html, { attributes: true, attributeFilter: ['class'] });
  avaliar();
}

export default function init(ctx) {
  const { gsap, reduce } = ctx;
  const secao = document.getElementById('contato');
  if (!secao) return;

  selo(secao);
  flutuante(secao);
  if (reduce) return;

  // Foto: máscara abre + leve recuo de escala; por dentro, parallax curto.
  const foto = secao.querySelector('.contato-foto');
  const img = foto?.querySelector('img');
  if (foto && img) {
    gsap
      .timeline({ scrollTrigger: { trigger: foto, start: 'top 82%', once: true } })
      .to(foto, { clipPath: 'inset(0% 0% 0% 0% round 6px)', duration: 1.4, ease: 'expo.out' }, 0)
      .to(img, { scale: 1.06, duration: 1.8, ease: 'expo.out' }, 0);

    gsap.fromTo(
      img,
      { yPercent: -3 },
      {
        yPercent: 3,
        ease: 'none',
        scrollTrigger: { trigger: foto, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  }

  // Wordmark do rodapé: letras sobem em sequência.
  const marca = document.querySelector('.contato-marca');
  if (marca) {
    gsap.to(marca.children, {
      opacity: 1,
      y: 0,
      duration: 1.4,
      ease: 'expo.out',
      stagger: 0.07,
      scrollTrigger: { trigger: marca, start: 'top 96%', once: true },
    });
  }
}
