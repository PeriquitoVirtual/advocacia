import { linkWhatsApp } from './config.js';

const areas = {
  trabalho: ['Direito do Trabalho', 'Orientação jurídica para compreender relações de trabalho e avaliar as medidas adequadas a cada situação.', ['Análise de contratos e condições de trabalho', 'Verbas rescisórias e encerramento do vínculo', 'Jornada de trabalho e remuneração', 'Acompanhamento de demandas trabalhistas'], 'Carteira de trabalho, contrato, recibos de pagamento, registros de jornada e documentos relativos ao desligamento, quando houver.', 'Posso buscar orientação antes de encerrar meu contrato?', 'O atendimento pode ser solicitado durante a relação de trabalho. A análise considera os documentos e o contexto apresentado para esclarecer as possibilidades do caso.'],
  tributario: ['Direito Tributário', 'Análise de questões tributárias para pessoas físicas e empresas, com atenção à documentação e à realidade de cada contribuinte.', ['Orientação sobre cobranças e débitos tributários', 'Análise de notificações e autuações fiscais', 'Atuação administrativa e judicial', 'Avaliação de pagamentos e questões de restituição'], 'Notificações, guias de recolhimento, comprovantes de pagamento, declarações e documentos do procedimento fiscal, se disponíveis.', 'O atendimento contempla pessoas físicas e empresas?', 'Sim. A orientação é definida conforme a natureza da questão tributária, a documentação disponível e a situação do contribuinte.'],
  criminal: ['Direito Criminal', 'Atendimento reservado e acompanhamento jurídico em questões criminais, com análise cuidadosa das circunstâncias apresentadas.', ['Orientação diante de intimações', 'Acompanhamento de investigações e procedimentos', 'Defesa e acompanhamento processual', 'Orientação a vítimas e pessoas envolvidas'], 'Intimações, boletins de ocorrência, número do processo e documentos relacionados aos fatos. No primeiro contato, informe se há algum ato agendado.', 'Recebi uma intimação. O que informar no contato?', 'Informe qual órgão expediu a intimação, a data prevista e a existência de processo ou procedimento. Esses dados ajudam a organizar a análise e o atendimento.'],
  cobranca: ['Ações de Cobrança', 'Avaliação de medidas para tratar inadimplementos e buscar a recuperação de créditos com organização documental.', ['Análise da origem e documentação do crédito', 'Orientação sobre negociação e composição', 'Cobrança extrajudicial', 'Acompanhamento de ações de cobrança'], 'Contratos, comprovantes de entrega ou prestação de serviço, notas fiscais, mensagens e histórico de pagamentos ou negociações.', 'É possível analisar uma dívida sem contrato assinado?', 'O atendimento permite avaliar os documentos e registros disponíveis. A medida adequada depende das características do crédito e das provas apresentadas.'],
  execucao: ['Execução de Títulos', 'Análise de títulos e acompanhamento de medidas executivas, considerando a documentação e o histórico da obrigação.', ['Avaliação de títulos e documentos de crédito', 'Organização do histórico de pagamento', 'Atuação em execuções', 'Acompanhamento de diligências processuais'], 'Título ou instrumento contratual, comprovantes, demonstrativo do débito e registros de pagamentos parciais ou acordos.', 'Como saber qual medida é adequada ao meu documento?', 'A definição depende da análise do documento, da obrigação e de suas condições. O primeiro atendimento permite identificar os elementos necessários para essa avaliação.'],
  sentenca: ['Cumprimento de Sentença', 'Acompanhamento da etapa voltada à efetivação de decisões judiciais, com atenção ao conteúdo da decisão e à situação do processo.', ['Análise da decisão e do andamento processual', 'Organização de informações e cálculos', 'Acompanhamento do cumprimento de obrigações', 'Avaliação das medidas processuais cabíveis'], 'Número do processo, decisão judicial, cálculos disponíveis e comprovantes de eventual cumprimento ou pagamento.', 'Já tenho uma decisão. Como iniciar a análise?', 'Informe o número do processo e disponibilize a decisão e os documentos relacionados. O andamento e o conteúdo da decisão orientarão os próximos passos.'],
};

export function initAreasModal(section, { lenis }) {
  const contactButton = document.querySelector('.topo-nav .nav-emerald').innerHTML;
  const dialog = document.createElement('dialog');
  dialog.id = 'area-modal';
  dialog.className = 'area-modal';
  dialog.setAttribute('aria-labelledby', 'area-modal-titulo');
  dialog.setAttribute('data-lenis-prevent', '');
  dialog.innerHTML = '<button class="area-modal__fechar" type="button" autofocus aria-label="Fechar detalhes da área"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg></button><div class="area-modal__conteudo"></div>';
  document.body.append(dialog);
  let opener;
  let overflow;
  const close = () => dialog.close();
  dialog.querySelector('button').addEventListener('click', close);
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) close();
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = overflow;
    lenis?.start();
    opener?.focus({ preventScroll: true });
  });
  section.querySelectorAll('[data-area]').forEach(button => {
    button.setAttribute('aria-label', `Saiba mais sobre ${areas[button.dataset.area][0]}`);
    button.addEventListener('click', () => {
      const key = button.dataset.area;
      const [title, intro, services, documents, question, answer] = areas[key];
      dialog.querySelector('.area-modal__conteudo').innerHTML = `
        <header class="area-modal__hero"><h2 id="area-modal-titulo">${title}</h2><p>${intro}</p></header>
        <div class="area-modal__grade"><section><p class="area-modal__rotulo">Como posso auxiliar</p><h3>Atuação em ${title.toLocaleLowerCase('pt-BR')}.</h3><ol>${services.map(service => `<li>${service}</li>`).join('')}</ol><p class="area-modal__nota">Cada situação é avaliada de forma individual. A definição das medidas depende da análise do caso e dos documentos disponíveis.</p></section>
        <aside><p class="area-modal__rotulo">Primeiro atendimento</p><h3>O que reunir para a análise</h3><p>${documents}</p><p>Se ainda não tiver todos os documentos, informe o que está disponível no primeiro contato.</p></aside></div>
        <section class="area-modal__duvida"><p class="area-modal__rotulo">Dúvida frequente</p><details open><summary>${question}</summary><p>${answer}</p></details></section>
        <footer class="area-modal__contato"><div><h3>Converse com a advogada</h3><p class="area-modal__nota">Atendimento presencial em Goiânia e remoto, conforme a demanda.</p></div><a class="nav-emerald area-modal__whatsapp" href="${linkWhatsApp(key)}" target="_blank" rel="noopener noreferrer">${contactButton}</a></footer>`;
      opener = button;
      overflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      lenis?.stop();
      dialog.showModal();
      dialog.querySelector('.area-modal__conteudo').scrollTop = 0;
    });
  });
}
