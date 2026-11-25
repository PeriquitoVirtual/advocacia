import { areas } from './areas-modal.js';
import { linkWhatsApp } from './config.js';

const destinations = {
  criminal: { key: 'criminal', label: 'Direito Criminal', title: 'Orientação jurídica em Direito Criminal', description: 'Atendimento reservado e acompanhamento jurídico em questões criminais, com análise cuidadosa das circunstâncias apresentadas.' },
  trabalhista: { key: 'trabalho', label: 'Direito do Trabalho', title: 'Orientação jurídica trabalhista', description: 'Orientação jurídica para compreender relações de trabalho e avaliar as medidas adequadas a cada situação.' },
};

function renderDestination(destination) {
  const [title, , services, documents, question, answer] = areas[destination.key];
  const contactButton = document.querySelector('.topo-nav .nav-emerald')?.innerHTML || '<span class="nav-emerald-btn-inner"><span class="nav-emerald-btn-text">CONVERSAR PELO WHATSAPP</span></span>';
  const section = document.createElement('section');
  section.className = `area-landing area-landing--${destination.label === 'Direito Criminal' ? 'criminal' : 'trabalhista'}`;
  section.id = 'destino-anuncio';
  section.setAttribute('aria-labelledby', 'area-landing-titulo');
  section.innerHTML = `
    <header class="area-landing__intro">
      <p class="area-landing__eyebrow">Izabella Almeida Andriani · OAB/GO 79.183</p>
      <h1 id="area-landing-titulo">${destination.title}</h1>
      <p class="area-landing__lead">${destination.description}</p>
      <p class="area-landing__location">Atendimento presencial em Goiânia e remoto, conforme a demanda.</p>
      <a class="nav-emerald area-landing__quick-contact" data-wa="${destination.key}" href="${linkWhatsApp(destination.key)}" target="_blank" rel="noopener noreferrer">${contactButton}</a>
    </header>
    <div class="area-modal area-landing__details">
      <div class="area-modal__grade">
        <section>
          <p class="area-modal__rotulo">Como posso auxiliar</p>
          <h3>Atuação em ${title.toLocaleLowerCase('pt-BR')}.</h3>
          <ol>${services.map(service => `<li>${service}</li>`).join('')}</ol>
          <p class="area-modal__nota">Cada situação é avaliada de forma individual. A definição das medidas depende da análise do caso e dos documentos disponíveis.</p>
        </section>
        <aside>
          <p class="area-modal__rotulo">Primeiro atendimento</p>
          <h3>O que reunir para a análise</h3>
          <p>${documents}</p>
          <p>Se ainda não tiver todos os documentos, informe o que está disponível no primeiro contato.</p>
        </aside>
      </div>
      <section class="area-modal__duvida">
        <p class="area-modal__rotulo">Dúvida frequente</p>
        <details open><summary>${question}</summary><p>${answer}</p></details>
      </section>
      <footer class="area-modal__contato">
        <div><h3>Converse com a advogada</h3><p class="area-modal__nota">O primeiro contato serve para apresentar a situação e verificar como funciona o atendimento.</p></div>
        <a class="nav-emerald area-modal__whatsapp" data-wa="${destination.key}" href="${linkWhatsApp(destination.key)}" target="_blank" rel="noopener noreferrer">${contactButton}</a>
      </footer>
    </div>`;
  return section;
}

export default function initAreaLanding() {
  const requestedArea = new URLSearchParams(window.location.search).get('area')?.toLowerCase();
  const destination = destinations[requestedArea];
  if (!destination) return;

  const top = document.querySelector('#topo');
  const heroCard = top?.querySelector('.topo-card');
  if (!top || !heroCard) return;

  document.body.classList.add('area-destino');
  document.body.classList.add(`area-destino--${requestedArea}`);
  top.insertBefore(renderDestination(destination), heroCard);
  heroCard.hidden = true;

  document.title = `${destination.label} | Izabella Almeida Advocacia`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', `${destination.description} Atendimento presencial em Goiânia e remoto, conforme a demanda. Izabella Almeida Andriani · OAB/GO 79.183.`);
}
