// =============================================================================
// metodo · o fio terracota se desenha com a rolagem (scrub, sem pin) e acende
// o número de cada etapa quando chega nela. Horizontal a partir de 640px,
// vertical no celular. Movimento reduzido: fio cheio e etapas acesas.
// =============================================================================
export default function init(ctx) {
  const secao = document.querySelector('#metodo');
  if (!secao) return;
  const grade = secao.querySelector('.met-grade');
  const etapas = [...secao.querySelectorAll('.met-etapa')];
  const luzes = etapas.map((e) => e.querySelector('.met-fio__luz'));
  if (!grade || !etapas.length) return;

  const acender = (n) => etapas.forEach((e, i) => e.classList.toggle('is-ativa', i < n));

  if (ctx.reduce) {
    acender(etapas.length);
    return;
  }

  const { gsap } = ctx;
  const total = etapas.length;
  // Fração do segmento em que o fio passa pelo nó (o 1º já começa nele).
  const limiar = (i) => (i === 0 ? 0.01 : (i + 0.1) / total);

  const montar = (eixo) => {
    const prop = eixo === 'x' ? 'scaleX' : 'scaleY';
    const tl = gsap.timeline({
      defaults: { ease: 'none', duration: 1 },
      scrollTrigger: {
        trigger: grade,
        start: 'top 78%',
        end: eixo === 'x' ? 'bottom 52%' : 'bottom 62%',
        scrub: 0.8,
      },
      onUpdate() {
        const p = tl.progress();
        let n = 0;
        for (let i = 0; i < total; i += 1) if (p >= limiar(i)) n = i + 1;
        acender(n);
      },
    });
    luzes.forEach((luz, i) => tl.fromTo(luz, { [prop]: 0 }, { [prop]: 1 }, i));
    return () => acender(0);
  };

  const mm = gsap.matchMedia();
  mm.add('(min-width: 640px)', () => montar('x'));
  mm.add('(max-width: 639px)', () => montar('y'));
}
