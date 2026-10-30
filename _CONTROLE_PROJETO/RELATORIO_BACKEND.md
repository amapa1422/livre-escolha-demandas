# BACKEND-003 — conclusão da implementação PostgreSQL

Data: 30/10/2026, America/Sao_Paulo. Fonte funcional: `central-demandas/`; servidor: `backend/src/server.js`.

## Preservação

Lidos AGENTS e os documentos de leitura, estado, funcionalidades, design, histórico e reversão. Confirmado repositório próprio e remoto `amapa1422/livre-escolha-demandas`. Existiam alterações locais anteriores no front-end, HTML original, documentação e arquivos ainda não rastreados de backend/publicação/logos. Foram preservadas. O backup anterior de logos inventariava o backend; os arquivos de configuração, conexão, senha e cadastro existentes foram reutilizados. O erro atual era causado pela ausência de `src/server.js`.

Backup preventivo **`2026-10-30_105255_backend_1b8df768`**, criado em `2026-10-30T10:52:55-03:00`, com 19 arquivos, caminhos relativos, tamanhos e SHA-256 conferidos antes das edições. Manifesto em `backups/2026-10-30_105255_backend_1b8df768/MANIFESTO_SHA256.json`. Escopo parcial: fontes do front-end, configuração/código existente do backend, pacote/lock e documentos que poderiam ser atualizados. Arquivos novos identificados como ausentes. Não inclui `.env`, dados PostgreSQL, dependências, perfis ou backups recursivos.

Nenhum banco/tabela de produção recriado; nenhuma migração executada. Sete tabelas reais inspecionadas, tipos e constraints conferidos contra SQL existente. Cinco usuários existentes identificados apenas por contagem/papel: um admin e quatro funcionários. Nenhum nome, e-mail, senha ou hash real publicado. Dados das tabelas públicas `usuarios`, `demandas`, `clientes`, `anexos` e `historico` comparados em memória antes/depois dos testes, sem diferença.

## Entrega e arquivos

Adicionados: `backend/src/server.js`, `backend/src/images.js`, `backend/test/images.test.js`, `backend/test/integration.js`, `backend/README.md`, `central-demandas/login.html`, `central-demandas/css/login.css`, `central-demandas/js/login.js`, `central-demandas/js/api.js`, este relatório e evidências `.qa/backend/`.

Modificados nesta tarefa: `backend/package.json` (testes executáveis no ambiente e remoção de dois comandos que apontavam para scripts inexistentes), `central-demandas/index.html`, `central-demandas/js/app.js`, `index.html` gerado, `README_PUBLICACAO.md`, `_CONTROLE_PROJETO/LEIA_PRIMEIRO.md`, `ESTADO_ATUAL.md`, `FUNCIONALIDADES.md`, `DESIGN_APROVADO.md`, `HISTORICO_ALTERACOES.md`.

Nenhum arquivo preexistente removido. Preservados byte a byte CSS aprovado, catálogo/logos, configuração existente, pool, funções de senha, scripts SQL/usuários, `.env`, lock de dependências e HTML monolítico. Não foram instaladas dependências.

Implementados Express, tratamento de erros sem vazamento de credenciais, startup com verificação PostgreSQL, encerramento de conexões, sessões PostgreSQL, login/logout/consulta de sessão, CSRF, Helmet/CSP, rate limit e permissões. API cobre criação/lista/detalhes, assumir/finalizar/excluir logicamente, histórico e anexos privados. Assumir é transacional com bloqueio de linha; histórico e alterações de estado são atômicos. Criação tem chave idempotente por usuário. Socket.IO revalida sessão, publica após commit e atualiza as outras sessões.

Impactos autorizados: HTTP passa a usar PostgreSQL; dados antigos de localStorage ficam preservados sem importação automática. Abertura por arquivo continua local. Sem API em HTTP, exibe erro em vez de gravar em outro armazenamento. Responsável passa a ser conta ativa, funcionário assume para si; admin atribui. Finalização exige responsável/admin; exclusão exige admin e mantém histórico. Incluídos login, Sair e Histórico com os componentes existentes. O CSS/layout aprovado não foi redesenhado.

## Testes executados

| Verificação | Resultado |
| --- | --- |
| `npm.cmd start` em backend | Servidor iniciou em porta 3000, PostgreSQL conectado |
| SQL real | Sete tabelas e colunas compatíveis; banco existente preservado |
| `npm.cmd test` | Passou: PNG/JPEG/WebP válidos, falsos/truncados/grandes rejeitados |
| API/autenticação | Admin e funcionários sintéticos, rotação de sessão, senha inválida, CSRF/origem, proteção de rotas/arquivos |
| Persistência | PostgreSQL e recarga de navegador; chave idempotente concorrente sem duplicação |
| Concorrência | Duas tomadas simultâneas: exatamente um 200 e um 409 |
| Permissões | Funcionário recebe somente sua conta na lista, não finaliza demanda alheia e não exclui; admin exclui logicamente |
| Histórico | Criar, assumir, finalizar e excluir, na ordem, com antes/depois e ator |
| Anexos | Data URL e multipart, limite, validação real, acesso privado, um print por demanda |
| Socket.IO | Dois clientes e dois contextos Chrome sincronizados; visitante recusado e logout desconecta |
| Navegador | Criar, assumir, finalizar, detalhes, print, zoom, histórico, filtros, logo, sidebar, logout |
| Design | CSS idêntico ao backup; geometria e estilos de componentes comparados a snapshot em 1920/1366/768/390/320 px; sem overflow horizontal |
| Console | Zero erros capturados de JavaScript/console na rodada final |
| Preservação | Dados públicos e hashes de usuários reais idênticos antes/depois |
| Geração | `sync_pages.py --check` passou usando Python temporário existente; entradas e catálogo sincronizados |

Integração final: **16 grupos aprovados**, usando esquema temporário `qa_backend_<uuid>` no banco existente. Somente esse esquema de teste e seus arquivos sintéticos foram removidos. As tabelas de `public` não foram alteradas. Evidências: `../.qa/backend/results.json`, `desktop-1366.png`, `desktop-390.png`; capturas desktop/celular também inspecionadas visualmente.

Na primeira tentativa, o isolamento de subprocessos do sandbox impediu o runner de testes/Chrome (`EPERM`). O teste de imagens passou com `--test-isolation=none`; o Chrome foi executado com a permissão de execução externa ao sandbox fornecida pela revisão automática. A primeira rodada de navegador encontrou o handshake GET sem Origin e levou à correção da validação Socket.IO (Host/Sec-Fetch-Site + sessão/CSRF). Outro ajuste foi no roteiro de zoom: clicar no botão sobreposto da interface, que intercepta o clique no centro da imagem pequena. Rodada final completa aprovada.

## Limites e uso

Logins foram executados com contas sintéticas, usando o mesmo scrypt/papéis. Não se conhece nem foi solicitada a senha de nenhuma conta real; primeiro acesso com as contas existentes permanece uma verificação manual. Não foram testados navegadores físicos de outras máquinas, HTTPS/proxy de produção, restauração de backup do banco ou hospedagem externa. Sincronização validada em dois contextos independentes do Chrome, sem alegar validação em dois produtos de navegador diferentes.

Não houve commit, push, PR ou deploy. O GitHub Pages não oferece execução Node/PostgreSQL. Iniciar por `cd backend; npm.cmd start` e abrir `http://127.0.0.1:3000`. API, regras e testes documentados em `../backend/README.md`.

Reversão: criar novo backup do estado atual, conferir o manifesto preventivo e aplicar somente as diferenças desta tarefa, preservando alterações posteriores. Arquivar arquivos novos separadamente. Não restaurar banco, excluir usuários ou substituir o HTML principal pelo monolítico. Seguir `INSTRUCOES_REVERSAO.md`. O backup é de código e documentos, sem dados de banco/navegador. Nenhuma reversão foi executada.
