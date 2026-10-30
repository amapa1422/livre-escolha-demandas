# Entrega LOGOS-PAGES-002 — LivreEscolha Demandas

Registro: **2026-10-30T09:57:16-03:00**, America/Sao_Paulo. Alterações preparadas localmente em `Demandas/`. O repositório `amapa1422/livre-escolha-demandas` foi confirmado pelo plugin GitHub; não foi criado commit, push, PR ou deploy nesta tarefa.

## Ajustes visuais

- Removidos botão Restaurar demo e listener exclusivo, caixa lateral Modo demonstração e seus estilos exclusivos.
- Título Demandas em `--brand`, **Plus Jakarta Sans**, peso 600; tamanho e alinhamento mantidos. Google Fonts limitado ao texto Demandas, `display=swap`, preconnect e alternativas Segoe UI/Arial. A fonte foi efetivamente carregada no teste. Nenhum outro texto recebeu essa fonte; Gestão operacional preservado.
- Rodapé reduzido a `© 2026 Livre Escolha`, mantendo borda, espaçamento e alinhamento discretos. Dica do anexo mantém o limite e armazenamento local, retirando apenas “Para testes”.
- Logos ao lado do cliente: 32 × 24 px no card e 48 × 32 px nos detalhes, `object-fit:contain`, lazy/async, dimensão reservada e tratamento de falhas. Os prints permanecem independentes.
- Sem redesenho, bibliotecas de interface, animações contínuas, blur ou alteração de paleta/categorias/responsáveis/status.

## Logos e catálogo

Arquivo de entrada: `C:\Users\felipe.lobato\Downloads\LOGOS DE CLIENTES (1).zip`, preservado. Importação local com Python 3.13/Pillow em ambiente temporário, sem serviços de conversão externos. Nenhuma dependência foi acrescentada ao frontend/backend.

| Resultado | Quantidade |
| --- | ---: |
| Arquivos originais analisados e preservados | 295 |
| Empresas no catálogo | 291 |
| Logos únicas publicáveis | 118 |
| WebP gerados sem perda | 55 |
| PNG/JPEG mantidos por serem menores | 63 |
| Referências que reutilizam imagens idênticas | 173 |
| Cadastro repetido consolidado | 1 |
| Arquivos separados para revisão | 3 |

Os assets únicos passaram de **3.225.450 para 2.013.616 bytes**, redução de **37,6%**, além da deduplicação entre filiais. WebP só foi escolhido quando reduziu ao menos 5%; todos os WebP gerados foram comparados pixel a pixel em RGBA, incluindo transparência e dimensões, sem corte ou distorção. Os formatos mantidos foram conferidos byte a byte. Os nomes usam hash do conteúdo para evitar colisões.

Empresas foram identificadas pelos nomes dos arquivos, trocando separadores por espaços, sem inventar razões sociais nem expandir siglas. Filiais explicitamente nomeadas continuam como empresas distintas mesmo quando compartilham a imagem. `Sicoob_Coopcred_Ccred.png` foi consolidado com `Sicoob_Coopcred(Ccred).png` por identidade normalizada.

Catálogo canônico: [clientes.json](../central-demandas/assets/clientes/clientes.json), com `id`, `nome`, `nome_normalizado`, `logo`, `arquivo_original`. IDs são determinísticos e não dependem da ordem no ZIP. A relação futura com um banco pode usar esse identificador; nenhuma integração com PostgreSQL foi implementada.

Revisão manual, sem associação automática:

| Arquivo | Pendência |
| --- | --- |
| `Comercial_Agricola_Cornelio.png` | Confirmar se é o mesmo cliente de Cornelio Procopio; a grafia completa já possui arquivo. |
| `Comercial_Agricola_Jardim.png` | Confirmar se é o mesmo cliente de Jardim Alegre; a grafia completa já possui arquivo. |
| `Expo_Design.enc` | Formato não suportado. Fornecer PNG/JPEG/WebP legível; nenhum conteúdo foi inventado. |

Originais extraídos em `backups/2026-10-30_093828_originais-logos_6cefebf3/`, com manifesto. A extração valida caminhos, limita quantidade/tamanho total, rejeita travessia, links simbólicos, unidades, nomes reservados Windows e caminhos duplicados. O destino da importação precisa ser novo; backups anteriores não foram reutilizados.

Inventário completo de arquivos, hashes, dimensões, resultados, duplicações e motivos de revisão: [LOGOS_PROCESSADAS.json](LOGOS_PROCESSADAS.json). A lista dos 55 arquivos WebP está nas entradas com `status: webp_sem_perda`.

## Autocompletar e persistência

O campo existente aceita consulta instantânea por trechos, ignorando acentos/caixa. Lista vertical com mouse e setas; Enter seleciona; Tab fecha a lista; Escape fecha primeiro as sugestões e depois mantém o comportamento de fechamento dos modais. O nome selecionado preenche o campo.

Somente a seleção explícita acrescenta `clientId` à demanda. A logo é resolvida pelo catálogo local; URLs/imagens não são duplicadas no localStorage. Editar o nome remove a associação. Clientes sem correspondência podem ser cadastrados livremente, sem logo incorreta. Registros antigos não são migrados nem associados por inferência.

As chaves `livre_escolha_demandas_demo_v1` e `demandas_sidebar_closed`, IDs e campos anteriores foram preservados. Nenhum dado do perfil pessoal foi acessado/apagado. O backend, incluindo `.env`, foi apenas inventariado por hash e permaneceu intacto; valores de segredos não foram exibidos.

## Prints

PNG, JPEG e WebP continuam aceitos até 1 MB, com validação de assinatura/decodificação. A conversão opcional usa canvas local, WebP de qualidade máxima (`1`), resolução integral e economia mínima de 10%. Diferentemente das logos preparadas com Pillow, a conversão de prints no navegador não é declarada lossless. WebP de entrada, imagens acima de 16 MP, falhas ou ausência de economia preservam o original validado. Mensagens de quota/formato/tamanho continuam disponíveis. Nenhum print é enviado a serviços externos.

## Estrutura e publicação

`central-demandas/index.html` é a fonte principal. `sync_pages.py` gera `index.html` da raiz em sentido único, ajustando recursos relativos e marcando a saída como gerada. O HTML raiz nunca serve como entrada da sincronização.

O script também gera `assets/clientes/catalogo.js` diretamente de `clientes.json`, para que o mesmo catálogo funcione por HTTP e `file://`, sem fetch bloqueado por CORS. `app.js` resolve os caminhos das logos em relação ao próprio arquivo. Não existe cópia manual da lógica de negócio.

`python sync_pages.py --check` verifica as saídas, CSS/JS, campos/duplicidades do catálogo, caminhos e existência de cada logo. Foram testadas raiz, entrada organizada e ambas sob o prefixo `/livre-escolha-demandas/`. **A versão nova não foi implantada nem testada na hospedagem real do GitHub Pages.**

## Arquivos alterados/adicionados

Alterados nesta tarefa, incluindo arquivos que já estavam sem rastreamento:

- `central-demandas/index.html`, `css/style.css`, `js/app.js` e `README.md`.
- `index.html` (gerado), `sync_pages.py`, `README_PUBLICACAO.md` e `.gitignore`.
- `_CONTROLE_PROJETO/ESTADO_ATUAL.md`, `FUNCIONALIDADES.md`, `DESIGN_APROVADO.md`, `HISTORICO_ALTERACOES.md` e `LEIA_PRIMEIRO.md`.

Adicionados:

- `central-demandas/assets/clientes/clientes.json`, `catalogo.js` e 118 assets em `logos/`.
- `scripts/process_client_logos.py`.
- `_CONTROLE_PROJETO/LOGOS_PROCESSADAS.json` e este relatório.
- `.qa/logos-pages/`: roteiros, servidor local restrito, relatórios e capturas desta validação. Temporários/fixtures são ignorados pelo Git.
- Dois backups únicos descritos neste relatório, mantidos localmente.

Nenhum arquivo preexistente foi removido. `demandas_otimizado (1).html` já tinha a cor `--text:#f6f3f3` modificada antes desta tarefa; essa alteração foi preservada. O backend e os testes/backups anteriores não foram editados. As referências antigas na documentação foram mantidas como histórico, com seção vigente explícita.

## Testes executados

| Verificação | Resultado/evidência |
| --- | --- |
| Fluxos de aplicação, autocompletar, logo, persistência, filtros, status, exclusão, quota e corrupção | **57 verificações aprovadas**, [Chrome](../.qa/logos-pages/chrome-results.json). |
| Fonte efetivamente carregada, JPEG original quando menor, WebP sem reprocessar e Tab | **5 verificações aprovadas**, [complementares](../.qa/logos-pages/extra-results.json). |
| Console/JavaScript | Monitoramento ativo por sessão CDP: **zero eventos de erro de console/JavaScript** nas duas execuções finais. |
| Abertura direta via arquivo | Cadastro, catálogo, CSS e logo aprovados, [file://](../.qa/logos-pages/file-results.json). |
| Integridade/conversão/extração/publicação/backend/backups | **514 verificações aprovadas**, [integridade](../.qa/logos-pages/integrity-results.json). |
| Sincronização | `sync_pages.py --check` aprovado. |
| Responsividade | 1920, 1366, 768, 390 e 320 px sem overflow horizontal; sugestões contidas. [Desktop](../.qa/logos-pages/desktop.png), [celular](../.qa/logos-pages/mobile.png), também inspecionados visualmente. |
| Git diff | Sem erros de whitespace. Sem staging, commit ou push. |

Os testes foram executados no Chrome headless com perfil temporário e registros sintéticos. As primeiras execuções identificaram um ajuste de foco na seleção do cliente e limitações do runner (cache, lazy load fora da viewport e captura de erros sem sessão CDP ativa); foram corrigidos antes das execuções finais acima. Os relatórios de outros navegadores presentes em `.qa/` são históricos e não foram apresentados como validação desta alteração.

## Backup, reversão e pendências

Backup preventivo: `backups/2026-10-30_093340_logos-pages_a78d5ba2/`, com **18 arquivos** e manifesto SHA-256/tamanhos, incluindo documentação e alterações preexistentes. Para reverter, primeiro faça um backup separado do estado atual, compare com esse marco e aplique somente os trechos desejados, preservando alterações posteriores. Execute a sincronização correspondente e valide. Consulte [INSTRUCOES_REVERSAO.md](INSTRUCOES_REVERSAO.md). Não restaure o monolítico sobre a raiz gerada. Backups de código não recuperam localStorage.

Pendências: revisão dos três arquivos indicados, publicação da alteração e teste após o deploy real. Não houve benchmark em máquina de baixa potência nem teste em aparelhos físicos/leitores de tela. A aplicação permanece local por navegador, sem sincronização entre usuários.
