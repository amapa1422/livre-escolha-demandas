# SUPABASE-006 — Integração Supabase — 03/11/2026

**SUPABASE-012 — situação vigente:** 003 aplicada pelo proprietário e exclusão Realtime real aprovada em Chrome e Edge independentes: aviso privado 577 ms, remoção nos dois sem reload e filtros preservados; rodada principal 19/19. Revisão final 9 aprovadas/1 pendência: Auth/settings mantém cadastro público habilitado. Exige desativação antes de publicar, além de validação de funcionário/inativo/concorrência entre pessoas e callbacks de produção. Sessão, logout, recusa anônima nas cinco tabelas/tópico, privacidade do print e responsividade aprovados nos escopos descritos em [VALIDACAO_REAL_SUPABASE.md](VALIDACAO_REAL_SUPABASE.md). Sem alteração da aplicação/SQL/design e sem publicação nesta etapa. As pendências antigas de ausência de 003/evento perdido abaixo são históricas.

**SUPABASE-009:** diagnóstico SQL fornecido confirma que demanda 1 e quatro auditorias foram preservadas; RLS oculta a linha excluída e impede seu postgres_changes. Preparados SQL incremental 003 e canal privado de aviso vazio, mantendo políticas de negócio e design. Código/artefato atualizados; aplicação de 003 e teste real final pendentes. Consulte [VALIDACAO_REAL_SUPABASE.md](VALIDACAO_REAL_SUPABASE.md). Sem publicação ou novos privilégios de escrita para o navegador.

**SUPABASE-008 — continuação real:** recuperação feita pelo proprietário e login admin/ativo confirmado. Treze verificações reais aprovadas, incluindo demanda de teste 1 com print privado, consulta, três RPCs e histórico. Realtime de criação/atribuição/finalização observado; exclusão deixou de aparecer na fila, mas seu evento não chegou. Consulta administrativa de leitura preparada para distinguir RLS de remoção física. Sem mudança de permissões/publicação; detalhes atualizados em [VALIDACAO_REAL_SUPABASE.md](VALIDACAO_REAL_SUPABASE.md). Esta pendência impede afirmar validação completa do Realtime.

**Atualização SUPABASE-007 (03/11/2026):** proprietário informou execução bem-sucedida dos SQLs 001/002. Iniciada validação exclusivamente real por servidor estático Python; URL/chave pública aceitas em Auth/settings. Login manual retornou `invalid_credentials` HTTP 400; os fluxos autenticados ainda aguardam login válido. Não houve publicação ou alteração do design. Consulte [VALIDACAO_REAL_SUPABASE.md](VALIDACAO_REAL_SUPABASE.md) e o estado atualizado do roteiro em `.qa/supabase/real-results.json`. Os resultados sintéticos abaixo continuam sendo evidências somente da etapa 006.

## Entrega atual

**Integração implementada localmente; não publicada nem validada com contas reais.** A versão HTTP foi ativada nos HTMLs e agora usa Supabase Auth, PostgreSQL, Storage, Realtime e RPCs. Não utiliza endpoints Node/Express/Socket.IO. Arquitetura e contrato de colunas seguem a especificação completa enviada pelo proprietário; não foi inferido esquema do PostgreSQL local. A URL corrigida é `https://nxqqcdddbhezuvhpemge.supabase.co`.

O backend original, migrações locais, `.env`, HTML monolítico, logos e dados existentes foram preservados. Não houve conexão ao PostgreSQL local, importação de registros, execução de SQL remoto, commit, push ou deploy. O modo `file://` permanece independente, preservando as chaves e dados locais anteriores; não é fonte da versão compartilhada.

### Arquivos criados/modificados nesta integração

| Grupo | Arquivos |
| --- | --- |
| Adaptador ativo | `central-demandas/js/api.js`, `app.js`, `login.js`, `supabase-auth.js`, `supabase-client.js`, `supabase-config.js`, `supabase-operations.js` |
| Entradas | `central-demandas/index.html`, `central-demandas/login.html`, `index.html` gerado, `sync_pages.py` |
| Login | `central-demandas/css/login.css`: somente regra para ocultar `[hidden]`; `style.css` intacto |
| SQL novo | `supabase/migrations/001_anexos_idempotencia.sql`, `002_cliente_catalogo.sql` |
| Publicação | `scripts/build-pages.py`, `scripts/verify-pages.cjs`, `.github/workflows/pages.yml`, `.gitignore` |
| Testes | `scripts/test-supabase-api.cjs`, `test-supabase-auth.cjs`, fixture/runner `qa-supabase-*.cjs`; testes preparatórios do cliente/RPC reutilizados |
| Preservação | Cinco arquivos anteriores em `backend/legacy-frontend/`, com README de uso em cópia isolada |
| Documentação | README_PUBLICACAO, LEIA_PRIMEIRO, ESTADO_ATUAL, FUNCIONALIDADES, DESIGN_APROVADO, HISTORICO_ALTERACOES, este relatório e `.qa/supabase/README.md` |
| Evidências | `.qa/supabase/browser-results.json`, capturas 1366/390 px; pacote estático em `.pages-build/` ignorado pelo Git |

Os arquivos de exemplo e inspeção SQL da preparação anterior continuam disponíveis. Nenhum arquivo preexistente foi removido.

### Comportamento implementado

- Auth com login por e-mail/senha, sessão persistente/renovada, logout local, verificação do perfil ativo real, callbacks de convite/recuperação, definição/confirmação de senha e mensagens de erro. Nenhum formulário de cadastro público ou alteração de privilégios. Falha de rede permite nova tentativa, sem ser confundida com sessão expirada.
- `window.LivreEscolhaAPI` mantém `ready/user/users/list/create/action/remove/history/subscribe/logout`. Campos reais adaptados: `criado_em` para timestamp visual, `responsavel_id` para nome autorizado, `cliente_id` para vínculo/logo local e IDs `bigint` consultados com `::text`. A interface compara IDs remotos como strings, sem converter para Number. Nomes inacessíveis de responsáveis históricos aparecem como UUID, sem inventar identidade.
- Lista paginada sem corte nos primeiros 1000 registros; demandas excluídas logicamente não aparecem. Novas demandas usam exclusivamente o UUID de Auth como `criado_por`, valores permitidos do formulário e `chave_criacao`. Campos de papel/status/responsável recebidos de fora não são propagados na inserção.
- Assumir/finalizar/excluir chamam apenas as três RPCs existentes; a autorização e a exclusão lógica continuam no banco. Funcionário vê somente a si no seletor; admin vê contas ativas. Não há edição/reabertura na interface existente e não foram adicionadas RPCs para essas operações.
- Prints mantêm validação/decodificação e otimização WebP opcional da interface. Upload binário para `UID/ID/CHAVE.ext`, sem overwrite, seguido da RPC protegida de metadados. Nenhuma imagem Base64 é enviada ao PostgreSQL. URLs assinadas de 120 s são renovadas na sincronização, aceitas apenas quando emitidas pelo bucket/origem esperados. Print ausente ou sem autorização gera aviso nos detalhes, sem impedir a listagem.
- Se o cadastro da demanda for concluído e o anexo falhar, informa ID e mantém formulário/chave para retry; a mesma demanda é recuperada e o upload/registro podem ser repetidos. Não há exclusão compensatória automática nem perda do registro. Um objeto enviado pode permanecer sem metadados até a nova tentativa; não foi criada rotina de limpeza automática.
- Logos/autocompletar permanecem locais. Vínculo explícito de novo cadastro usa cliente remoto equivalente; quando não há, chama RPC restrita para obter/criar esse cliente. Sem importar catálogo em massa ou reinterpretar demandas antigas por nome.
- Histórico é somente leitura no JavaScript. Criação continua auditada pela trigger existente; demais ações, pelas RPCs existentes. Não há INSERT em histórico pelo navegador.
- Um canal Realtime de demandas; reconsulta ao conectar/reconectar, voltar à aba, voltar à internet e fallback de 45 s enquanto visível. Atualizações preservam busca/tipo/ordem/aba. O registro do anexo também atualiza timestamp/versão da demanda dentro da função protegida para emitir evento no canal já publicado. Remoção do canal no logout/saída.

### SQL incremental — aplicação manual necessária

**Nenhum dos arquivos foi executado.** Revisar no SQL Editor e aplicar na ordem:

1. **001_anexos_idempotencia.sql:** índice único parcial `(criado_por,chave_criacao)` para impedir duplicação concorrente; se já houver chaves repetidas, aborta sem excluir/consolidar registros. Cria `registrar_anexo_demanda(bigint,text,text)` com SECURITY DEFINER, search_path vazio, acesso somente authenticated, funcionário ativo, criador da demanda e caminho restrito. Confere existência, MIME e tamanho nos metadados do objeto do Storage, com limite de 1 MB. Bloqueia a linha da demanda, preserva o primeiro print e permite retry do mesmo caminho. Não concede INSERT direto em anexos ou escrita genérica em demandas/histórico/perfis.
2. **002_cliente_catalogo.sql:** `obter_cliente_catalogo(text,text)` para funcionário ativo. Aceita nome limitado e caminho local de logo validado, reutiliza cliente ativo correspondente, serializa criação por nome e cria somente quando necessário. Não atualiza clientes existentes, não concede INSERT/UPDATE genéricos e não altera perfis.

Não recria tabelas, não substitui as três RPCs já existentes nem altera suas permissões. Usa `private.funcionario_ativo()` conforme confirmado pelo proprietário, tratando resultado nulo como negação. RLS e grants completos não foram inspecionados com autenticação: as operações foram implementadas conforme os controles informados, e a falta de inserção de anexos explicitamente confirmada foi tratada por função específica. `supabase/inspecionar.sql` continua disponível para conferir definições antes da aplicação. SQL revisado estaticamente, sem teste de execução PostgreSQL nesta tarefa.

### Configuração antes do uso

1. URL corrigida e publishable key já configuradas no módulo público. Não fornecer Secret key/service_role.
2. Aplicar os dois SQLs acima. Sem o primeiro, prints não podem registrar metadados; sem o segundo, seleção de cliente ainda ausente do banco não pode criar o vínculo.
3. **Desativar cadastro público em Supabase Auth.** O endpoint público de settings respondeu `disable_signup: false`. O site não oferece cadastro, mas isso não restringe o endpoint de Auth. Não foi alterada essa configuração administrativa com a chave pública.
4. Site URL e allowlist de callbacks do subcaminho: ver [README_PUBLICACAO.md](../README_PUBLICACAO.md). Incluir login simples e versões `?mode=recovery`/`?mode=invite`. Templates padrão com ConfirmationURL são compatíveis; também há suporte a token_hash no login.
5. Conferir bucket privado, MIME/limite e políticas para o caminho UID/demanda/arquivo. Não foi possível ler a configuração privada do bucket sem autenticação; o limite usado no cliente/SQL é o 1 MB informado.
6. Pelo Dashboard Auth, convidar funcionários por e-mail, conferir perfil criado pela trigger e ajustar nome/ativo/papel somente no ambiente administrativo. Felipe admin; demais funcionários `funcionario`, sem inferir papel pelo nome/e-mail. Não usar cadastro legado Node para o Supabase.

### Testes e evidências desta execução

| Verificação | Resultado / limite |
| --- | --- |
| Unidade/contratos | **27 aprovados**, incluindo mapeamento, bigint, paginação, idempotência, payload Auth, upload/registro, falha parcial, clientes, histórico, expiração, rede, Realtime e recuperação/convite. SDK/banco simulados nesses testes |
| Chrome descartável | **14 grupos aprovados**, inclusive fluxos de criar/assumir/finalizar/excluir, prints/zoom, histórico, filtros/aba/ordenação e papéis visuais, com serviços sintéticos |
| Preservação visual | Geometria igual ao backup em 1920/1366/768/390/320 px, sem overflow. Capturas desktop/mobile inspecionadas. `css/style.css` sem diferenças |
| SDK real | 2.118.0 inicializado em navegador; visitante sem sessão redirecionado ao login. Sem login real, credenciais ou escrita |
| Console/rede de UI | Zero erros JS/console e zero requisições a `/api`/`/socket.io` na rodada final |
| Leitura remota | Auth/settings HTTP 200 com chave pública; consulta anônima vazia a demandas HTTP 401/42501, recusada. OpenAPI requereu chave secret; não solicitada/utilizada |
| Pages | `sync_pages.py --check` aprovado; build de 133 arquivos públicos + `.nojekyll`; verificador sem dependências legadas ou padrões de chaves privadas/JWT literal no pacote |
| Preservação | Backend original, SQL local, monolítico e CSS principal sem diff; `.env` ignorado pelo Git; backups conferidos |

Roteiros/resultados em `.qa/supabase/`. Problemas intermediários do runner (EPERM, medição de transição em aba de fundo, sessionStorage de about:blank) foram corrigidos no transporte/fixture; a rodada final passou. Não foram apresentados como falhas do produto ou ocultados nos resultados finais.

**Ainda não executados:** login real de admin/funcionário; desativação real de usuário; RLS/grants entre contas; duas tentativas concorrentes no banco; upload/visualização privada reais; triggers de histórico; sincronização entre dois usuários reais; reconexão de Realtime remoto e recuperação por e-mail real; execução dos SQLs e deploy hospedado. As evidências sintéticas não comprovam esses controles. Fazer essa validação após configuração, com contas/demandas de teste identificadas, sem usar dados de produção como fixtures.

### Publicação e reversão

Workflow manual `.github/workflows/pages.yml`: conferir alterações, enviar ao GitHub e mudar Pages para GitHub Actions; executar o workflow depois de configurar o Supabase. Ele verifica sincronização, executa os testes isolados, empacota e verifica apenas o front-end e publica o artefato estático. Nada foi enviado/publicado nesta execução. README contém comandos de geração, publicação e convite de novos funcionários.

Backup anterior **2026-11-03_supabase-integracao_9a16bd72**: 17 arquivos no manifesto principal e dois suplementos (`login.css`, `.gitignore`), todos com tamanho/SHA-256 conferidos antes das alterações correspondentes. Etapas anteriores 004/005 preservadas. Payload não inclui segredos, dependências ou dados de banco/navegador. Cinco arquivos Express também preservados byte a byte em `backend/legacy-frontend/`.

Para reverter: criar outro backup do estado atual, comparar com este snapshot e aplicar somente diferenças da integração desejada, preservando mudanças posteriores. Arquivar novos módulos/SQLs/CI conforme escopo; não substituir indiscriminadamente o site pelo monolítico, nem executar rollback de banco automaticamente. Seguir INSTRUCOES_REVERSAO. Nenhuma reversão executada.

Referências técnicas consultadas: [Auth e eventos](https://supabase.com/docs/reference/javascript/auth-onauthstatechange), [Storage autenticado](https://supabase.com/docs/reference/javascript/storage-from-download), [assinaturas Realtime](https://supabase.com/docs/reference/javascript/subscribe). A referência de versão do SDK e as notas preparatórias seguem no histórico abaixo.

## Histórico — SUPABASE-004/005 — preparação anterior

## Continuação SUPABASE-005 — 03/11/2026

O proprietário forneceu Project URL e publishable key. Registradas em `central-demandas/js/supabase-config.js`; são informações públicas. Nenhuma chave secret/service_role utilizada. **A URL fornecida, `https://nxqqcddbhezuvhpemge.supabase.co`, não resolveu no DNS.** Duas tentativas de consulta somente leitura ao OpenAPI `/rest/v1/` falharam antes de qualquer resposta HTTP, inclusive com execução fora do sandbox. Verificação adicional: `supabase.com` resolve; o host do projeto informado não resolve. Solicitada a confirmação da URL, sem inventar/corrigir o identificador por tentativa.

Confirmado pelo proprietário: RPCs `assumir_demanda(p_id bigint, p_responsavel uuid)`, `finalizar_demanda(p_id bigint)`, `excluir_demanda(p_id bigint)`; bucket privado e caminho `UID/ID_DA_DEMANDA/arquivo.webp`; RLS nas cinco tabelas, leitura para funcionários ativos e inserção de demandas por autenticados; publicação Realtime de demandas. As definições completas de colunas/políticas/gatilhos ainda não foram fornecidas nem verificadas pela API. Não foram feitas operações reais ou migrações no banco.

Criado `central-demandas/js/supabase-operations.js` com `action()` e `remove()` chamando exclusivamente essas RPCs e os parâmetros confirmados. Ignora propriedades extras enviadas na ação e mantém IDs bigint como texto decimal validado, sem arredondamento. Autorização e concorrência dependem das funções no banco, ainda sem validação real. Módulo continua isolado, não carregado no HTML nem no adaptador atual.

Diferenças identificadas no código atual:

| Área | Contrato atual da interface/legado | Adaptação necessária |
| --- | --- | --- |
| Identificador | `app.js` exige inteiro seguro no modo local e converte `data-id` com `Number`; Express limita ID a integer PostgreSQL | RPCs confirmadas recebem bigint; adaptar comparação/eventos na integração para não perder precisão |
| Campos visuais | `client`, `category`, `requester`, `priority`, `description`, `status`, `assignee`, `created`, `clientId`, `image` | Nomes/tipos equivalentes no Supabase ainda dependem da definição de colunas; converter datas para o formato esperado pela interface |
| Perfis | `/api/usuarios` retorna `id`, `nome`, `papel`; banco local usa `usuarios` | Supabase usa `perfis`; falta confirmar campos e vínculo ao UUID do Auth, sem promover usuário pelo navegador |
| Responsável | Interface passa `assigneeId`; Express recebe endpoint `/assumir` | RPC confirmada recebe `p_responsavel`, além de `p_id` |
| Criação | JSON inclui `chaveCriacao` UUID e print Base64 em memória | Inserir `criado_por` do Auth, conferir suporte à idempotência e enviar imagem binária ao Storage; colunas reais ainda ausentes |
| Logos | `clientId` do catálogo estático não equivale necessariamente ao UUID de `public.clientes` | Confirmar associação antes de persistir; preservar catálogo/autocompletar e não converter IDs por suposição |
| Prints | `image` aceita `/api/anexos/UUID`; metadados privados do backend local | Upload no caminho confirmado UID/demanda/arquivo e URL privada; faltam colunas de `anexos` e políticas exatas |
| Histórico | Interface espera `criado_em`, `usuario`, `acao` | Consultar `historico` autorizado e mapear ator sem inserir auditoria pelo navegador |
| Tempo real | Socket.IO e sincronização via `list()` | Canal único Supabase, reconsulta e recuperação após reconexão; não ativados nesta etapa |

Testes executados nesta continuação: **8 aprovados** em `node --test --test-isolation=none scripts/test-supabase-client.cjs scripts/test-supabase-operations.cjs` (cinco do cliente, três do contrato RPC). Sintaxe da configuração e operações aprovada; `sync_pages.py --check` aprovado. Conferido `git diff --exit-code` sem alterações em CSS/app/API/login/backend/HTML raiz. Os testes não fazem chamadas ao banco e não comprovam login, RLS, Storage, concorrência ou Realtime reais.

Backup anterior desta continuação: `2026-11-03_supabase-config-rpc_732042f3`, cinco arquivos existentes copiados e conferidos por tamanho/SHA-256, dois arquivos novos registrados; preserva a etapa SUPABASE-004. Estado anterior mantido no manifesto. Para reverter, criar backup atual e retirar somente as diferenças SUPABASE-005, arquivando os módulos/testes novos e preservando trabalho posterior. Sem commit, push, deploy ou alteração de banco. Falta confirmar URL e fornecer resultado de `supabase/inspecionar.sql` para concluir a integração.

As seções seguintes registram a preparação anterior SUPABASE-004; a configuração vazia e a ausência de assinaturas RPC ali descritas foram superadas por esta continuação. O impedimento de ativação permanece.

**Migração ainda não concluída nem publicada.** A aplicação atual continua usando Node.js no HTTP. Os módulos novos não estão referenciados nos HTMLs: preencher a configuração ainda não ativa Supabase. Nenhum banco foi acessado ou modificado nesta tarefa.

## Inspeção e impedimento atual

Lidos `AGENTS.md`, documentos de controle, fontes locais e o adaptador atual no GitHub pelo conector. Repositório próprio em `Desktop/Demandas`, remoto `amapa1422/livre-escolha-demandas`, HEAD local `041ed57`. Diretório `Desktop/Grupo de demandas` estava vazio. Árvore Git sem alterações antes da tarefa; sem diferenças locais não registradas encontradas. Documentação histórica contém referências estruturais superadas, já qualificadas pelos registros BACKEND-003 e LOGOS-PAGES-002.

O único SQL disponível é `backend/migrations/001_initial.sql`, referente ao PostgreSQL local. Ele usa `usuarios`, não `perfis`, e não contém as RPCs nem as políticas do Supabase. Não deve ser aplicado no Supabase ou usado como descrição do banco remoto. O `.env` contém apenas configuração Node/PostgreSQL; somente os nomes das variáveis foram consultados, sem exibir valores.

Faltam Project URL, publishable key e a definição real das colunas, RPCs, gatilhos, permissões e políticas RLS/Storage. O pedido exige verificar essas políticas antes de implementar cada operação. Não é possível escolher parâmetros das RPCs, vínculo do usuário em `perfis`, nomes dos metadados ou caminhos privados de upload de forma comprovada sem essa informação. A configuração pública, sozinha, também não permite inspecionar políticas com privilégios administrativos.

## Arquivos entregues

- `central-demandas/js/supabase-config.js`: configuração pública vazia, sem credenciais.
- `central-demandas/js/supabase-config.example.js`: exemplo dos dois valores permitidos.
- `central-demandas/js/supabase-client.js`: carregamento sob demanda do SDK `@supabase/supabase-js` 2.118.0, cliente único, persistência/renovação de sessão e detecção de callback configuradas, validação de configuração e URLs calculadas a partir do arquivo JS.
- `supabase/inspecionar.sql`: consulta em transação somente leitura, com colunas, constraints, RLS, políticas, funções, gatilhos, grants, configuração do bucket e publicação Realtime. Não seleciona registros de negócios ou `auth.users`. Não é migração e não foi executada.
- `scripts/test-supabase-client.cjs`: testes isolados do módulo preparatório.
- Este relatório, atualização do estado/histórico e aviso no README de publicação.

Nenhum arquivo preexistente removido. HTMLs, renderização, CSS, logos, filtros, login atual, backend, `.env`, PostgreSQL local e dados do navegador preservados.

## Informações necessárias para continuar

1. No Supabase, obter Project URL e **publishable key** (`sb_publishable_...`). Não fornecer secret key, service_role, senha ou URL de conexão PostgreSQL.
2. Executar `supabase/inspecionar.sql` no SQL Editor do projeto e fornecer o JSON resultante, após revisar se as definições existentes contêm constantes privadas. Também serve o SQL original completo das tabelas/funções/políticas/gatilhos/grants.
3. Com o esquema confirmado, concluir adaptador `api.js`, login e callbacks, verificação de perfil ativo, RPCs, Storage/anexos, histórico e Realtime; integrar ao HTML canônico e gerar a raiz por `sync_pages.py`.
4. Avaliar migrações incrementais somente se a inspeção demonstrar necessidade. Nenhuma migração adicional foi criada ou aplicada nesta etapa.

## Configuração e publicação após concluir a integração

Preencher somente `projectUrl` e `publishableKey` no arquivo público. O módulo aceita exclusivamente chave publishable e URL HTTPS sem usuário/senha/query. Ele rejeita placeholders, JWTs e chaves secretas. O SDK será carregado por versão fixa no jsDelivr; a disponibilidade desse CDN será necessária quando ativado. Ainda falta verificar o carregamento real em navegador.

No Supabase Auth → URL Configuration, usar Site URL `https://amapa1422.github.io/livre-escolha-demandas/` e permitir o callback exato `https://amapa1422.github.io/livre-escolha-demandas/central-demandas/login.html`. Confirmar os templates de convites/recuperação durante a integração. Esses fluxos ainda não foram implementados nesta etapa.

Preservar `central-demandas/index.html` como fonte e gerar a raiz exclusivamente com `sync_pages.py`. Após concluir integração e testes, revisar diff/segredos, gerar/verificar saídas e publicar pelo fluxo existente do repositório (Pages → main → root). Não publicar esta preparação como migração operacional. Não houve commit, push, PR ou deploy nesta tarefa.

## Cadastro de funcionários após validar o esquema

Usar o Dashboard administrativo do Supabase Auth para convidar cada pessoa por e-mail individual. Confirmar o vínculo entre UUID de Auth e `public.perfis` segundo o SQL real, inclusive eventual trigger de criação. Somente um administrador pelo ambiente confiável deve atribuir `papel`/ativação no banco. Felipe deve ser admin; Pedro, Vinícius, Kaique e Luíz, funcionários, conforme registros reais, sem inferir privilégios pelo nome digitado ou permitir alteração de papel no navegador. Não executar o script legado `backend/scripts/user-add.js` para cadastrar no Supabase.

O procedimento exato de inserção/ativação de perfil depende do esquema ainda não fornecido. A aceitação de convite e definição de senha deverão ser verificadas com contas de teste antes de convidar a equipe para uso operacional.

## Verificações executadas

- `node --test --test-isolation=none scripts/test-supabase-client.cjs`: **5 testes aprovados**. Cobrem cliente único/chamadas concorrentes, caminhos com/sem prefixo Pages, rejeição de configuração inválida/privada antes da rede, correção após falha e carregamento/repetição do SDK simulado.
- `node --check` nos três módulos novos: aprovado.
- `sync_pages.py --check` com Python temporário existente: aprovado; nenhuma saída regenerada ou alterada.
- `git diff --exit-code` para CSS, app, adaptador atual, login, backend e HTML raiz: sem diferenças.
- Backup dos três documentos preexistentes afetados: tamanho e SHA-256 conferidos antes das edições.

A tentativa inicial `node --test` encontrou `spawn EPERM` pelo isolamento de processo; a execução sem isolamento acima passou. Os testes usam SDK simulado, sem autenticação, rede ou banco reais. Não foi executado o SQL de inspeção. Não foram testados os 20 cenários operacionais solicitados: login admin/funcionário, RLS, concorrência no banco, upload privado, histórico, duas sessões, reconexão, console ou responsividade da futura integração. Evidências antigas não foram reutilizadas como testes desta tarefa.

Referências consultadas: [inicialização do cliente](https://supabase.com/docs/reference/javascript/initializing), [eventos de Auth](https://supabase.com/docs/reference/javascript/auth-onauthstatechange), [metadados da versão estável no npm](https://registry.npmjs.org/@supabase/supabase-js/latest). São referências de implementação, não evidência de que o projeto remoto está configurado corretamente.

## Backup e reversão

Backup parcial `2026-11-03_supabase-preparacao_4567da8e`, manifesto em `backups/2026-11-03_supabase-preparacao_4567da8e/MANIFESTO_SHA256.json`: três documentos existentes e registro de ausência dos seis arquivos novos. Sem segredos, dependências, `.git` ou cópia recursiva de backups. Para reverter, criar novo backup do estado atual, comparar os três documentos e retirar somente os trechos desta etapa, preservando alterações posteriores; arquivar os novos arquivos. Seguir `INSTRUCOES_REVERSAO.md`. Nenhuma reversão executada.
