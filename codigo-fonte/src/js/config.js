// Dados de contato fornecidos para este projeto.
export const WHATSAPP = '5562999190428';
export const MENSAGENS = {
  padrao: 'Olá! Vim pelo site da Izabella Almeida e gostaria de informações sobre o atendimento.',
  areas: 'Olá! Gostaria de apresentar uma situação e verificar a possibilidade de atendimento jurídico.',
  duvidas: 'Olá! Vim pelo site e tenho uma dúvida sobre o atendimento.',
};
export function linkWhatsApp(contexto = 'padrao') {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(MENSAGENS[contexto] || MENSAGENS.padrao)}`;
}
