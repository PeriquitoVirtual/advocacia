// =============================================================================
// duvidas.js · acordeão (um aberto por vez, o primeiro começa aberto)
// A altura anima no CSS (grid-template-rows). Aqui: estado, aria e teclado
// (setas, Home e End entre as perguntas). Ao terminar a animação, avisa o
// ScrollTrigger, porque as dobras abaixo mudaram de posição.
// =============================================================================
export default function init(ctx) {
  const raiz = document.getElementById('duvidas');
  if (!raiz) return;
  const itens = [...raiz.querySelectorAll('.faq-item')];
  const botoes = itens.map((item) => item.querySelector('.faq-botao'));
  if (!itens.length) return;

  let espera = 0;
  const atualizarGatilhos = () => {
    clearTimeout(espera);
    espera = setTimeout(() => ctx.ScrollTrigger?.refresh(), 60);
  };

  function definir(item, aberto) {
    const botao = item.querySelector('.faq-botao');
    item.classList.toggle('is-aberto', aberto);
    botao.setAttribute('aria-expanded', String(aberto));
  }

  botoes.forEach((botao, i) => {
    botao.addEventListener('click', () => {
      const abrir = botao.getAttribute('aria-expanded') !== 'true';
      itens.forEach((item, j) => definir(item, j === i ? abrir : false));
      if (ctx.reduce) atualizarGatilhos();
    });

    botao.addEventListener('keydown', (e) => {
      let alvo = -1;
      if (e.key === 'ArrowDown') alvo = (i + 1) % botoes.length;
      else if (e.key === 'ArrowUp') alvo = (i - 1 + botoes.length) % botoes.length;
      else if (e.key === 'Home') alvo = 0;
      else if (e.key === 'End') alvo = botoes.length - 1;
      if (alvo < 0) return;
      e.preventDefault();
      botoes[alvo].focus();
    });
  });

  raiz.addEventListener('transitionend', (e) => {
    if (e.propertyName === 'grid-template-rows') atualizarGatilhos();
  });
}
