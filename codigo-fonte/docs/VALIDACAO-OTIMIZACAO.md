# Validação da otimização, 27/10/2026

## Antes de editar

Backup ZIP verificado com 204 arquivos e tag `backup/antes-otimizacao-2026-10-27` salva no GitHub. Instruções de retorno em `RETORNO-E-MEDICAO.md`, na raiz.

## Alterações

- Topo com localização, registro profissional e texto de apoio mais curto.
- Textos importantes com 16 px, títulos mais legíveis e chamadas de WhatsApp explícitas.
- Pilares sem links repetidos ou números decorativos; seção de atendimento com informações práticas, sem retratos ilustrativos repetidos.
- Correção do seletor que causava erro no link secundário de WhatsApp.
- Preservadas as fotos escolhidas, o enquadramento sem corte da cabeça e os efeitos dos botões principais.
- Vídeos com o mesmo conteúdo, comprimidos: celular de 3.878.854 para 485.316 bytes; computador de 2.618.124 para 340.157 bytes. Os originais foram preservados.
- Fotos de áreas convertidas para WebP: 69.148 e 40.858 bytes.
- Prévia de compartilhamento, ícone de celular, canonical, robots, sitemap, página de privacidade e arquivo 404 preparados para o domínio informado.
- Google Ads com consentimento básico: tag externa só carrega após a permissão; recusa não bloqueia o contato.

## Conferências

- Build concluído.
- Auditoria automática: 0 erros e 0 alertas. Sugestão restante: ferramenta de análise de audiência como GA4. Google Ads está integrado separadamente e não é identificado por essa regra do auditor.
- Navegação em 1440 × 900, 390 × 844 e 360 × 740: sem rolagem lateral, imagens quebradas ou erros de JavaScript. Botão principal visível antes da rolagem após fechar a escolha de consentimento.
- Menu móvel, perguntas expansíveis e links de WhatsApp conferidos.
- Teste com a tag do Google simulada: nenhum carregamento antes da permissão; recusa persistida; IDs conferidos; um evento por clique; retirada da permissão bloqueia eventos posteriores. Nenhuma conversão de teste enviada à conta real.

## Depois da publicação

Validar no Tag Assistant e no Google Ads o recebimento e a atribuição da ação `AW-18420578557/r01eCJG_2_EcEP3xzs9E`. Ela mede clique no WhatsApp, não mensagem enviada ou contratação. Não foi instalado GA4.

Executar PageSpeed no domínio público depois de subir os novos arquivos. Não foi atribuída nota de desempenho nem estimativa de ganho de conversão com base nos testes locais. O arquivo 404 depende de a hospedagem apontar erros para ele.
