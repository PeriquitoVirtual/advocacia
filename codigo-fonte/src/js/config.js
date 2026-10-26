// Mensagens por assunto para os botões de WhatsApp.
export const WHATSAPP = "5562999190428";
export const MENSAGENS = {
  "padrao": "Olá, Izabella! Vim pelo site e gostaria de informações sobre o atendimento jurídico.",
  "nav": "Olá, Izabella! Gostaria de informações sobre seu atendimento jurídico.",
  "topo": "Olá, Izabella! Encontrei seu site e gostaria de apresentar minha situação para verificar a possibilidade de atendimento.",
  "sobre": "Olá, Izabella! Li sua apresentação e gostaria de informações sobre o atendimento com você.",
  "areas": "Olá, Izabella! Gostaria de verificar se minha demanda está entre suas áreas de atuação.",
  "trabalho": "Olá, Izabella! Gostaria de informações sobre atendimento em Direito do Trabalho.",
  "tributario": "Olá, Izabella! Gostaria de informações sobre atendimento em Direito Tributário.",
  "criminal": "Olá, Izabella! Gostaria de informações sobre atendimento em Direito Criminal.",
  "cobranca": "Olá, Izabella! Gostaria de informações sobre atendimento em uma questão de cobrança.",
  "execucao": "Olá, Izabella! Gostaria de informações sobre atendimento para execução de um título.",
  "sentenca": "Olá, Izabella! Gostaria de informações sobre atendimento em cumprimento de sentença.",
  "etica": "Olá, Izabella! Gostaria de esclarecer como funciona o atendimento jurídico.",
  "estrategia": "Olá, Izabella! Gostaria de apresentar minha situação e entender quais documentos são necessários para a análise.",
  "proximidade": "Olá, Izabella! Gostaria de informações sobre o atendimento individualizado.",
  "sigilo": "Olá, Izabella! Gostaria de saber como compartilhar informações e documentos para o atendimento.",
  "presencial": "Olá, Izabella! Gostaria de informações sobre o atendimento presencial em Goiânia.",
  "remoto": "Olá, Izabella! Gostaria de informações sobre o atendimento jurídico on-line.",
  "acompanhamento": "Olá, Izabella! Gostaria de informações sobre como funciona o acompanhamento de uma demanda.",
  "equipe": "Olá, Izabella! Gostaria de informações sobre as modalidades de atendimento.",
  "metodo": "Olá, Izabella! Gostaria de saber como funciona o primeiro atendimento e quais documentos devo reunir.",
  "duvidas": "Olá, Izabella! Li as perguntas frequentes e gostaria de esclarecer uma dúvida sobre o atendimento.",
  "contato": "Olá, Izabella! Gostaria de consultar a disponibilidade para atendimento jurídico.",
  "flutuante": "Olá, Izabella! Estou no seu site e gostaria de conversar sobre uma demanda jurídica."
};
export function linkWhatsApp(contexto = "padrao") {
 return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(MENSAGENS[contexto] || MENSAGENS.padrao)}`;
}
