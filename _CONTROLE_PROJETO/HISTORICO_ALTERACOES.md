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
