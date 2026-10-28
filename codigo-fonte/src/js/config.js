// Mensagens por assunto para os botões de WhatsApp.
export const WHATSAPP = "5562999190428";
export const MENSAGENS = {
  "padrao": "Olá, Izabella! Vim pelo site e gostaria de informações sobre o atendimento jurídico.",
  "nav": "Olá, Izabella! Gostaria de informações sobre seu atendimento jurídico.",
  "topo": "Olá, Izabella! Encontrei seu site e gostaria de apresentar minha situação para verificar a possibilidade de atendimento.",
  "sobre": "Olá, Izabella! Li sua apresentação e gostaria de informações sobre o atendimento com você.",
  "areas": "Olá, Izabella! Gostaria de verificar se minha demanda está entre suas áreas de atuação.",
  "trabalho": "Olá, Izabella! Gostaria de entender meus direitos em uma questão trabalhista. Como funciona o atendimento?",
  "tributario": "Olá, Izabella! Tenho uma dúvida tributária e gostaria de informações sobre o atendimento.",
  "criminal": "Olá, Izabella! Gostaria de informações sobre atendimento em Direito Criminal.",
  "cobranca": "Olá, Izabella! Tenho uma dívida em aberto a receber e gostaria de consultar a possibilidade de análise dos documentos.",
  "execucao": "Olá, Izabella! Tenho um título e gostaria de consultar a possibilidade de análise para execução.",
  "sentenca": "Olá, Izabella! Preciso de orientação sobre uma sentença e os próximos passos. Como funciona o atendimento?",
  "etica": "Olá, Izabella! Gostaria de esclarecer como funciona o atendimento jurídico.",
  "estrategia": "Olá, Izabella! Gostaria de apresentar minha situação e entender quais documentos são necessários para a análise.",
  "proximidade": "Olá, Izabella! Gostaria de informações sobre o atendimento individualizado.",
  "sigilo": "Olá, Izabella! Gostaria de saber como compartilhar informações e documentos para o atendimento.",
  "presencial": "Olá, Izabella! Gostaria de agendar um atendimento presencial em Goiânia. Quais são as disponibilidades?",
  "remoto": "Olá, Izabella! Gostaria de informações sobre o atendimento jurídico on-line.",
  "acompanhamento": "Olá, Izabella! Gostaria de apresentar uma demanda e saber quais documentos devo reunir para o atendimento.",
  "equipe": "Olá, Izabella! Gostaria de informações sobre as modalidades de atendimento.",
  "metodo": "Olá, Izabella! Gostaria de agendar um atendimento. Podemos consultar a disponibilidade?",
  "duvidas": "Olá, Izabella! Li as perguntas frequentes e gostaria de esclarecer uma dúvida sobre o atendimento.",
  "contato": "Olá, Izabella! Gostaria de apresentar meu caso e saber como funciona a análise inicial.",
  "flutuante": "Olá, Izabella! Estou no seu site e gostaria de conversar sobre uma demanda jurídica."
};
export function linkWhatsApp(contexto = "padrao") {
 return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(MENSAGENS[contexto] || MENSAGENS.padrao)}`;
}
