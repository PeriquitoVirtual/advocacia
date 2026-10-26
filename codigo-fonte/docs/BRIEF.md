# Brief · Landing page Varela Advocacia (São Paulo)

Escritório de advocacia **fictício** (dados de exemplo). Referência visual: `docs/referencia.webp` (editorial de moda "DVSY"): fundo quase preto; moldura central; **cards carvão de raio pequeno encostados uns nos outros (8px)**; topo com foto de cinema dentro de um card e título GIGANTE fino em caixa alta e espaçado ("DESIGN & FREEDOM") sobreposto à esquerda; nav com pílulas escuras pequenas + uma pílula terracota "GET IN TOUCH"; 4 cards de valores com "LEARN MORE" (círculo com seta ↗); faixa de números (150+ / 500+ / 20K+ / 50+) com rótulo pequeno em cima; "ABOUT" em card com título em caixa alta + texto em duas colunas ao lado de uma foto; "OUR ADVANTAGES" com grade alternando foto grande e cards com "EXPLORE".

Pedido do cliente: página **animada, com interações, refinada, de alto nível, sem exagero**. Aqui o clima é **cinematográfico e sóbrio**: movimentos lentos, nada saltitante.

## Stack e arquivos (igual ao projeto do dentista)

- Vite + HTML/CSS/JS puros. Servidor já rodando em **http://127.0.0.1:5250/** (não suba outro nessa porta).
- `index.html` monta a página com `<!-- @include partials/x.html -->`.
- Cada dobra: `src/partials/<dobra>.html`, `src/styles/sections/<dobra>.css`, `src/js/sections/<dobra>.js` (`export default function init(ctx)`).
- **Compartilhados (NÃO editar):** `index.html`, `vite.config.js`, `src/js/main.js`, `src/js/motion.js`, `src/js/config.js`, `src/styles/tokens.css`, `src/styles/base.css`, `src/styles/components.css`. Precisa de algo neles? Resolva no seu arquivo e descreva o pedido no retorno.
- Edite **só** os seus arquivos. Prefixe as classes com a dobra (`.topo-`, `.pil-`, `.sobre-`, `.areas-`, `.met-`, `.eq-`, `.faq-`, `.contato-`).
- Use os tokens (`tokens.css`) e componentes (`components.css`): `.card`, `.grade`, `.foto`, `.secao`, `.cabeca`, `.rotulo`, `.btn` (`--acento`, `--pilula`, `--contorno`, `--grande`), `.seta-link` (círculo ↗ + rótulo), `.num`, `.filete`. Tipografia: títulos `h1/h2` Josefin Sans fina em caixa alta; `h3`, rótulos, nav e botões em Barlow Condensed caixa alta; texto em Barlow 15px.
- `.seta-link` precisa deste SVG dentro do círculo: `<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M3 9l6-6M4 3h5v5"/></svg>`.

## Mídia

Imagens em `src/assets/img/<nome>-<largura>.webp` (480, 800, 1200, 1600). Use caminho absoluto `/src/assets/img/...`, `srcset` + `sizes` + `width`/`height` + `loading="lazy" decoding="async"` (menos no topo).

| Nome | Conteúdo |
|---|---|
| hero | advogada (Helena) de blazer vinho num corredor escuro de vidro verde-acinzentado, à direita do quadro, 16:9 (≈2752×1536) |
| sobre-escada | advogada de casaco cinza descendo escada de pedra de um fórum antigo, corrimão de latão, 4:5 |
| area-lobby | lobby corporativo escuro, pessoas borradas passando, advogada de terno creme parada no centro, 4:3 |
| area-contrato | mão assinando contrato com caneta-tinteiro em mesa de nogueira, abajur de latão, 4:3 |
| area-escritorio | escritório à noite com poltrona chesterfield vinho, mesa e a cidade pela janela, 4:3 |
| equipe-helena / equipe-rafael / equipe-livia | retratos de estúdio 3:4 em fundo carvão |
| contato-sala | sala de reunião escura ao entardecer, mesa de pedra, cidade pela janela, 16:9 |

Vídeo do topo (loop de 16s que vai e volta, sem áudio): `src/assets/video/topo-1280.mp4` (16:9, poster `topo-poster.webp`) e `src/assets/video/topo-retrato.mp4` (9:16 recortado nela, poster `topo-retrato-poster.webp`). Ela vira o rosto devagar, uma luz quente passa pelo vidro, a câmera se aproxima.

## Movimento

- Cinematográfico e contido: 0.8–1.4s, `expo.out` / `power3.out`. Deslocamentos ≤ 32px. Nada de bounce, nada girando à toa.
- Revelações de imagem: máscara (`clip-path: inset(...)`) abrindo + foto de 1.12→1 de escala por dentro. Parallax sutil (≤ 60px) com `scrub`.
- `pin` só ≥ 1024px (via `ctx.gsap.matchMedia()`). Ponteiro só com `ctx.desktop`.
- Hover/foco em tudo: cards clareiam (`--panel` → `--panel-2`), círculo da `.seta-link` enche, fotos aproximam 1.04.
- **Movimento reduzido (`ctx.reduce`)**: sem scrub/pin/parallax/vídeo em autoplay (mostra o poster); tudo visível.
- Só `transform`/`opacity`/`clip-path`. Genéricos prontos: `data-split`, `data-reveal`, `data-reveal-delay`, `data-contar="20" data-sufixo="+"` (ver `motion.js`). `ctx = { gsap, ScrollTrigger, SplitText, lenis, reduce, desktop }`. Para rolar: `import { rolarPara } from '../motion.js'`.

## Texto e regras da OAB (Código de Ética, arts. 39–47, e Provimento 205/2021)

- Português do Brasil, tom sóbrio, claro, sem juridiquês desnecessário. Público: empresas e pessoas físicas de classe média/alta em São Paulo.
- **Proibido**: promessa ou insinuação de resultado ("ganhe sua causa", "% de êxito", "casos ganhos"); preço, honorários em valor, "consulta grátis", "promoção"; autoelogio comparativo ("o melhor", "líder", "nº 1"); nomes de clientes ou casos; apelo emocional sensacionalista; captação ("não perca", urgência).
- Permitido/obrigatório: nome do escritório, **OAB da sociedade e dos advogados**, áreas, equipe, endereço, horários, canais, conteúdo informativo. No rodapé: "Varela Advocacia · Sociedade de Advogados · OAB/SP nº 00.000" (exemplo), "Conteúdo informativo, em conformidade com o Código de Ética e Disciplina da OAB e o Provimento nº 205/2021." e "Imagens ilustrativas. Página de demonstração com dados de exemplo."
- Dados de exemplo: fundado em 2004 (20+ anos); 6 áreas; 14 advogados; atendimento em 3 idiomas; endereço "Rua Exemplo, 000 · 12º andar · Itaim Bibi · São Paulo – SP"; horário seg a sex, 9h–18h; e-mail contato@varela.adv.br; WhatsApp via `data-wa`.
- Sócios: **Dra. Helena Varela** (sócia fundadora · Empresarial e Contratos · OAB/SP 000.001 · retrato equipe-helena, é a mulher do topo), **Dr. Rafael Montenegro** (sócio · Tributário e Trabalhista empresarial · OAB/SP 000.002), **Dra. Lívia Andrade** (sócia · Família, Sucessões e Imobiliário · OAB/SP 000.003).
- WhatsApp: qualquer `<a class="btn …" data-wa="<contexto>" href="#contato">` vira link (contextos em `config.js`: topo, nav, pilares, sobre, areas, metodo, equipe, duvidas, contato, flutuante). Rótulo principal: "Agendar reunião" ou "Fale conosco".

## Ordem, ids

| # | Dobra (arquivos) | id |
|---|---|---|
| 1 | topo (nav + hero com vídeo) | `topo` |
| 2 | pilares (4 cards + números) | `pilares` |
| 3 | sobre | `escritorio` |
| 4 | areas | `areas` |
| 5 | metodo | `metodo` |
| 6 | equipe | `equipe` |
| 7 | duvidas | `duvidas` |
| 8 | contato (+ rodapé + botão flutuante) | `contato` |

Nav: Áreas `#areas` · Escritório `#escritorio` · Equipe `#equipe` · Método `#metodo` · Dúvidas `#duvidas` + "Fale conosco" (acento).

Cada `<section id="…" class="<prefixo>" data-dobra="<dobra>" aria-labelledby="<id>-titulo">` com `h2#<id>-titulo` (só o topo tem `h1`).

## Conferência visual (obrigatória, mas objetiva: no máximo 3 rodadas)

```
node scripts/shot.mjs --selector '#<id>' --width 1440 --height 900 --wait 1800 --scroll-through --out .tmp-shots/<dobra>-desk.png
node scripts/shot.mjs --selector '#<id>' --width 390 --height 844 --mobile --wait 1800 --scroll-through --out .tmp-shots/<dobra>-mob.png
node scripts/shot.mjs --selector '#<id>' --width 1440 --height 900 --reduced-motion --out .tmp-shots/<dobra>-reduced.png
```
Abra os PNGs (Read) e corrija o que estiver feio, desalinhado, cortado ou ilegível. Console limpo. `npx vite build --outDir .tmp-build-<dobra>` tem de compilar (apague a pasta depois).
