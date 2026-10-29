# Verificação — 29/10/2026

Projeto: `../central-demandas/index.html`. Fonte oficial: `../demandas_otimizado (1).html`.

## Resultado final

| Navegador instalado | Verificações aprovadas | Falhas | Erros JS/console capturados |
| --- | ---: | ---: | ---: |
| Chrome 156.0.8078.48 | 75 | 0 | 0 |
| Edge 156.0.4314.50 | 75 | 0 | 0 |
| Opera GX 132 / Chromium 148.0.7778.265 | 75 | 0 | 0 |
| **Total** | **225** | **0** | **0** |

Relatórios por asserção: [Chrome](chrome-results.json), [Edge](edge-results.json), [Opera](opera-results.json).

## Fluxo obrigatório

Os 18 passos foram cobertos nos três navegadores reais, em modo headless, abrindo arquivos por `file://` em perfis isolados:

| Passos | Resultado |
| --- | --- |
| 1 — Abrir painel | Cinco exemplos originais e indicadores 5/2/1/2 |
| 2–4 — Criar demanda, cadastrar print e conferir indicadores | Registro único, PNG salvo e indicadores 6/3/1/2 |
| 5–6 — Pesquisar e filtrar | Correspondências e ausência de resultados corretas |
| 7–8 — Selecionar responsável e assumir | Vinícius atribuído, status em andamento, métricas atualizadas |
| 9–10 — Detalhes, ampliar e fechar imagem | Print decodificado, proporção preservada, botão/overlay/ESC/teclado funcionando |
| 11–12 — Marcar lançada e conferir status | Confirmação aceita/cancelada, status e métricas corretos |
| 13 — Abas e menu | Todas as categorias de status e seleção ativa sincronizadas |
| 14 — Recolher/expandir menu | Estado visual, atributo ARIA e preferência persistida |
| 15 — Atualizar a página | Registro, status, anexo e estado do menu preservados |
| 16 — Excluir com confirmação | Cancelamento preserva; confirmação exclui e atualiza métricas |
| 17 — Celular | Viewports 390 e 320 px sem rolagem horizontal; formulários e detalhes contidos |
| 18 — Console | Nenhum erro JS, rejeição não tratada ou console.error capturado |

Também aprovados: três ordenações; campos obrigatórios e espaços em branco; cinco opções de responsável; PNG/JPEG/WebP; limite de 1 MB; conteúdo falso/truncado; falha do FileReader; envio duplicado; foco em modais e cartões; escape de texto; imagem adulterada no armazenamento; JSON e registros inválidos preservados; falhas de gravação ao criar/assumir/finalizar/excluir/restaurar; cancelar e confirmar restauração.

## Fidelidade e arquivos

- Comparação automatizada dos elementos visíveis do painel com os mesmos dados: posições, dimensões, cores, fonte, peso, tamanho, linha, margens, preenchimento, arredondamentos, sombras, display e gap iguais em **1920, 1366, 768, 390 e 320 px**.
- `content-visibility` foi mantido; ambos os documentos foram colocados nas mesmas condições de visibilidade antes da medição.
- CSS original preservado integralmente. Seis declarações/regras foram adicionadas apenas para transferir os estilos inline originais para o stylesheet.
- Nenhum ID do HTML original removido ou adicionado; classes originais mantidas.
- SHA-256 do HTML oficial antes/depois: `663579A00D8835992F0881CD312E5EA82497F069217E2C79BE5CD0990F5BA63F`.
- Capturas para inspeção visual: [desktop](desktop.png) e [celular](mobile.png).

## Método e limites

`browser-tests.js` controla a interface pelo DOM, usando eventos, formulários, arquivos e armazenamento reais do navegador. As caixas de confirmação são interceptadas pelo teste para verificar aceitação e cancelamento. Falhas de armazenamento e FileReader são simuladas deliberadamente e restauradas após cada cenário. `cdp.ps1` usa o protocolo de depuração local apenas para instrumentação, navegação e coleta; não integra a aplicação.

Os perfis de teste são separados dos perfis pessoais. O flag `--allow-file-access-from-files` é usado somente no teste para comparar iframes de arquivos locais; a aplicação normal não precisa desse flag. Os registros antigos do usuário não foram acessados ou migrados.

Para repetir o roteiro, inicie um navegador com um `--user-data-dir` novo e descartável e `--allow-file-access-from-files`, instale a captura de erros antes da navegação e abra `runner.html#isolated-profile`. O runner não executa automaticamente quando aberto sem esse fragmento, para evitar alterações acidentais em um perfil pessoal. Nunca aponte o teste para o perfil utilizado no trabalho diário.

Não foram usados aparelhos físicos nem leitores de tela, e não foi medido desempenho em hardware de baixa potência. A geometria do painel foi comparada automaticamente; os modais foram verificados funcionalmente e quanto ao encaixe nas telas menores.
