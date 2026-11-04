# Histórico de alterações

Ordem cronológica crescente. Datas/horários de novas entradas usam America/Sao_Paulo e deslocamento UTC. Não sobrescrever entradas antigas para ocultar mudanças; acrescente retificações quando necessário.

## Evidências anteriores à implantação

O projeto já continha o HTML oficial, a versão organizada e os artefatos `.qa` quando este controle foi criado. O README existente e `.qa/RESULTADOS.md` documentam organização/validação anterior em 29/10/2026; os três JSONs de resultados confirmam 75 verificações aprovadas por navegador. O horário e um commit daquela execução não estão registrados nesses artefatos. Por isso, não se cria aqui uma sequência de alterações anteriores ou horários presumidos.

## 2026-10-29T13:37:27-03:00 — CTRL-001 — Proteção documental e backup inicial

**Solicitação do usuário:** implementar documentação permanente, memória, histórico, regras no AGENTS e backup inicial verificável, sem alterar arquivos funcionais, design, lógica ou estrutura existente.

**Arquivos existentes modificados:** nenhum.

**Arquivos adicionados:**

- `AGENTS.md` na raiz `Demandas`.
- `_CONTROLE_PROJETO/LEIA_PRIMEIRO.md`.
- `_CONTROLE_PROJETO/FUNCIONALIDADES.md`.
- `_CONTROLE_PROJETO/DESIGN_APROVADO.md`.
- `_CONTROLE_PROJETO/HISTORICO_ALTERACOES.md`.
- `_CONTROLE_PROJETO/ESTADO_ATUAL.md`.
- `_CONTROLE_PROJETO/INSTRUCOES_REVERSAO.md`.
- `_CONTROLE_PROJETO/backups/versao_inicial/MANIFESTO_SHA256.json`.
- Sete cópias sob `_CONTROLE_PROJETO/backups/versao_inicial/`: `demandas_otimizado (1).html`, `central-demandas/index.html`, `central-demandas/css/style.css`, `central-demandas/js/app.js`, `central-demandas/README.md`, `central-demandas/.gitignore` e `central-demandas/assets/images/.gitkeep`.

**O que foi alterado:** criada somente a camada documental e de cópias; registrados funcionamento atual, diferenças entre entradas, design aprovado, estrutura real, limites, estado do Git, convenção de backups e procedimentos de reversão.

**Funcionalidades afetadas:** nenhuma. Não foi editado HTML/CSS/JavaScript existente nem acessado o armazenamento do navegador. Nenhuma dependência, integração, servidor ou rotina automática foi acrescentada.

**Testes/verificações desta tarefa:**

| Verificação | Resultado |
| --- | --- |
| Inventário anterior e comparação final | 17 arquivos preexistentes preservados, mesmos tamanhos e SHA-256; nenhum removido. |
| Backup inicial | 7/7 arquivos copiados, 92.385 bytes, com SHA-256 e tamanhos idênticos; estrutura relativa e arquivos ocultos preservados. |
| Escopo do backup | Somente o original e `central-demandas`; sem `.git`, `node_modules`, temporários, perfis ou cópia recursiva de backups. Manifesto separado dos sete arquivos da aplicação. |
| Documentação | Seis documentos solicitados e AGENTS presentes; referências locais conferidas; funcionalidades/design fundamentados no código. |
| Git | Consulta restrita ao projeto; repositório ancestral identificado; zero arquivos do projeto rastreados; sem commit, staging, reset ou limpeza. |
| Navegador/console | Não executados nesta tarefa documental. Relatórios anteriores consultados separadamente: 225 verificações aprovadas, zero falhas/erros capturados. |

**Backup anterior à implantação:** `versao_inicial`, criado a partir dos arquivos preexistentes antes de acrescentar documentação. Os novos documentos não tinham versão anterior; não constam do payload desse backup.

**Commit Git:** não existe commit desta alteração. Nenhum commit foi criado.

**Reversão:** os arquivos funcionais já permanecem no estado anterior. Para desfazer apenas a implantação do controle, após pedido explícito e backup separado do estado atual, arquive `AGENTS.md` e a documentação em vez de apagá-los indiscriminadamente; preserve os backups existentes. Para recuperar arquivos da aplicação, use [INSTRUCOES_REVERSAO.md](INSTRUCOES_REVERSAO.md). Nenhuma reversão foi executada.

## Modelo para a próxima entrada

Copie este modelo ao fim da sequência de entradas, preenchendo somente informações verificadas:

```text
Data e horário (ISO 8601 com fuso):
Identificação e título da alteração:
Solicitação do usuário / escopo autorizado:
Arquivos existentes modificados:
Arquivos adicionados ou removidos:
O que foi alterado e por quê:
Funcionalidades afetadas e impactos:
Alterações anteriores não registradas encontradas e como foram preservadas:
Testes realizados:
Resultados e limitações de verificação:
Backup anterior (ID, escopo e manifesto):
Commit Git (hash real ou "não criado"):
Como reverter esta alteração preservando as posteriores:
Pendências:
```


## PAGES-001 — 29/10/2026 — Normalização da entrada GitHub Pages (revisão do ZIP)
- Criado `sync_pages.py` para gerar/verificar `index.html` da raiz a partir de `central-demandas/index.html`.
- Criado `README_PUBLICACAO.md` e `.gitignore` da raiz.
- Conteúdo funcional de HTML/CSS/JS mantido sem alterações; a raiz já estava sincronizada no ZIP.
- Teste efetuado: `python sync_pages.py --check` passou. Não houve teste de navegador ou de PostgreSQL nesta revisão.
- Backend detectado como incompleto (`backend/src/server.js` não existe no ZIP).

## 2026-10-30T09:57:16-03:00 — LOGOS-PAGES-002 — Logos, ajustes pontuais e entrada Pages

Solicitação: aplicar a especificação anexada de atualização da LivreEscolha, preservando design e recursos aprovados, dados locais e backend. Repositório confirmado pelo plugin GitHub: `amapa1422/livre-escolha-demandas`.

Alterações: retirada dos controles/identificações de demonstração solicitados; título laranja em Plus Jakarta Sans 600; catálogo local de 291 empresas; autocompletar com teclado; vínculo opcional `clientId`; logos nos cards/detalhes; otimização local de prints; sincronização unidirecional da entrada raiz e do catálogo JS gerado do JSON. Não implementado PostgreSQL/API/autenticação.

Processamento: 295 originais preservados; 118 logos únicas (55 WebP sem perda e 63 formatos originais menores), 173 reutilizações, 1 cadastro duplicado consolidado, 3 arquivos para revisão. Detalhamento por imagem em `LOGOS_PROCESSADAS.json`.

Arquivos: frontend organizado, raiz gerada, `sync_pages.py`, `.gitignore`, `README_PUBLICACAO.md`, documentos de estado/funcionalidades/design/leitura/histórico, novos assets/catálogo, processador de logos e evidências `.qa/logos-pages/`. Lista completa em [RELATORIO_LOGOS_PAGES.md](RELATORIO_LOGOS_PAGES.md). Nenhum arquivo preexistente removido.

Estado anterior encontrado: repositório próprio (HEAD `d6c6d62`), raiz já existente, sincronizador e README de publicação sem rastreamento, alterações anteriores em estado/histórico, backend sem rastreamento e modificação de `--text` no HTML monolítico para `#f6f3f3`. Preservados; documentação antiga identificada como histórica. Backend e monolítico conferidos por SHA-256, sem modificações nesta tarefa.

Backup anterior: `2026-10-30_093340_logos-pages_a78d5ba2`, 18 arquivos com hashes/tamanhos conferidos, sem dependências/segredos/backups recursivos. Originais do ZIP em backup separado `2026-10-30_093828_originais-logos_6cefebf3`. ZIP fornecido mantido intacto.

Testes finais: 57 testes principais + 5 complementares no Chrome, zero erros capturados de console/JavaScript; abertura direta por arquivo aprovada; 514 verificações de integridade/conversão/extração/publicação; `sync_pages.py --check` aprovado; responsividade 1920/1366/768/390/320 px; capturas desktop/celular inspecionadas. Cenário de GitHub Pages exercitado em servidor local com prefixo do repositório, sem implantação na hospedagem real. Roteiro usa perfil temporário e dados sintéticos.

Commit desta alteração: **não criado**. Não houve staging, push, PR ou deploy. Pendências: confirmar duas abreviações de Comercial Agricola, obter imagem utilizável de Expo Design, publicar/revalidar hospedagem. Sem acesso a dados do perfil habitual do usuário.

Reversão: criar backup separado do estado atual, comparar com o backup preventivo acima e reverter somente os trechos desejados, preservando mudanças posteriores. Não substituir automaticamente HTML principal pelo original monolítico; seguir `INSTRUCOES_REVERSAO.md`. Nenhuma reversão executada.

## 2026-10-30T11:05:12-03:00 — BACKEND-003 — Backend PostgreSQL, autenticação e integração

Solicitação: concluir servidor ausente, autenticação, API de demandas/anexos/histórico, concorrência e tempo real, integrar a interface aprovada e executar testes sem recriar banco, excluir usuários ou publicar credenciais.

Antes das edições: lidos AGENTS e controle; examinados SQL, dependências e fontes. Backup parcial `2026-10-30_105255_backend_1b8df768`, 19 arquivos com SHA-256/tamanho conferidos e arquivos novos registrados como ausentes. Não inclui segredos, dependências ou dados de banco. Mudanças locais anteriores em front-end, monolítico, documentos, logos, publicação e backend preservadas. Configuração, conexão, scrypt e scripts de cadastro reutilizados.

Adicionados `backend/src/server.js`, `src/images.js`, testes de imagens/integração, README do backend, login HTML/CSS/JS, adaptador `central-demandas/js/api.js`, relatório e evidências `.qa/backend/`. Modificados pacote do backend, HTML/JS organizados, entrada raiz gerada, README de publicação e documentos de leitura/estado/funcionalidades/design/histórico. Lista e detalhes em [RELATORIO_BACKEND.md](RELATORIO_BACKEND.md). Nenhum arquivo preexistente removido; nenhuma dependência instalada; CSS aprovado, monolítico, SQL, `.env` e código de senhas/conexão mantidos.

Implementados Express, sessões PostgreSQL, login/logout, CSRF/Helmet/rate limit, papéis, API, histórico transacional, anexos privados e Socket.IO após commit. Tomada concorrente bloqueia linha; criação idempotente por usuário. HTTP agora usa banco; localStorage antigo preservado sem importação. Abertura por arquivo continua local. Funcionário assume para si e finaliza as próprias; administrador atribui/finaliza/exclui logicamente. Login, Sair e Histórico reutilizam identidade e componentes existentes.

Testes executados: `npm.cmd start` em backend, conexão ao PostgreSQL real, `npm.cmd test`, `node test/integration.js` e `sync_pages.py --check` com Python temporário existente. Rodada final: 16 grupos de integração aprovados em esquema temporário isolado, dois contextos independentes Chrome, sincronização de criação/atribuição/finalização, persistência, corrida 200/409, permissões, histórico, anexos e logout. CSS idêntico ao backup, geometria/estilos comparados em 1920/1366/768/390/320 px, capturas inspecionadas, zero erros JS/console. Dados públicos e hashes reais preservados. Esquema e arquivos sintéticos removidos ao final. Impedimento inicial EPERM do Chrome resolvido com execução autorizada fora do sandbox; diferença de handshake encontrada pelo navegador corrigida e retestada.

Limites: login testado com contas sintéticas; senhas reais não solicitadas/testadas/redefinidas. Primeiro acesso às contas existentes e hospedagem HTTPS externa permanecem verificações manuais. Sem implantação em GitHub Pages, commit, push ou PR. Evidências em `../.qa/backend/results.json` e capturas desktop/celular.

Reversão: criar novo backup, verificar manifesto preventivo e aplicar somente diferenças desta tarefa; arquivar arquivos novos, preservar alterações posteriores e dados de banco/navegador. Seguir `INSTRUCOES_REVERSAO.md`; nenhuma reversão executada. Pendências anteriores de revisão de logos preservadas.

## 2026-11-03T14:01:18-03:00 — SUPABASE-004 — Preparação da migração

Pedido: migrar a versão online para Supabase/Auth/Storage/Realtime e GitHub Pages, preservando design, funcionalidades, backend legado e dados. Lidos AGENTS/controle, fontes locais e `api.js` atual no GitHub. Repositório próprio, HEAD `041ed57`, árvore inicialmente limpa. Não encontradas alterações locais anteriores sem registro; inconsistências históricas de documentação preservadas e qualificadas.

Entregues módulos novos `supabase-config.js`, `supabase-config.example.js`, `supabase-client.js`, consulta `supabase/inspecionar.sql` e `scripts/test-supabase-client.cjs`. Modificados somente README_PUBLICACAO, ESTADO_ATUAL e este histórico; criado RELATORIO_SUPABASE. Nenhum arquivo removido. SDK 2.118.0 configurado sob demanda, URLs com prefixo do repositório, chave pública validada e cliente único. **Não ativado nos HTMLs; migração ainda incompleta.** Runtime e dados preservados.

Impedimento: não há Project URL/publishable key nem esquema/políticas/RPCs do Supabase disponíveis. `.env` possui somente variáveis Node/PostgreSQL (nomes inspecionados sem exibir valores). SQL local não representa o banco remoto. Solicitados os dados públicos e o SQL real ao usuário. Inspeção somente leitura preparada, não executada. Nenhuma migração adicional criada/aplicada ou conexão de banco realizada.

Verificação: cinco testes isolados aprovados com `node --test --test-isolation=none`; sintaxe dos três módulos aprovada; `sync_pages.py --check` aprovado; CSS/app/api/login/backend/raiz sem diferenças Git. Tentativa inicial de teste com isolamento encontrou spawn EPERM, resolvido executando sem isolamento. Não executados testes operacionais no Supabase ou navegador; SDK foi simulado. Relatório detalha pendências, configuração e procedimentos futuros de publicação/cadastro.

Backup anterior: `2026-11-03_supabase-preparacao_4567da8e`, três documentos com tamanhos/SHA-256 conferidos e seis arquivos novos registrados como ausentes. Commit não criado; sem push/PR/deploy. Reverter somente os trechos desta etapa após novo backup e comparação, arquivando arquivos novos e preservando mudanças posteriores, conforme INSTRUCOES_REVERSAO. Nenhuma reversão executada.

## 2026-11-03T14:36:01-03:00 — SUPABASE-005 — Configuração pública e contrato RPC

Continuação autorizada: usuário forneceu URL/publishable key, assinaturas RPC e caminho privado de Storage; reafirmou preservação do design e proibição de migração local no Supabase. Configuração pública preenchida. Criados `supabase-operations.js` e `test-supabase-operations.cjs`: `action/remove` chamam somente as três RPCs confirmadas, com IDs bigint decimais preservados e UUID validado. Não ativados nos HTMLs. Atualizados README, estado, relatório e histórico; nenhum arquivo removido.

Consultas somente leitura ao OpenAPI falharam por DNS nas tentativas normal e fora do sandbox. Checagem externa adicional: supabase.com resolve; nxqqcddbhezuvhpemge.supabase.co não resolve. Não houve resposta HTTP, inspeção real de esquema, autenticação ou alteração de dados. Solicitadas URL confirmada e definições das colunas/políticas, ainda ausentes. Diferenças da interface e campos pendentes documentados no relatório. Não inventado esquema nem executado SQL local.

Verificações: oito testes isolados aprovados (cinco cliente, três RPC), sintaxe da configuração/operações aprovada, sync_pages.py --check aprovado; CSS/app/API/login/backend/HTML raiz sem mudanças. Testes com mocks não comprovam autorização ou concorrência reais. Migração continua pendente, sem deploy/commit/push.

Backup `2026-11-03_supabase-config-rpc_732042f3`: cinco arquivos anteriores com tamanho/SHA-256 conferidos e novos arquivos registrados; trabalho SUPABASE-004 preservado. Reversão exige novo backup e retirada somente dos trechos desta continuação, preservando alterações posteriores, conforme INSTRUCOES_REVERSAO. Nenhuma reversão executada.

## 2026-11-03T15:14:40-03:00 — SUPABASE-006 — Integração ativa Supabase e pacote Pages

Pedido: integração definitiva conforme URL corrigida, esquema completo e segurança informados pelo proprietário; preservar design/funcionalidades/backend e fornecer SQL incremental específico para anexos. AGENTS lido integralmente; controle, implementação e GitHub consultados. Preparação anterior 004/005 não commitada preservada, sem descartar alterações. URL corrigida acessível; chave pública aceita em Auth/settings. Leitura anônima vazia de demandas recusada; OpenAPI restrito a secret key, não solicitada/utilizada.

Substituídas comunicações Express por Supabase em API/login; Auth compartilhado, perfil ativo, convite/recuperação, adaptação das colunas reais, bigint textual, criação por usuário autenticado com idempotência, três RPCs existentes, prints privados/URLs temporárias/nova RPC de registro, vínculo de catálogo por RPC restrita, histórico somente leitura, canal único Realtime com reconexão/fallback. HTMLs ativos, entrada raiz regenerada por sync_pages. CSS principal mantido; regra [hidden] adicional exclusiva no login. Backend e SQL locais preservados; snapshot dos cinco arquivos de frontend Express em backend/legacy-frontend.

Criados SQLs supabase/migrations/001_anexos_idempotencia.sql e 002_cliente_catalogo.sql, sem execução. Criados empacotador/verificador estáticos e workflow manual Pages. 133 arquivos públicos mais .nojekyll no pacote, sem backend/.env/backups/QA/monolítico. Atualizados README e controle (leitura, estado, funcionalidades, design, histórico, relatório); evidências em .qa/supabase. Lista completa em RELATORIO_SUPABASE. Nenhum arquivo preexistente removido.

Verificações: 27 testes isolados aprovados; 14 grupos Chrome aprovados, geometrias iguais ao backup em cinco larguras, capturas desktop/mobile inspecionadas, zero erros JS/console e zero requisições legadas. SDK real 2.118.0 inicializado e visitante sem sessão redirecionado corretamente. Fluxos autenticados usam serviços sintéticos; nenhuma validação real de login/RLS/concorrência/Storage/histórico/Reatime foi declarada. sync_pages.py --check, sintaxe JS e verificação do artefato aprovados; CSS principal/backend/SQL local/monolítico sem diff. Testes browser inicialmente bloqueados por EPERM resolvidos com execução autorizada; fixture/medição corrigidas e rodada final passou.

Pendências operacionais: aplicar SQLs pelo painel; desativar cadastro público (settings retornou disable_signup=false); configurar callbacks/bucket e validar contas/RLS/concorrência/duas sessões no Supabase real; publicar. Não houve execução de SQL, migração/importação de dados, conexão ao PostgreSQL local, commit, push ou deploy.

Backup anterior 2026-11-03_supabase-integracao_9a16bd72, 17 arquivos principais e suplementos de login.css/.gitignore (19 existentes no total), tamanho/SHA-256 conferidos antes de cada edição. Arquivos novos registrados no manifesto/inventário. Para reverter, criar backup atual, comparar e desfazer somente diferenças autorizadas preservando trabalho posterior; não reverter banco nem substituir tudo pelo monolítico. Seguir INSTRUCOES_REVERSAO; nenhuma reversão executada.

## 2026-11-03T15:49:47-03:00 — SUPABASE-007 — Início de validação real, login recusado

Proprietário informou aplicação bem-sucedida das duas migrações e pediu validação com serviços reais, login manual e servidor exclusivamente estático, sem publicar. AGENTS/controle consultados, preparação anterior preservada. Backup documental `2026-11-03_validacao-real_e70ae429` de estado/histórico/relatório com hashes conferidos. Nenhuma mudança no design ou arquivos da aplicação.

Project URL e tipo de chave pública conferidos, Auth/settings real respondeu 200 e disable_signup=false. Servidor Python http.server iniciado em 127.0.0.1:8000 servindo .pages-build; HTML/login/CSS/configuração/API estáticos 200 e /backend/.env 404. sync_pages --check e verificador do pacote aprovados. Backend Node/PostgreSQL local não iniciado nem acessado. Nenhum teste simulado reexecutado nesta etapa.

Criado roteiro qa-supabase-real.cjs, com Chrome dedicado, autenticação manual e monitoramento sanitizado apenas de respostas de erro. Não registra e-mails/senhas/tokens nem exporta sessões. Proprietário relatou erro genérico no login; novas tentativas observadas retornaram HTTP 400 invalid_credentials em /auth/v1/token. Nenhum perfil ativo confirmado ou demanda/anexo criado no diagnóstico. Roteiro aguarda login válido para consultar fila, criar demanda identificada com print real, testar banco/RPCs/histórico e Realtime em duas abas da mesma conta, terminando com exclusão lógica somente do registro de teste. Situação dinâmica em .qa/supabase/real-results.json.

Orientado conferir conta em Authentication/Users e oferecida recuperação manual com callback local autorizado. Login válido depende da interação do proprietário. Testes autenticados de demandas, RPCs, anexos, RLS e Realtime não foram declarados aprovados. Nenhuma senha alterada ou e-mail enviado automaticamente. Sem reaplicar SQL, importar dados, publicar, commit ou push.

Adicionados VALIDACAO_REAL_SUPABASE.md, roteiro e evidências de preflight/diagnóstico; atualizados estado/relatório/histórico. Controlador inicialmente aguardou só 30 s, corrigido; janela inicial fechada antes da autenticação e substituída por Chrome independente via CDP somente em loopback. Servidor e navegador mantidos disponíveis para continuar. Para reverter documentação, criar novo backup e retirar somente os trechos desta etapa; não reverter banco ou apagar registros. Nenhuma reversão executada.

## 2026-11-03T16:00:28-03:00 — SUPABASE-008 — Login recuperado e testes reais; pendência em exclusão Realtime

Proprietário informou recuperação da senha e login bem-sucedido. AGENTS/controle consultados; janela anterior de teste havia sido fechada e foi reaberta no mesmo perfil temporário para autenticação manual. Login admin/ativo confirmado pelo roteiro real, sem coletar senha/tokens. Servidor exclusivamente estático Python mantido; nenhuma publicação.

Execução QA_SUPABASE_20261103_50eee23d: 13 verificações reais aprovadas e 1 falha. Criada somente demanda de teste 1, com PNG de 13.307 bytes no bucket privado e metadados; consulta confirmou criador/status; segunda aba recebeu criação e exibiu card; download autenticado aprovado e endpoint público recusado. RPCs assumir/finalizar/excluir responderam; estados andamento/lançada e responsabilidade conferidos; histórico antes da exclusão retornou criar/assumir/finalizar. Realtime de criação/atribuição aprovado e finalização observada em inspeção posterior. O evento de exclusão não chegou em 15 segundos; registro saiu da fila.

Inspeção autenticada posterior não viu demanda/histórico de teste. Possível filtragem RLS, ainda sem comprovação da função/políticas ou retenção física. Criada consulta somente leitura supabase/diagnosticar_exclusao_realtime.sql e solicitado seu JSON. Não alteradas permissões ou funções de banco. Corrigido apenas o indicador do roteiro: ausência da fila não comprova exclusão lógica física; passou de physicalDeletion:false presumido para databaseRetentionVerified:false em futuras execuções. Resultado original preservado com ressalva documental.

Backup antes da retomada 2026-11-03_retomada-real_a5334f79, seis arquivos anteriores com SHA-256 conferidos; preparação e evidências anteriores preservadas. Atualizados estado/relatório/documento de validação/histórico, criado SQL diagnóstico e ajustado roteiro. Nenhum arquivo de design/aplicação ou SQL existente modificado. Sem mocks, reaplicação de migrações, importação, PostgreSQL local, commit, push ou deploy. Validação de funcionários/RLS entre pessoas/concorrência permanece pendente. Reverter somente trechos desta etapa após novo backup; não reverter banco ou apagar registros automaticamente.

## 2026-11-03T16:13:26-03:00 — SUPABASE-009 — Correção preparada para exclusão Realtime sob RLS

Proprietário forneceu JSON administrativo: demanda 1 retida com exclusão lógica e auditorias criar/assumir/finalizar/excluir; função e políticas confirmam que a exclusão oculta demanda/histórico. Causa identificada: a nova linha não passa no SELECT RLS e postgres_changes não entrega o evento. Pedido explícito de corrigir sincronização preservando design/funcionalidades e sem publicar. AGENTS/controle consultados, mudanças locais anteriores preservadas.

Backup 2026-11-03_realtime-exclusao_19ce61be, 11 arquivos anteriores incluindo adaptador/artefato, roteiro/fixtures e documentos, SHA-256/tamanhos conferidos. Novo SQL 003 cria trigger privado de exclusão que envia {} em tópico privado; permite somente leitura por funcionário ativo, com restrições de leitura/envio específicas desse tópico. Não altera RPCs existentes, RLS de demandas/histórico ou dados. Solicitada aplicação pelo proprietário; nenhum SQL executado pelo agente.

API mantém canal postgres_changes e adiciona um canal privado exclusivo de invalidação com reconsulta, reconexão e cleanup. Artefato estático atualizado a partir da fonte, hashes iguais. Runner real ampliado para canal privado, aviso sem dados, card removido sem reload/filtros alterados e recusa de anônimo. Fixtures de CI adaptadas, não executadas nesta etapa. HTML/CSS/app.js/backend intocados. Atualizados README/estado/funcionalidades/relatórios/histórico; resumo do diagnóstico do proprietário salvo em .qa/supabase/exclusao-confirmada-pelo-sql.json. Nenhum arquivo removido.

Verificações: sintaxe JS aprovada após corrigir erro inicial de parêntese no runner; sync_pages --check e scanner do artefato aprovados. Nenhum serviço simulado usado em testes desta correção; reteste real depende da aplicação de 003. Resultado anterior de 13 verificações reais aprovadas/uma falha preservado. Controladores anteriores encerrados após a falha, mantendo Chrome independente para continuar. Não publicado, sem commit/push, migração de dados ou PostgreSQL local.

Reversão: criar novo backup e reverter somente diferenças desta etapa, preservando posteriores; não executar rollback SQL ou apagar dados automaticamente. Pendência: aplicar 003 e concluir teste real entre duas abas. Nenhuma reversão executada.

## 2026-11-03T16:24:00-03:00 — SUPABASE-010 — Reteste real em dois navegadores; canal privado recusado

Proprietário informou aplicação de 003 e autorizou concluir; JSON recebido corresponde ao diagnóstico antigo, sem objetos novos. AGENTS e controle consultados, alterações locais anteriores preservadas. Backup parcial 2026-11-03_dois-navegadores_dbfa9036: roteiro/estado/histórico/validação com tamanhos e SHA-256 conferidos antes de editar. Novos arquivos registrados em manifesto/suplemento.

Roteiro real ampliado para QA_OBSERVER_CDP_URL, permitindo Chrome e Edge com perfis independentes e login manual, sem copiar sessão ou coletar credenciais. Verificação de remoção de card preparada para ambos. Executado QA_SUPABASE_20261103_3f4f3aff: 15 verificações aprovadas/uma falha, demanda exclusiva de teste 2. Login admin ativo nos dois, criação/consulta, print privado 13.028 bytes/download autenticado/acesso público recusado, assumir/finalizar/histórico/excluir e eventos INSERT/atribuição aprovados. Finalização observada. Aviso privado falhou em 15 s. Inspeção posterior confirmou canal em erro/reconexão; nova conexão capturou phx_reply error Unauthorized para leitura do tópico privado. Estado joined inicial não comprova autorização duradoura. Não aprovadas sincronização de exclusão/filtros sem reload ou recusa anônima, que não chegaram ao fim do roteiro.

Criado supabase/diagnosticar_canal_privado.sql somente leitura para trigger/função/políticas/privilégios/contagem de avisos, sem dados pessoais. Solicitado JSON mínimo ao proprietário; não reexecutar migrações às cegas nem ampliar permissões. Relatório real e documentos atualizados. Sintaxe do roteiro e verificação do pacote estático (134 arquivos, zero segredos detectados/zero dependências legadas) aprovadas. Nenhum mock utilizado, mudança visual, edição da aplicação/003, publicação, SQL pelo agente, commit ou push. Servidor exclusivamente estático mantido. Reversão exige novo backup e retirada apenas dos trechos desta etapa; não reverter banco/dados nem sobrescrever alterações posteriores. Nenhuma reversão executada.

## 2026-11-03T16:25:20-03:00 — SUPABASE-011 — Objetos de 003 ausentes no banco consultado

Proprietário forneceu resultado da consulta somente leitura: função/trigger/políticas realtime null, privilégios básicos presentes, zero avisos. Explicação concreta da recusa do canal: objetos de 003 não instalados no banco consultado. Conferido arquivo incremental existente, sem alteração; orientar execução integral no projeto correto e solicitar sucesso/erro antes do reteste real. AGENTS/controle consultados, mudanças anteriores preservadas. Backup documental 2026-11-03_diagnostico-003_ac258ff6 de estado/validação/histórico, tamanhos/SHA-256 conferidos antes das edições. Novo arquivo .qa/supabase/diagnostico-003-ausente.json contém evidência identificada como fornecida pelo usuário. Nenhuma nova execução funcional, SQL pelo agente, alteração de aplicação/design/permissões, commit/push ou publicação. Para reverter documentos, fazer novo backup e retirar apenas estes trechos, preservando alterações posteriores; não reverter banco. Nenhuma reversão executada.

## 2026-11-03T16:32:00-03:00 — SUPABASE-012 — Realtime real aprovado após aplicação de 003

Proprietário confirmou execução de 003 com Success. No rows returned e pediu testes reais/revisão sem publicar. AGENTS/controle consultados; estado local anterior preservado. Backup parcial 2026-11-03_validacao-003_a14f893d de sete arquivos (roteiro e documentos), tamanho/SHA-256 conferidos antes das edições. Criado scripts/qa-supabase-final-real.cjs e novas evidências .qa/supabase, registrados no manifesto; suplemento registra a primeira rodada realtime-003-aplicada.json e captura final-real-mobile.png.

Primeiro reteste real após SQL recebeu aviso privado, mas expectativa do teste exigia payload vazio e falhou: Realtime acrescenta id UUID da mensagem. Conferido comportamento no código oficial https://github.com/supabase/realtime/pull/1385. Ajustado só roteiro para aceitar UUID técnico e proibir campos de negócio. Falha anterior preservada, sem mascarar. Nova execução QA_SUPABASE_20261103_45932042, demanda de teste 4, aprovada em 19 verificações: login admin Chrome/Edge em perfis independentes, fila/criação/consulta, print privado, RPCs assumir/finalizar/excluir, histórico antes de excluir e eventos. Aviso em 577 ms; remoção dos dois cards sem reload e com filtros/aba mantidos, conferida em 3.410 ms. Anônimo recusado no canal. Não foram usados mocks ou coletadas senhas/tokens.

Revisão final real: nove verificações aprovadas, uma pendência. Sessão restaurada, dois canais únicos joined, excluídas 1-4 invisíveis, visitante redirecionado, cinco tabelas sem leitura anônima, logout Edge/zero canais e Chrome independente, responsividade quatro larguras, zero erros JS/chamadas legadas na página revisada. Captura mobile inspecionada. Auth/settings ainda disable_signup=false, solicitada desativação pelo proprietário. Não validar cadastro via criação de conta arbitrária. Funcionário/inativo, concorrência entre funcionários, novos convites e callbacks de produção permanecem sem teste. Auditoria administrativa pós-exclusão comprovada anteriormente só para demanda 1.

Sintaxe dos dois roteiros, scanner estático 134 arquivos sem padrões secretos/dependências legadas e sync_pages aprovados. CSS/API fonte e artefato com hashes iguais. Nenhuma alteração da aplicação, SQL, design ou backend nesta etapa; somente roteiros e documentos (estado, funcionalidades, relatório, validação, README, histórico). Sem commit/push/publicação ou SQL pelo agente. Edge deslogado pelo teste, Chrome mantido. Reversão: criar backup atual separado e desfazer apenas diferenças desta etapa, preservando posteriores; não reverter SQL/dados. Nenhuma reversão executada.

## 2026-11-03T16:36:00-03:00 — SUPABASE-013 — Signup desativado confirmado, permissões e Realtime reais

Proprietário informou desativação de Allow new users to sign up e solicitou reconsulta/testes sem publicação/design alterado. AGENTS e controle consultados, mudanças anteriores preservadas. Reconsulta real Auth/settings HTTP 200 com disable_signup=true nos navegadores. Chrome ativo/admin com dois canais joined, Edge deslogado na etapa anterior. Consulta agregada de papel/ativo expôs apenas um admin ativo visível; pedido login de funcionário no Edge para testes entre papéis, sem coletar credenciais ou criar contas/alterar papéis.

Backup parcial 2026-11-03_auth-permissoes_bdc4bec8 de estado/validação/histórico/README, SHA-256/tamanho conferidos antes de editar. Criado scripts/qa-supabase-security-real.cjs e evidência .qa/supabase/security-real.json, registrados no manifesto. Onze verificações reais aprovadas, zero falhas, sem serviços simulados. Somente demanda de teste 5 criada e excluída logicamente: UPDATE direto de mesmo valor negado ao admin e INSERT arbitrário de histórico negado (42501), duas chamadas simultâneas de assumir com exatamente uma vencedora, finalizar/excluir por RPC e aviso privado recebido entre duas abas da mesma conta admin. Visitante sem sessão redirecionado, leitura das cinco tabelas e RPC excluir recusadas, sessão e dois canais preservados, zero erros JS capturados. Não confundir concorrência mesma conta com usuários diferentes. Upload e dois navegadores não reexecutados nesta etapa, aprovados anteriormente em 012.

Scanner estático 134 arquivos aprovado; sintaxe do novo roteiro aprovada. Aplicação, SQL, design e permissões não alterados; nenhuma conta criada, SQL administrativo executado, commit/push/publicação. Atualizados quatro documentos; signup não é mais pendência. Dependências restantes: contas reais de funcionário/inativo e convites/callbacks de produção. Reversão documental exige backup atual separado e retirada somente destes trechos, preservando posteriores; não reverter banco. Nenhuma reversão executada.

## 2026-11-03T17:29:22.0255541-03:00 — SUPABASE-014 — Roteiro real entre admin/funcionário aguardando login dedicado

Proprietário autorizou testes reais de funcionário/exclusão/concorrência/Realtime sem publicar/design alterado. AGENTS e controle consultados, estado anterior preservado. Conexões de Chrome/Edge dedicados estavam fechadas; reabertos mesmos perfis temporários. Chrome recuperou admin; Edge dedicado estava em login e precisou ser reaberto novamente após encerramento. Solicitada autenticação manual do funcionário na janela dedicada, sem senha/token no chat nem acesso a perfis pessoais.

Backup parcial 2026-11-03_admin-funcionario_e173cf86 de quatro documentos, tamanho/SHA-256 conferidos. Criado scripts/qa-supabase-roles-real.cjs; prepara duas demandas próprias de teste para criação/print por funcionário, recusas de excluir/UPDATE/atribuição a outro/auditoria arbitrária, assumir/finalizar próprios, disputa entre contas distintas, status/cards e aviso privado sincronizados entre papéis com filtros/sentinelas preservados. Não iniciar escritas antes de confirmar admin/funcionário ativos e distintos. Roteiro em execução aguardando login; roles-real.json waiting-for-employee, checks/testIds vazios na conferência. Nenhum teste entre papéis declarado aprovado. Falha inicial de conexão preservada em roles-real-launch.json.

Sintaxe e scanner 134 arquivos aprovados. Atualizados estado/validação/README/histórico; nenhuma alteração em aplicação, design, SQL, permissões ou contas, mock, commit/push/publicação. Continuação depende apenas de login manual do funcionário no Edge dedicado. Reversão documental exige novo backup e retirada somente destes trechos, preservando posteriores; não reverter banco. Nenhuma reversão executada.

## 2026-11-03T17:38:32.9396780-03:00 — SUPABASE-015 — Rodada real admin/funcionário aprovada

Proprietário confirmou entrada do funcionário na aba dedicada e depois login administrativo. AGENTS/controle consultados, estado anterior preservado. Edge confirmado funcionario ativo; Chrome inicialmente sem sessão, depois login retornou funcionario; encerrada apenas essa sessão e solicitada conta admin correta. Navegadores dedicados foram encerrados novamente, interrompendo roteiro antes de criar dados. Reabertos mesmos perfis, recuperaram admin/funcionario e identidades distintas. Nenhuma senha/token coletado ou sessão exportada. Probe preliminar employee-preflight.json: excluir ID inexistente -1 recusado Apenas administradores podem excluir, sem escrita. Falha anterior preservada em roles-real-browser-closed.json.

Rodada QA_ROLES_99d04fab: 17 verificações reais aprovadas, zero falhas. Somente demandas de teste 8 e 9 criadas pelo roteiro e ambas excluídas logicamente ao fim. Funcionário criou 8 com PNG privado de 1.748 bytes, card visível no admin/Edge e download autenticado pelo admin. Funcionário impedido de excluir 8/9, atualizar diretamente, atribuir a outro e criar auditoria arbitrária; assumiu/finalizou própria e leu histórico. Atualizações de status verificadas no Chrome. Disputa simultânea entre contas distintas na 9: funcionário venceu, admin recusado, responsável correspondente e um único sucesso. Admin finalizou demanda do funcionário. Exclusão admin gerou aviso privado recebido, cards removidos dos dois sem reload e filtros/aba preservados em 2.011 e 2.262 ms. Consultas dos dois ocultam excluídas. Zero erros JS/chamadas legadas capturados. Sintaxe e scanner 134 arquivos aprovados.

Backup parcial 2026-11-03_validacao-papeis_b871f01e de quatro documentos com tamanho/SHA-256 conferidos; atualizados estado/validação/README/histórico. Roteiro da etapa 014 não modificado nesta rodada; evidência roles-real.json e suplementos preservados. Nenhuma alteração em aplicação/design/SQL/permissões/contas, mock, commit/push ou publicação. Não verificados nesta rodada: conta inativa, funcionário finalizando caso alheio, novos convites/recuperação e callbacks/produção. Retenção/auditoria após exclusão de 8/9 não consultadas administrativamente. Reversão documental exige backup atual separado e retirada só destes trechos, preservando posteriores; não reverter banco. Nenhuma reversão executada.

## 2026-11-03T17:55:13.4492715-03:00 — SUPABASE-016 — Preparação final e verificações antes de publicar

Usuário pediu inativo/finalização alheia/callbacks/workflow/credenciais e preparação sem publicação automática. AGENTS/controle consultados; trabalho anterior preservado. Backup principal 2026-11-03_pre-publicacao_15cbb2d3 de seis arquivos, tamanho/SHA-256 conferidos; suplemento protege roteiro recém-criado antes de corrigir espera. Nenhum agente auxiliar, SQL administrativo ou mensagem externa enviado.

Funcionário impedido por RPC de finalizar demanda atribuída ao admin; estado andamento/responsável preservados. Primeira espera de inatividade avançou antes da ação manual: rodada inválida preservada, não prova falha da RLS. IDs 10/11 excluídos logicamente. Corrigido roteiro com leitura explícita ativo=false e confirmação antes do teste, nova rodada final com 12/13 aguarda teste-inativo.sql; restaurar-funcionario.sql específico preparado, aguardando proprietário. Modificam somente ativo do funcionário identificado e validam papel, sem tocar admin/permissões. Roteiro usa SDK/sessão real do Edge sem exportar tokens e aguarda restauração antes de limpar próprios registros.

Criados verify-release.py, qa-supabase-release-real.cjs, qa-pages-prefix-real.cjs, SQLs específicos e PUBLICACAO_FINAL.md. Workflow recebeu input boolean confirmar_publicacao default false, guarda main e scanner; aprovado actionlint 1.7.12 oficial com checksum validado. Seis verificações reais de prefixo/callbacks inválidos/recursos aprovadas em preview estático local com SDK real. Callbacks válidos/allowlist real dependem dos valores solicitados do painel; nenhum e-mail enviado ou site publicado. Scanner auditou 149 arquivos selecionados, rastreados/novos/índice sem padrões reais ou correspondências aos dois valores privados locais lidos apenas em memória. Exceção exata para fixture falso de rejeição, sem rodar testes simulados. .env não rastreado; busca nominal em histórico não encontrou .env/pem/key. Scanner não equivale a auditoria integral de histórico/credenciais desconhecidas. Build 134 arquivos aprovado, .release/ ignorada, manifestos/comandos preparados.

Atualizados .gitignore/workflow/README/estado/validação/histórico, aplicação/design/CSS/backend preservados. Nenhuma permissão nova, conta criada, staging, commit, push, Actions ou publicação. Pendências antes de liberar: inatividade/restauração e configuração real dos callbacks; não afirmar todos os testes passados. Reversão exige backup atual separado e desfazer apenas diferenças desta etapa preservando posteriores; não reverter banco/dados. Nenhuma reversão executada.

## 2026-11-04T08:53:10.2476572-03:00 — SUPABASE-017 — Revisão final sem alterações funcionais

Retomada solicitada para revisar pendências/configuração/workflow/Git/última validação, sem refazer integração ou publicar. AGENTS/controle/evidências consultados. Backup 2026-11-04_revisao-final_e3f42b1f de cinco documentos, SHA-256/tamanho conferidos. Os 17 testes entre papéis continuam aprovados; inativo não concluído (release-real-final.json waiting-for-deactivation), finalização indevida já recusada. Tentativa inválida anterior não é prova de RLS falha. Sessões CDP indisponíveis; nenhum novo teste autenticado de funcionário/inativo executado. Solicitados estado da inativação/restauração e URLs/templates reais do painel; conferir cleanup QA 12/13 antes de retomar.

Executados agora: Auth/settings real 200 aceitando configuração pública e disable_signup=true; sync_pages; sintaxe JS; scanner de 149 fontes/rastreados/novos/índice, sem padrões reais ou matches aos dois valores privados locais comparados em memória; actionlint 1.7.12 aprovado; build estático novo de 134 arquivos aprovado; seis verificações Chrome headless isolado/SDK real sob prefixo com proteção/URLs/callback inválido/zero erros JS. Ferramentas temporárias haviam sido removidas e foram recuperadas via uv/Python 3.13.12 e actionlint oficial com checksum, sem dependências da aplicação alteradas. Sem mocks ou e-mail enviado. Raiz/app/login de recuperação públicos 200, HTML não referencia novos módulos Supabase: não comprova implantação da versão nova nem allowlist/templates. Publicação por GitHub Actions exige conferência do painel; nenhuma execução remota de CI realizada.

Atualizados só README/estado/validação/histórico/PUBLICACAO_FINAL e evidências review-20261104.json/review-20261104-prefix.json. Fonte funcional/SQL/workflow/design intocados nesta revisão; CSS idêntico ao artefato e sem diff. Manifesto atualizado para revisão de commit; índice permaneceu vazio, branch main/HEAD041ed57, sem staging/commit/push/Actions/publicação. Pendências: concluir inativo/restauração/limpeza QA, confirmar Site URL/Redirect URLs/templates, conferir origem Pages GitHub Actions e obter autorização de publicação. Teste válido de e-mail na nova versão só após deploy aprovado. Não declarar todos os testes concluídos. Reversão documental requer novo backup e retirada só destes trechos preservando posteriores; não reverter banco. Nenhuma reversão executada.

Complemento SUPABASE-017: git add --dry-run da seleção aprovado (28 entradas alteradas entre 149 caminhos selecionados), sem staging efetivo; índice continuou vazio. A primeira tentativa em sandbox não conseguiu criar index.lock; execução autorizada fora do sandbox confirmou a seleção, sem editar índice/commit/push. git diff --check aprovado; avisos de normalização LF/CRLF apenas informativos, nenhum arquivo funcional editado. Manifesto de fontes atualizado após documentação.

## 2026-11-04T09:23:43.8169234-03:00 — SUPABASE-018 — Inatividade/restauração manual aprovada

Proprietário confirmou teste manual real completo: funcionário inativo teve acesso bloqueado, admin permaneceu com acesso, SQL restaurou perfil, funcionário voltou ao painel no Edge e ativo retornou true. Captura da consulta específica confirma UUID previamente usado/papel funcionario/ativo=true. AGENTS/controle consultados, backup 2026-11-04_inativo-aprovado_4398a9de de cinco documentos com tamanho/SHA-256 conferidos. Criada evidência inativo-manual-20261104.json, explicitamente fornecida pelo proprietário, não execução automatizada do agente. Relatório antigo mantido sem sobrescrita. Nenhuma nova inativação ou alteração de outra conta necessária/executada.

Atualizados README/estado/validação/PUBLICACAO_FINAL/histórico. Bloqueio/restauração pela interface aprovado; não inferir cobertura de RLS/RPC/Storage sob JWT preservado de perfil inativo. Aplicação/design/SQL/workflow intocados, sem mocks, novas demandas, alteração de contas, staging/commit/push/Actions/publicação. Fonte pública/artefato/workflow já aprovados na revisão 017; manifesto de fontes atualizado após documentação. Continuam pendentes valores atuais de Site URL/Redirect URLs/templates e origem Pages GitHub Actions, solicitados ao usuário. Limpeza QA 12/13 não confirmada pela captura, pendência operacional separada. Fluxo válido de e-mail na nova versão só depois de deploy autorizado.

Reversão documental: fazer novo backup e retirar apenas trechos desta etapa, preservando posteriores; não reverter perfil/banco/dados. Nenhuma reversão executada.

## 2026-11-04T09:30:09.3865700-03:00 — SUPABASE-019 — Configuração de produção recebida e ações finais definidas

Proprietário informou Site URL oficial, Redirect URL raiz seguido de ** na mensagem, templates padrão sem Source inspecionado e Pages Deploy from a branch; pediu revisão antes de publicar, preservando design. AGENTS/controle consultados, backup 2026-11-04_config-producao_eb403d76 de cinco documentos com tamanho/SHA-256 conferidos. Criada evidência config-producao-20261104.json com fonte usuário e interpretação explícita do glob, sem inferir acesso ao painel.

Site URL correto; se padrão literal /livre-escolha-demandas/**, cobre callbacks; recomendar URLs exatas de login/recovery/invite. Templates padrão podem ser mantidos, sem alegar inspeção do Source ou validar links de e-mail não testados. Fontes oficiais consultadas: Supabase redirects/templates/SMTP e GitHub Pages publishing-source. Origem Pages deve mudar para GitHub Actions antes do push; branch publishing pode publicar automaticamente. Workflow segue manual/main/confirmar_publicacao=true. SMTP próprio necessário para convites/recuperação dos funcionários em produção por restrição do serviço padrão; login por senha existente não depende dessa entrega. Não solicitar credenciais SMTP nem editar/enviar e-mail automaticamente.

Revalidados actionlint/scanner/artefato com sucesso, 149 fontes/134 públicos/zero padrões reais/matches privados. Atualizados README/estado/validação/PUBLICACAO_FINAL/histórico; fonte funcional/design/SQL/workflow intocados. Inatividade/restauração manual aprovada e 17 testes entre papéis preservados; QA12/13 limpeza ainda não comprovada, operacional. Nenhum mock, conta alterada, staging, commit/push, configuração remota ou publicação. Guia inclui ações e comandos condicionados à confirmação do proprietário. Reversão documental exige novo backup e retirar apenas trechos desta etapa preservando posteriores; não reverter banco. Nenhuma reversão executada.

## 2026-11-04T11:10:31.6989372-03:00 — SUPABASE-020 — Publicação autorizada executada, teste autenticado aguardando usuário

Autorização explícita do proprietário para commit/push/workflow/testes no site, condicionada a Pages Source GitHub Actions. AGENTS/controle consultados; backup 2026-11-04_publicacao_625e464b de 156 fontes/controle, tamanho/SHA-256 conferidos, mais suplemento protegendo roteiro QA real antes de adaptar URL/guards/zoom. API autenticada confirmou build_type=workflow, sem mudar configuração remota. Credencial GitHub obtida normalmente pelo Git Credential Manager apenas em memória; nenhum token em arquivos/saídas. Conector fetch GitHub consultou repositório, mas não Pages/dispatch; helper local QA usado para operações autorizadas da API, fora do commit.

Fetch confirmou main local/remota em 041ed578ad215e531a45c0bafe6d8f7747d2ecf2. 27 testes isolados exigidos pelo workflow aprovados, scanner/sync/actionlint/pacote de 134 arquivos aprovados. Somente caminhos do manifesto auditado foram colocados no índice; scanner de índice e diff --check aprovados. Commit 4f96fa2703f1d0b105f95067ffa68fc8699059c4 (28 arquivos alterados/novos) criado e enviado sem force à main. Workflow manual com confirmar_publicacao=true disparado após conferir SHA remoto e Source. Run 41843292760 success, todas etapas aprovadas. URL https://amapa1422.github.io/livre-escolha-demandas/ publicada.

Produção: 133 recursos HTTP200 correspondem ao pacote, textos comparados normalizando LF/CRLF e binários byte a byte; backend/.env, backend/server, SQL, documentação privada e .git/config 404. Seis verificações anônimas reais aprovadas (página protegida, URLs, cinco tabelas negando SELECT, invite/recovery sem sessão recusados, zero erros JS). Chrome/Edge dedicados abertos no domínio real, títulos identificados e solicitado login admin/funcionário sem senha no chat. Roteiro aguardando usuário, sem nova demanda criada até esta atualização; não afirmar testes autenticados dessa rodada concluídos. QA real recebeu baseURL/guards/zoom, sem alteração da aplicação/design/SQL/permissões. Evidências deploy-20261104.json/published-static-20261104.json/published-browser-20261104.json/production-real-20261104.json, fora do pacote. Documentação de resultado preparada em RELATORIO_PUBLICACAO, estado/validação/README/PUBLICACAO_FINAL atualizados; controles aprovados serão commitados separadamente. Nenhuma nova conta ou e-mail enviado. SMTP/entrega de e-mail e limpeza QA12/13 ainda dependem de conferência. Backup/reversão exige snapshot atual e revisão de commit, sem rollback automático do banco; nenhuma reversão executada.

## 2026-11-04T15:05:34.377Z (America/Sao_Paulo, UTC-03:00) ? SUPABASE-021 ? Encerramento solicitado

## Encerrado ? SUPABASE-021 ? 04/11/2026

Etapa de desenvolvimento encerrada por solicita??o do propriet?rio. Site publicado em https://amapa1422.github.io/livre-escolha-demandas/; Source GitHub Actions confirmado novamente, run 41843292760 success e vers?o de aplica??o 4f96fa2703f1d0b105f95067ffa68fc8699059c4. Nova confer?ncia HTTP: 133 recursos correspondentes ao pacote final, zero diverg?ncias; .env/.git/SQL privados retornam 404. Main local/remota alinhadas antes do fechamento documental (59496b9). Aplica??o, design e funcionalidades intocados.

Aprovados anteriormente: 17 testes reais com Supabase entre admin/funcion?rio em ambiente local (permiss?es, concorr?ncia, Storage e Realtime); finaliza??o de demanda alheia recusada; inativa??o/restaura??o manual aprovada pelo propriet?rio. 27 testes isolados de CI e seis verifica??es an?nimas reais de produ??o aprovados. Propriet?rio confirmou acesso em produ??o com admin/Chrome e funcion?rio/Edge; registrar como confirma??o manual dele. Automa??o em produ??o comprovou somente login/perfil admin ativo e consulta da fila antes de parar, sem criar demanda (testDemandId=null). Houve tentativas anteriores invalid_credentials, seguidas de login admin bem-sucedido; n?o classificar a rodada inteira como aprovada.

Por decis?o expl?cita do propriet?rio, roteiros interativos encerrados sem fechar seus navegadores e sem novos pedidos de login. N?o foram conclu?dos em produ??o pelo agente: cria??o, upload/zoom, RPCs/permiss?es entre pap?is e Realtime entre navegadores. Convite/recupera??o por e-mail v?lido e SMTP pr?prio seguem sem comprova??o. RLS/RPC/Storage sob JWT preservado de usu?rio inativo n?o foram testados diretamente. Confer?ncia/limpeza dos registros QA antigos 12/13 adiada, sem alterar banco no encerramento. Essas limita??es ficam para acompanhamento futuro; nenhum novo problema cr?tico comprovado nesta revis?o.

Arquivos locais n?o rastreados s?o roteiros/evid?ncias QA, consultas de diagn?stico/testes espec?ficos e snapshot backend/legacy-frontend; n?o necess?rios ? execu??o do site e n?o inclu?dos automaticamente no Git. Nenhuma altera??o funcional rastreada pendente. Documenta??o deste encerramento ser? enviada em commit separado, sem novo deploy. Backup parcial verificado: 2026-11-04_encerramento_01533f5f. Revers?o somente documental exige novo backup e retirada dos trechos 021, preservando altera??es posteriores; nenhuma revers?o de banco ou publica??o executada.


Arquivos: README_PUBLICACAO.md, _CONTROLE_PROJETO/LEIA_PRIMEIRO.md, _CONTROLE_PROJETO/ESTADO_ATUAL.md, _CONTROLE_PROJETO/HISTORICO_ALTERACOES.md, _CONTROLE_PROJETO/RELATORIO_PUBLICACAO.md, _CONTROLE_PROJETO/VALIDACAO_REAL_SUPABASE.md, _CONTROLE_PROJETO/PUBLICACAO_FINAL.md. Documenta??o validada; evid?ncias antigas preservadas sem reclassificar testes n?o conclu?dos. Nenhum teste interativo, novo deploy, conta ou registro de neg?cio alterado nesta etapa. Commit anterior documental real 59496b9247868c88be77d688875ae309d4bcaf66; commit funcional publicado 4f96fa2703f1d0b105f95067ffa68fc8699059c4.
