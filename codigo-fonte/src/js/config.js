// =============================================================================
// Dados de contato (EXEMPLO: troque pelos reais antes de publicar para valer).
// Qualquer <a data-wa="<contexto>"> da página vira link de WhatsApp com a
// mensagem do contexto (ver main.js). Contexto sem mensagem usa 'padrao'.
// Texto sóbrio, sem promessa (Código de Ética da OAB e Provimento 205/2021).
// =============================================================================
export const WHATSAPP = '5511900000000'; // exemplo, número inválido de propósito
export const EMAIL = 'contato@varela.adv.br'; // exemplo

export const MENSAGENS = {
  padrao: 'Olá! Vim pelo site da Varela Advocacia e gostaria de agendar uma reunião.',
  topo: 'Olá! Vim pelo site da Varela Advocacia e gostaria de agendar uma reunião.',
  nav: 'Olá! Vim pelo site da Varela Advocacia e gostaria de falar com o escritório.',
  pilares: 'Olá! Vim pelo site e gostaria de entender como o escritório pode me orientar.',
  sobre: 'Olá! Vim pelo site e gostaria de agendar uma reunião com a equipe.',
  areas: 'Olá! Vim pelo site e gostaria de falar sobre uma questão jurídica.',
  metodo: 'Olá! Vim pelo site e gostaria de agendar a reunião inicial.',
  equipe: 'Olá! Vim pelo site e gostaria de agendar uma reunião com um dos sócios.',
  duvidas: 'Olá! Vim pelo site e tenho uma dúvida sobre o atendimento do escritório.',
  contato: 'Olá! Vim pelo site da Varela Advocacia e gostaria de agendar uma reunião.',
  flutuante: 'Olá! Vim pelo site da Varela Advocacia e gostaria de falar com o escritório.',
};

export function linkWhatsApp(contexto = 'padrao') {
  const texto = MENSAGENS[contexto] || MENSAGENS.padrao;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
}
