# Estado atual do projeto

## Encerrado ? SUPABASE-021 ? 04/11/2026

Etapa de desenvolvimento encerrada por solicita??o do propriet?rio. Site publicado em https://amapa1422.github.io/livre-escolha-demandas/; Source GitHub Actions confirmado novamente, run 41843292760 success e vers?o de aplica??o 4f96fa2703f1d0b105f95067ffa68fc8699059c4. Nova confer?ncia HTTP: 133 recursos correspondentes ao pacote final, zero diverg?ncias; .env/.git/SQL privados retornam 404. Main local/remota alinhadas antes do fechamento documental (59496b9). Aplica??o, design e funcionalidades intocados.

Aprovados anteriormente: 17 testes reais com Supabase entre admin/funcion?rio em ambiente local (permiss?es, concorr?ncia, Storage e Realtime); finaliza??o de demanda alheia recusada; inativa??o/restaura??o manual aprovada pelo propriet?rio. 27 testes isolados de CI e seis verifica??es an?nimas reais de produ??o aprovados. Propriet?rio confirmou acesso em produ??o com admin/Chrome e funcion?rio/Edge; registrar como confirma??o manual dele. Automa??o em produ??o comprovou somente login/perfil admin ativo e consulta da fila antes de parar, sem criar demanda (testDemandId=null). Houve tentativas anteriores invalid_credentials, seguidas de login admin bem-sucedido; n?o classificar a rodada inteira como aprovada.

Por decis?o expl?cita do propriet?rio, roteiros interativos encerrados sem fechar seus navegadores e sem novos pedidos de login. N?o foram conclu?dos em produ??o pelo agente: cria??o, upload/zoom, RPCs/permiss?es entre pap?is e Realtime entre navegadores. Convite/recupera??o por e-mail v?lido e SMTP pr?prio seguem sem comprova??o. RLS/RPC/Storage sob JWT preservado de usu?rio inativo n?o foram testados diretamente. Confer?ncia/limpeza dos registros QA antigos 12/13 adiada, sem alterar banco no encerramento. Essas limita??es ficam para acompanhamento futuro; nenhum novo problema cr?tico comprovado nesta revis?o.

Arquivos locais n?o rastreados s?o roteiros/evid?ncias QA, consultas de diagn?stico/testes espec?ficos e snapshot backend/legacy-frontend; n?o necess?rios ? execu??o do site e n?o inclu?dos automaticamente no Git. Nenhuma altera??o funcional rastreada pendente. Documenta??o deste encerramento ser? enviada em commit separado, sem novo deploy. Backup parcial verificado: 2026-11-04_encerramento_01533f5f. Revers?o somente documental exige novo backup e retirada dos trechos 021, preservando altera??es posteriores; nenhuma revers?o de banco ou publica??o executada.


## Publicado — SUPABASE-020 — 04/11/2026 — aguardando teste autenticado de produção

Publicação autorizada executada. Source=GitHub Actions confirmado por API, main alinhada antes de enviar commit `4f96fa2703f1d0b105f95067ffa68fc8699059c4`. Workflow manual [41843292760](https://github.com/amapa1422/livre-escolha-demandas/actions/runs/41843292760) concluído com success, todas etapas de testes/auditoria/build/deploy aprovadas. Site https://amapa1422.github.io/livre-escolha-demandas/. Credencial GitHub usada apenas em memória via gerenciador existente, nenhum token gravado/impresso.

27 testes isolados aprovados localmente e CI correspondente verde. 133 recursos públicos HTTP 200 e correspondentes ao pacote auditado, normalizando LF/CRLF em textos; arquivos de backend/.env/SQL/documentação privada/.git retornaram 404. Seis verificações anônimas reais aprovadas no site, incluindo página protegida/prefixo/callbacks sem sessão/cinco tabelas recusando acesso/zero erros JS. Design/funcionalidades preservados.

Chrome admin e Edge funcionário dedicados abertos no site oficial; solicitado login manual. Roteiro de produção aguarda autenticação antes de criar uma demanda QA com print e validar RPCs, imagens/zoom e Realtime entre papéis. Não afirmar essa rodada autenticada aprovada ainda. Roteiro local de QA recebeu apenas URL de destino/guards de papéis/checagem de zoom, não aplicação publicada. Evidências em .qa/supabase/deploy-20261104.json, published-static-20261104.json, published-browser-20261104.json, production-real-20261104.json. SMTP/entrega de e-mail e limpeza QA antigos 12/13 ainda a conferir após login. Relatório vigente em RELATORIO_PUBLICACAO.md. Backup 2026-11-04_publicacao_625e464b, 156 arquivos e suplemento, hashes/tamanhos conferidos. Commit de documentação será enviado separadamente, sem redeploy automático por Source Actions.

## Publicação autorizada — SUPABASE-020 — 04/11/2026 — em execução

Proprietário autorizou commit/push/workflow e testes de produção, condicionado a Source=GitHub Actions; confirmou três Redirect URLs adicionados. API autenticada independente confirmou build_type=workflow, condição atendida sem alterar configuração remota. Credencial do Git Credential Manager usada só em memória, sem token em arquivos/saídas. Conector GitHub permite consultar repositório, mas não a API de Pages/dispatch; usado helper local exclusivo em .qa, fora do commit.

Main local/remota iguais antes do envio, HEAD 041ed578ad215e531a45c0bafe6d8f7747d2ecf2. 27 testes isolados exigidos pelo workflow aprovados nesta etapa de publicação autorizada, separados dos testes reais anteriores. Sync/scanner/actionlint/build aprovados; pacote .release/deploy-20261104 com 134 arquivos públicos. Backup 2026-11-04_publicacao_625e464b de 156 arquivos selecionados/fontes/controle, SHA-256/tamanhos conferidos. Publicação em progresso, ainda sem afirmar conclusão de Actions ou testes reais no site. Design/funcionalidades preservados. Resultado, SHA e limitações serão registrados depois de executar as operações autorizadas.

## Configuração de produção revisada — SUPABASE-019 — 04/11/2026

Proprietário forneceu Site URL oficial correto, Redirect URL raiz seguido de ** na mensagem, templates padrão sem links personalizados (Source não inspecionado) e Pages Source=Deploy from a branch. Se a entrada literal for /livre-escolha-demandas/**, cobre os callbacks do código; recomendar cadastrar login/recovery/invite exatos do guia para eliminar ambiguidade e seguir recomendação oficial. Não exigir editar os modelos padrão apenas por serem padrão, nem afirmar ter inspecionado seu Source.

Origem Pages precisa ser alterada pelo proprietário para GitHub Actions **antes de push**, pois publicação por branch pode publicar automaticamente. Workflow local segue manual/main/confirmar_publicacao=true. Actionlint e scanner/artefato revalidados: 149 fontes, 134 públicos, zero padrões reais/matches privados. Fonte funcional/design/SQL/workflow intocados nesta etapa. Para convites/recuperação de funcionários em produção, falta SMTP próprio: serviço padrão é restrito à equipe do projeto e não destinado à produção (documentação oficial consultada). Isso não bloqueia login por senha das contas existentes; não enviar credenciais SMTP ao chat/Git.

Configuração relatada e limites registrados em `.qa/supabase/config-producao-20261104.json`. Backup `2026-11-04_config-producao_eb403d76`, cinco documentos conferidos por tamanho/SHA-256. Aplicação pronta localmente para revisão/envio, mas liberação operacional completa de e-mail depende da configuração SMTP e teste válido após deploy autorizado. Inativação/restauração manual aprovada em 018, 17 testes entre papéis preservados. QA 12/13 ainda precisam ser conferidos/limpos pelo admin, pendência operacional. Não houve staging, commit, push, mudança remota ou publicação.

## Inatividade/restauração aprovada — SUPABASE-018 — 04/11/2026

Proprietário executou o teste real manual orientado e confirmou cinco resultados: funcionário inativo bloqueado na interface, admin continuou acessando, SQL de restauração executado, funcionário voltou a acessar pelo Edge e ativo retornou a true. Captura do SQL Editor mostra o mesmo UUID específico previamente usado, papel funcionario e ativo=true. Registrar como **aprovado pelo proprietário**, não como execução automatizada do agente. Evidência em `.qa/supabase/inativo-manual-20261104.json`; relatório automatizado anterior preservado. Não requer nova inativação. Nenhuma outra conta alterada pelo agente.

Resolve a pendência de bloqueio/restauração pela interface. Testes diretos de RLS/RPC/Storage com JWT válido de perfil inativo não foram reexecutados; não inferir essa cobertura do relato/captura. Os 17 testes entre papéis e a recusa de finalização alheia mantidos. Antes de liberar publicação faltam confirmar Site URL, Redirect URLs/templates de convite/recuperação reais e origem Pages=GitHub Actions no painel. Limpeza dos QA 12/13 ainda sem comprovação, pendência operacional separada. Validação completa de e-mail na nova versão será posterior ao deploy autorizado.

Documentos atualizados com backup `2026-11-04_inativo-aprovado_4398a9de`, cinco arquivos com tamanho/SHA-256 conferidos. Aplicação/design/SQL/workflow preservados, sem novas demandas, testes simulados, contas alteradas, commit/push/Actions/publicação. Auditorias e pacote já aprovados em SUPABASE-017; manifesto de fontes atualizado após documentação. Valores/configuração de produção solicitados ao proprietário, sem chaves privadas.

## Revisão de retomada — SUPABASE-017 — 04/11/2026

Revisados arquivos/Git/evidências sem refazer integração ou alterar funcionalidades. Preservados os 17 testes reais aprovados entre papéis. A evidência final de segurança continua `waiting-for-deactivation`: só a recusa de finalizar caso do admin está aprovada; inatividade/restauração não concluídas documentalmente. A tentativa anterior de espera inválida não é falha comprovada da RLS. Sessões dedicadas 9231/9232 indisponíveis nesta retomada: não afirmar que roteiro antigo segue executando. Estado atual do perfil e limpeza dos QA 12/13 precisam ser confirmados antes de retomar, sem reaplicar SQL de inativação às cegas.

Reconsulta real Auth/settings HTTP 200 confirmou URL correta, formato publishable e disable_signup=true. Site público raiz/app/login de recuperação respondem 200, porém HTML retornado não referencia novos scripts Supabase; versão preparada ainda não comprovada no site. Site URL/Redirect URLs/templates atuais solicitados ao proprietário; sem evidência nova desses ajustes. Código usa login/app relativos ao script e recuperação em login.html?mode=recovery, compatíveis com subcaminho local testado.

Reexecutados sync_pages, sintaxe dos JS, scanner de fonte/índice/valores privados em memória e actionlint 1.7.12: aprovados. Build novo `.release/review-20261104/livre-escolha-demandas`, 134 arquivos aprovado. Seis verificações Chrome isolado/SDK real sob prefixo aprovadas, sem mocks/erros JS capturados; nenhuma autenticação real de funcionário/inativo reexecutada. CSS idêntico à fonte e sem diff no Git. Scanner aprovou 149 fontes, 202 rastreados, zero padrões reais/matches privados; .env ignorado/não rastreado. Índice Git vazio, branch main/HEAD 041ed57; não houve staging, commit, push ou Actions. Manifesto será atualizado após documentação.

Ferramentas temporárias de ontem haviam sumido; Python 3.13.12 recuperado com uv e actionlint oficial/checksum recuperado, sem alterar dependências da aplicação. Backup documental `2026-11-04_revisao-final_e3f42b1f`, cinco arquivos tamanho/SHA-256 conferidos. Evidência em `.qa/supabase/review-20261104.json` e prefix report. Pendências antes de liberar: concluir inatividade/restauração/limpeza QA, confirmar callbacks/templates reais e origem GitHub Actions no painel; após isso, revisão do commit/push e autorização explícita para publicar. Validação de e-mail válido no novo site é posterior ao deploy aprovado. Aplicação/design/SQL/workflow intocados nesta revisão; só documentação/evidências/artefatos de revisão.

## Preparação final — SUPABASE-016 — 03/11/2026 — ainda não liberada

Solicitado teste de inativo/finalização alheia, callbacks, workflow e credenciais antes de publicar. Finalização indevida testada com serviços reais: funcionário recusado ao finalizar demanda atribuída ao admin; estado andamento e responsável preservados. Roteiro real corrigido aguarda execução de `supabase/teste-inativo.sql` pelo proprietário e posterior restauração específica; IDs de teste 12/13 ainda reservados para essa rodada. SQLs gerados com UUID do funcionário do Edge e guarda papel=funcionario, administrador não alterado. Uma primeira espera avançou antes da inativação manual; evidência invalidada explicitamente, demandas 10/11 excluídas logicamente e teste refeito exige consulta explícita ativo=false. Não registrar isso como falha real da RLS.

Workflow manual passou no actionlint 1.7.12 (binário oficial/checksum conferido); acrescentados guarda main, input boolean confirmar_publicacao default false e scanner de fontes/índice antes de publicar. Nenhum Actions executado. Seis testes reais de caminhos/redirecionamentos/callbacks inválidos sob prefixo local aprovados com SDK real e servidor estático 8001; não substituem Site URL/Redirect URLs/templates reais ou e-mail válido em produção. Valores do painel solicitados, aguardando resposta.

Scanner novo aprovou 149 arquivos selecionados, arquivos rastreados/novos e índice: sem padrões reais, sem correspondências aos dois valores privados locais comparados em memória. Exceção única/exata para fixture de rejeição sintético documentada, sem executar testes simulados. backend/.env não rastreado; busca nominal no histórico local não retornou .env/pem/key. Pacote público 134 arquivos aprovado, sem backend/dependências legadas. Manifestos em .release, ignorada; guia/comandos em PUBLICACAO_FINAL.md. Aplicação/CSS/design preservados. Backup principal `2026-11-03_pre-publicacao_15cbb2d3` e suplementos, hashes/tamanhos conferidos. Sem SQL administrativo pelo agente, conta criada, staging, commit, push ou publicação. Pendências obrigatórias: teste de inatividade/restauração e configuração real dos callbacks; não declarar release liberada.

## Admin e funcionário validados — SUPABASE-015 — 03/11/2026

Rodada real `QA_ROLES_99d04fab` concluída: **17 verificações aprovadas, zero falhas**. Chrome admin e Edge funcionário ativos, identidades distintas, canais privados autorizados. Criadas somente demandas identificadas 8 e 9 pelo roteiro, ambas excluídas logicamente ao final. Funcionário criou 8 com PNG privado de 1.748 bytes, visto automaticamente pelo admin; download autenticado pelo admin aprovado. Exclusão via RPC negada ao funcionário em ambas, UPDATE direto/atribuição a outro usuário/auditoria arbitrária recusados. Funcionário assumiu para si, finalizou própria demanda e leu histórico; Chrome atualizou status automaticamente.

Disputa real simultânea da demanda 9 entre usuários distintos: funcionário venceu, admin recusado, um único sucesso, responsável persistido correspondente. Admin finalizou demanda atribuída ao funcionário. Exclusões pelo admin geraram aviso privado ao Edge; cards removidos dos dois navegadores sem reload/filtros alterados, conferidos em 2.011 e 2.262 ms. Consultas de ambos ocultam as excluídas. Zero erros JS/requisições legadas capturados no roteiro. Fonte de evidência `.qa/supabase/roles-real.json`.

Antes da rodada, Edge foi confirmado funcionário, mas Chrome estava sem sessão e depois recebeu login com papel funcionario; saiu apenas dessa sessão, solicitada conta admin correta. Ambos os navegadores dedicados foram encerrados, interrompendo roteiro antes de criar dados; reabertos mesmos perfis, recuperaram admin/funcionário e a rodada passou. Falha preservada em roles-real-browser-closed.json; probe preliminar sem escrita em employee-preflight.json. Nenhuma alteração de aplicação/SQL/design/permissões ou contas, mocks, commit/push/publicação. Scanner 134 arquivos e sintaxe aprovados. Backup documental `2026-11-03_validacao-papeis_b871f01e`, quatro arquivos conferidos por tamanho/SHA-256. Pendências que esta rodada não cobre: conta inativa, convite/recuperação novos, finalização por funcionário de caso de terceiro e callbacks/ambiente de produção.

## Teste entre papéis preparado — SUPABASE-014 — 03/11/2026

Proprietário informou conta de funcionário ativa no Edge e pediu testes entre papéis. Portas dedicadas 9231/9232 estavam fechadas; reabertos somente perfis temporários de teste. Chrome recuperou admin ativo; Edge dedicado estava em login e foi fechado/reaberto novamente. Solicitado login manual do funcionário nessa janela, sem credenciais no chat. Roteiro real `scripts/qa-supabase-roles-real.cjs` em execução aguardando papel funcionario/ativo no Edge antes de criar qualquer dado. Evidência dinâmica `.qa/supabase/roles-real.json`: waiting-for-employee, checks vazios, testIds vazios na última conferência. Nenhum teste entre papéis aprovado nesta etapa ainda.

Preparados casos reais de criação/print por funcionário, recusa de exclusão/UPDATE/atribuição a terceiro/auditoria arbitrária, assumir/finalizar para si, disputa simultânea entre usuários distintos e exclusão pelo admin sincronizada sem reload/filtros alterados. Backup parcial `2026-11-03_admin-funcionario_e173cf86`, quatro documentos com tamanho/SHA-256 conferidos. Sintaxe do roteiro e scanner de 134 arquivos aprovados. Nenhuma mudança da aplicação/SQL/design, conta criada, mock ou publicação. Falha inicial de conexão preservada em roles-real-launch.json; nova execução aguarda usuário, sem demanda criada.

## Auth e permissões verificados — SUPABASE-013 — 03/11/2026

Proprietário desativou signup; reconsulta real Auth/settings confirmou HTTP 200 com `disable_signup=true`. Chrome segue autenticado/admin, Edge sem sessão após logout anterior. Consulta de papel/ativo retornou apenas um perfil admin ativo visível à sessão; solicitado login de funcionário no Edge, aguardando disponibilidade, sem criar contas/alterar papéis.

Nova rodada `.qa/supabase/security-real.json`: 11 verificações reais aprovadas, zero falhas. Criada e excluída logicamente somente demanda de teste 5. UPDATE direto mesmo ao admin e INSERT arbitrário em historico recusados com 42501. Duas tentativas simultâneas de assumir em conexões de duas abas da mesma conta admin tiveram uma vencedora e uma recusa. Finalizar/excluir por RPC funcionaram, aviso privado recebido no observador. Visitante sem sessão redirecionado; leitura das cinco tabelas e execução de excluir recusadas; sessão admin/dois canais joined e ausência de erros JS confirmadas. A rodada não substitui testes entre papéis/usuários diferentes ou conta inativa. Realtime entre Chrome e Edge com mesma conta admin foi aprovado na etapa 012; nesta etapa apenas duas abas Chrome.

Criado roteiro real de segurança e atualizados quatro documentos. Aplicação/SQL/design intocados; nenhum mock, chave secreta, conta criada, permissão alterada, SQL administrativo, commit/push ou publicação. Scanner do artefato 134 arquivos aprovado. Backup parcial `2026-11-03_auth-permissoes_bdc4bec8`, quatro arquivos conferidos por tamanho/SHA-256. Pendências: conta de funcionário/inativo para permissões/concorrência entre usuários, convites/callbacks de produção. Signup resolvido.

## Realtime validado — SUPABASE-012 — 03/11/2026

Após confirmação de aplicação de 003 pelo proprietário, teste real Chrome/Edge independentes `QA_SUPABASE_20261103_45932042` aprovado em 19 verificações. Demanda exclusiva de teste 4 criada com PNG privado, consultada, assumida, finalizada e excluída. Aviso privado recebido em 577 ms; card ausente nos dois navegadores sem reload, filtros/aba mantidos, verificação concluída em 3.410 ms. Anônimo recebeu Unauthorized no tópico, conforme esperado. Canal autorizado permaneceu joined na revisão posterior. RLS continua ocultando demandas excluídas.

Revisão final real: nove verificações aprovadas e uma pendência — cadastro público ainda habilitado (`disable_signup=false`), solicitada desativação ao proprietário. Sessão restaurada/recarregada, dois canais únicos joined, demandas excluídas 1–4 invisíveis, páginas protegidas, cinco tabelas recusando leitura anônima, logout Edge/zero canais e Chrome independente aprovados; sem erros JS ou chamadas legadas na revisão. Responsividade sem overflow em 1366/768/390/320 px, captura mobile inspecionada. Funcionário/inativo/concorrência entre pessoas, convites e callbacks de produção ainda não exercitados nesta etapa.

Primeiro reteste após 003 (demanda 3) recebeu aviso, mas teste exigia payload vazio e falhou devido ao UUID técnico que Realtime acrescenta. Corrigida somente essa expectativa no roteiro, validando UUID e ausência de campos de negócio; comportamento confirmado no código oficial (supabase/realtime PR 1385). Falha original preservada em realtime-003-aplicada.json; rodada final em realtime-003-validacao-final.json. Nenhuma alteração em aplicação, SQL ou design nesta etapa. Criado roteiro final real; documentos atualizados. Backup `2026-11-03_validacao-003_a14f893d`, sete arquivos conferidos por tamanho/SHA-256. Scanner estático de 134 arquivos/sync_pages aprovados. Sem mocks, SQL executado pelo agente, commit, push ou publicação.

## Diagnóstico recebido — SUPABASE-011 — 03/11/2026

Resultado de diagnosticar_canal_privado.sql fornecido pelo proprietário: função de aviso, trigger de exclusão e políticas realtime ausentes (null), zero avisos nos últimos 30 minutos; quatro privilégios básicos de authenticated presentes. Portanto, os objetos de 003 não estão instalados no banco consultado, explicando Unauthorized. Arquivo 003 conferido e mantido sem mudanças. Necessário executar seu conteúdo integral no projeto correto e informar sucesso/erro para retomar a validação real. Nenhum novo teste funcional ou SQL executado pelo agente nesta etapa; design/código preservados e sem publicação. Evidência em `.qa/supabase/diagnostico-003-ausente.json`. Backup documental `2026-11-03_diagnostico-003_ac258ff6`, três arquivos com tamanho/SHA-256 conferidos.

## Reteste real — SUPABASE-010 — 03/11/2026

Proprietário informou sucesso de 003, mas enviou o diagnóstico anterior, que não verifica seus objetos. Reteste executado com Chrome e Edge em perfis independentes, login manual da mesma conta admin ativa: 15 verificações aprovadas e uma falha. Demanda exclusiva de teste 2 criada, consultada, assumida, finalizada e excluída; PNG de 13.028 bytes enviado/baixado com autenticação, acesso público recusado; histórico criar/assumir/finalizar consultado antes de excluir. INSERT e UPDATE de atribuição/finalização recebidos pelo observador.

**Correção ainda não validada:** aviso privado não recebido em 15 s. A confirmação inicial de canal joined foi transitória; inspeção posterior encontrou erro e reconexão. Nova conexão de diagnóstico capturou resposta real `Unauthorized: You do not have permissions to read from this Channel topic: livreescolha-demandas-invalidate`. Os cards ficaram ausentes após reconsultas, o que não comprova entrega do evento. Preparada consulta somente leitura `supabase/diagnosticar_canal_privado.sql` para trigger/função/políticas/privilégios/contagem de avisos, aguardando resultado. Nenhuma ampliação de permissão ou SQL executado pelo agente.

Roteiro ampliado para segundo navegador independente e verificação dos dois cards. Evidência em `.qa/supabase/realtime-exclusao-dois-navegadores.json`. Backup parcial `2026-11-03_dois-navegadores_dbfa9036`, quatro arquivos anteriores conferidos por tamanho/SHA-256. Aplicação, migração 003, HTML/CSS/design intocados nesta retomada. Sem serviços simulados, publicação, commit ou push.

## Correção preparada — SUPABASE-009 — 03/11/2026

JSON administrativo fornecido pelo proprietário confirmou: demanda 1 retida com excluido_em preenchido, quatro auditorias preservadas e RLS ocultando demanda/histórico após exclusão. Causa do evento perdido confirmada. Preparada migração incremental `003_realtime_exclusao_privada.sql`: trigger de transição para exclusão envia apenas `{}` em tópico privado; políticas específicas permitem receber somente a funcionário ativo e impedem envio por cliente. Não altera RPCs existentes, políticas de negócio ou dados.

Adaptador e artefato local atualizados: mantido postgres_changes e adicionado um canal privado distinto, sem duplicação por aba, removido na saída e com reconsulta ao reconectar. Filtros/modais continuam na lógica aprovada. HTML/CSS/app.js intocados nesta etapa. Roteiro real ampliado para verificar aviso vazio, card removido na segunda aba sem recarga/filtros alterados e recusa de identidade anônima. **Aplicação do SQL 003 e reteste real da correção ainda pendentes.** Sintaxe JS, verificação do pacote e sync_pages aprovados; nenhum teste com serviços simulados foi executado. Backup `2026-11-03_realtime-exclusao_19ce61be`, 11 arquivos com tamanho/SHA-256 conferidos. Sem publicação.

## Validação real — SUPABASE-008 — 03/11/2026

Senha recuperada pelo proprietário; login admin/ativo confirmado pelo roteiro. Treze verificações reais aprovadas: consulta, criação da demanda de teste 1 com PNG privado (13.307 bytes), metadados/download autenticado, recusa de acesso público, RPCs assumir/finalizar/excluir, histórico antes de excluir e Realtime de criação/atribuição. Evento de finalização também observado. **Falhou o evento Realtime de exclusão:** a fila deixou de mostrar a demanda, mas o observador não recebeu UPDATE com exclusão. Consulta autenticada posterior também não vê demanda/histórico; aguardando SQL somente leitura para confirmar função/políticas e retenção, sem abrir permissões. Arquivo `supabase/diagnosticar_exclusao_realtime.sql` preparado e solicitado ao usuário. Não publicar como totalmente validado. Nenhum mock, mudança visual, SQL adicional, importação ou deploy. Evidências em `.qa/supabase/real-results.json`; detalhes em VALIDACAO_REAL_SUPABASE. Backup `2026-11-03_retomada-real_a5334f79`.

## Validação real em andamento — SUPABASE-007 — 03/11/2026

Proprietário confirmou aplicação das migrações Supabase 001/002. Servidor estático Python em `http://127.0.0.1:8000/`, servindo somente o pacote público; Node legado não iniciado, design preservado, sem publicação. URL e publishable key conferidas contra Auth real (HTTP 200). Tentativas manuais de login retornaram HTTP 400 `invalid_credentials`; aguardando credenciais válidas no navegador, sem solicitar senha no chat. Nenhuma demanda/anexo criado no diagnóstico inicial; testes autenticados ainda pendentes. Roteiro real preparado, sem mocks, com resultados em `.qa/supabase/real-results.json` e orientação em [VALIDACAO_REAL_SUPABASE.md](VALIDACAO_REAL_SUPABASE.md). Signup público ainda habilitado no settings consultado. Backup documental `2026-11-03_validacao-real_e70ae429`.

## Estado vigente — SUPABASE-006 — 03/11/2026 — integração local concluída

URL corrigida `https://nxqqcdddbhezuvhpemge.supabase.co` acessível; Auth/settings aceitou a publishable key. Adaptador ativo nos HTMLs, Auth/perfil ativo, login/logout/recuperação/convite, campos reais, IDs bigint como texto, criação idempotente, três RPCs de status, anexos privados via nova RPC, clientes via RPC específica e Realtime com reconsulta/reconexão/polling de 45 s. CSS do painel intacto; geometria igual ao backup em cinco larguras. Node/Express/Socket.IO não são usados pelo pacote publicado. File local permanece independente.

27 testes isolados e 14 grupos no Chrome aprovados (dados/serviços simulados nos fluxos autenticados); SDK real verificado para visitante sem sessão. Zero erros JS/console e chamadas à API antiga na rodada. Preparados SQLs incrementais 001/002, empacotador (133 arquivos públicos) e workflow manual Pages. Backend original preservado; cinco arquivos do front-end antigo em `backend/legacy-frontend/`.

**Ainda não publicado/validado com contas reais.** Aplicar SQLs pelo painel, desativar cadastro público (Auth retornou `disable_signup=false`), configurar callbacks/bucket e validar RLS/concorrência/duas sessões reais. Nenhum SQL, importação, mudança no PostgreSQL local, commit ou push executado. Backup `2026-11-03_supabase-integracao_9a16bd72`, 19 arquivos existentes incluindo suplementos, SHA-256/tamanhos conferidos. Detalhes e limitações em [RELATORIO_SUPABASE.md](RELATORIO_SUPABASE.md).

## Estado vigente — SUPABASE-005 — 03/11/2026 — configuração e RPCs

URL/chave pública recebidas e registradas; módulo isolado de `action/remove` com as três assinaturas RPC confirmadas; oito testes simulados aprovados, sincronizador Pages aprovado. **Migração ainda não ativada/concluída.** Host `nxqqcddbhezuvhpemge.supabase.co` não resolve no DNS, inclusive fora do sandbox; `supabase.com` resolve normalmente. Solicitadas URL confirmada e definições das colunas/políticas. Mapeamento das diferenças da interface, bigint, perfis, logos e anexos em [RELATORIO_SUPABASE.md](RELATORIO_SUPABASE.md). Nenhuma escrita remota, mudança do backend/CSS/app, commit ou publicação. Backup `2026-11-03_supabase-config-rpc_732042f3`; preparação anterior preservada.

## Estado vigente — SUPABASE-004 — 03/11/2026 — preparação

Migração Supabase solicitada, **ainda não concluída**. Criados configuração pública vazia/exemplo, cliente SDK isolado sem ativação nos HTMLs, consulta SQL somente leitura para inspecionar o banco remoto e cinco testes isolados aprovados. Runtime, CSS, dados e backend anteriores preservados. Continua vigente a dependência operacional do Node.js descrita em BACKEND-003.

Faltam Project URL, publishable key e esquema/políticas/RPCs reais do Supabase; solicitados ao usuário. Não inferir essas definições do PostgreSQL local. Nenhum acesso/mudança de banco, migração de dados, commit, push ou publicação. Os cenários operacionais da futura integração permanecem sem teste. Backup parcial `2026-11-03_supabase-preparacao_4567da8e`. Detalhes, arquivos, validação, configuração, publicação futura e cadastro de funcionários em [RELATORIO_SUPABASE.md](RELATORIO_SUPABASE.md).

## Estado vigente — BACKEND-003 — 30/10/2026

Backend concluído e testado localmente: `npm.cmd start` em `backend/`, porta 3000, `http://127.0.0.1:3000`. Servidor Express usa configuração/pool/scrypt existentes e as sete tabelas reais, sem recriar banco, executar migrações ou modificar usuários/senhas.

Login/logout/sessão PostgreSQL, papéis admin/funcionário, CSRF/Helmet/rate limit, rotas protegidas, demandas e histórico transacionais, anexos privados e Socket.IO após commit. Atribuição concorrente protegida por bloqueio de linha. Funcionário assume para si e finaliza as próprias; admin atribui/finaliza/exclui logicamente. Exclusão mantém histórico. Detalhes em [RELATORIO_BACKEND.md](RELATORIO_BACKEND.md).

Front-end organizado integrado, com login na identidade existente, Sair e Histórico. CSS aprovado preservado byte a byte; cards, filtros, logos, modais e zoom mantidos. Lista de responsáveis usa contas ativas. HTTP persiste no banco, sem ler/escrever/importar a chave antiga de demandas no navegador; `file://` continua local. GitHub Pages não hospeda a aplicação operacional. Original monolítico preservado.

Validação: `npm.cmd start`, conexão real PostgreSQL, teste de imagens e 16 grupos de integração aprovados; duas sessões Chrome com atualização automática; concorrência, permissões, histórico, anexos e logout; comparação visual em cinco larguras, zero erros JS/console. Dados reais e hashes de usuários idênticos antes/depois. Testes usam esquema isolado e usuários sintéticos; senhas reais não foram testadas. Primeiro login real e implantação HTTPS externa permanecem verificações manuais. Evidências em `../.qa/backend/`.

Backup: `backups/2026-10-30_105255_backend_1b8df768/`, 19 arquivos conferidos por SHA-256/tamanho. Sem commit, push, PR ou deploy. Alterações locais anteriores preservadas. Pendências anteriores de revisão de logos continuam válidas.

## Estado vigente — LOGOS-PAGES-002 — 30/10/2026

Esta seção substitui as descrições de estrutura/funcionalidades do registro histórico de 29/10 abaixo. A fonte principal é `central-demandas/index.html`, com `css/style.css` e `js/app.js`. A entrada `index.html` da raiz é gerada exclusivamente dessa fonte por `sync_pages.py`.

- Removidos Restaurar demo (HTML/evento), caixa Modo demonstração e identificações de protótipo do rodapé. Rodapé: `© 2026 Livre Escolha`.
- Somente o título Demandas usa Plus Jakarta Sans 600 e `--brand`. Fonte externa limitada aos caracteres do título, `display=swap`, com Segoe UI/Arial locais como alternativas.
- Catálogo: `central-demandas/assets/clientes/clientes.json`; 291 empresas, 118 imagens únicas, 55 WebP sem perda e 63 originais mantidos por serem menores. `catalogo.js` é gerado do JSON, sem lógica de negócio duplicada, para suportar HTTP e abertura direta por arquivo.
- Autocompletar por trecho, sem distinção de acentos/caixa, com mouse, setas, Enter, Tab e Escape. Selecionar acrescenta somente `clientId` à nova demanda. Digitação livre permanece permitida; editar o nome remove a seleção. Nenhuma associação automática de registros antigos.
- Logos discretas em cards/detalhes, dimensões reservadas, `object-fit:contain`, carregamento lazy, falha de imagem ocultada sem deslocar conteúdo. Print continua independente.
- Prints PNG/JPEG/WebP mantêm o limite de 1 MB. Conversão local opcional a WebP com qualidade máxima e resolução integral, apenas com economia de pelo menos 10%. WebP já fornecido, imagens acima de 16 milhões de pixels e conversão sem benefício preservam o original validado.
- Chaves de localStorage, registros antigos, IDs, categorias, responsáveis, status e fluxos de negócio preservados. Dados corrompidos continuam protegidos contra sobrescrita, agora sem a ação destrutiva de restauração.
- Backend existente não foi alterado (verificação SHA-256); a aplicação continua estática, sem conexão com PostgreSQL/API/login.

**Verificação:** 57 testes principais + 5 complementares no Chrome, sem erros capturados de JavaScript/console; teste adicional via `file://` aprovado; 514 verificações de integridade/processamento/publicação aprovadas. Responsividade em 1920, 1366, 768, 390 e 320 px. Raiz, entrada organizada e ambas sob `/livre-escolha-demandas/` exercitadas por servidor local. Não houve implantação nem teste da nova versão hospedada no GitHub Pages.

**Git atual:** repositório próprio em `C:/Users/felipe.lobato/Desktop/Demandas`, remoto `amapa1422/livre-escolha-demandas`, HEAD encontrado `d6c6d62`. Não criado commit/push nesta atualização. Mudanças locais anteriores no original, documentação, `.gitignore`, `README_PUBLICACAO.md`, `sync_pages.py` e backend foram preservadas/integradas.

**Backup preventivo:** `backups/2026-10-30_093340_logos-pages_a78d5ba2/`, 18 arquivos conferidos. Originais do ZIP em backup separado identificado em `LOGOS_PROCESSADAS.json`; ZIP em Downloads mantido intacto. Backups não contêm dados do navegador.

**Pendências:** confirmar duas abreviações de Comercial Agricola (Cornelio/Jardim), fornecer imagem legível de Expo Design e publicar a alteração revisada. Relatório completo: [RELATORIO_LOGOS_PAGES.md](RELATORIO_LOGOS_PAGES.md). Evidências: `../.qa/logos-pages/`.

## Registro histórico da implantação do controle

Registro inicial do controle: **29/10/2026, 13:37:27 −03:00**, America/Sao_Paulo. Identificação da alteração: **CTRL-001**.

## Versão em uso e estrutura real

O sistema existente é a versão aprovada. O HTML oficial original e a entrega organizada coexistem; nenhum deles foi movido, substituído ou editado nesta tarefa.

```text
Demandas/
├── demandas_otimizado (1).html          # original oficial independente
├── central-demandas/                   # entrega organizada existente
│   ├── index.html
│   ├── css/style.css
│   ├── js/app.js
│   ├── assets/images/.gitkeep
│   ├── README.md
│   └── .gitignore
├── .qa/                                # testes, relatórios e capturas anteriores
├── AGENTS.md                           # novo: regras para esta árvore
└── _CONTROLE_PROJETO/                   # novo: controle documental
    ├── LEIA_PRIMEIRO.md
    ├── FUNCIONALIDADES.md
    ├── DESIGN_APROVADO.md
    ├── HISTORICO_ALTERACOES.md
    ├── ESTADO_ATUAL.md
    ├── INSTRUCOES_REVERSAO.md
    └── backups/
        └── versao_inicial/
            ├── demandas_otimizado (1).html
            ├── central-demandas/       # cópia dos seis arquivos existentes
            └── MANIFESTO_SHA256.json
```

## Funcionalidades implementadas

Cadastro com campos obrigatórios; quatro tipos; prioridades Normal/Alta; atribuição por dropdown com cinco responsáveis; estados Pendente/Em andamento/Lançada; quatro indicadores; pesquisa instantânea; filtro por tipo; três ordenações; abas/menu por status; barra recolhível persistida; cadastro/detalhes/atribuição/zoom em overlays; print PNG/JPG/WebP de até 1 MB; exclusão e restauração da demo com confirmação; persistência local e layout responsivo.

A entrega organizada já contém tratamento de falhas de armazenamento, validação ampliada de imagens/dados, proteção contra HTML em textos, prevenção de envio duplicado, foco gerenciado e eventos organizados. Essas proteções não estão todas no HTML original: consulte o quadro de diferenças em [FUNCIONALIDADES.md](FUNCIONALIDADES.md).

## Tecnologias e execução

HTML5, CSS3 e JavaScript puro, APIs nativas do navegador, `localStorage`, FileReader e imagens `data:`. Não há frameworks, dependências instaláveis, build, backend, banco, login, API ou integração WhatsApp.

- Abra `Demandas` no VS Code para manter este controle visível junto das duas entradas.
- Para a versão organizada, abra `central-demandas/index.html` no navegador.
- Para o original, abra `demandas_otimizado (1).html` no navegador.
- Não é necessário servidor, instalação ou conexão à internet.
- `.qa/runner.html` é uma ferramenta de teste que altera dados de teste quando ativada; não é a tela do sistema. Use apenas perfil descartável para executá-la.

## Armazenamento e limitações conhecidas

- Demandas: `livre_escolha_demandas_demo_v1`; barra: `demandas_sidebar_closed`.
- Dados pertencem ao navegador/perfil/origem. Trocar arquivo, caminho ou URL pode mudar o escopo; manter a chave não transfere registros automaticamente.
- Prints em base64 consomem a quota limitada do `localStorage`; não existe backup/exportação/importação dos registros pela interface.
- Não há sincronização entre abas, pessoas ou computadores; o estado em memória de uma aba não acompanha automaticamente a outra.
- O botão **Restaurar demo** substitui dados locais após confirmação e não recupera versões anteriores.
- Os backups de código ficam no mesmo disco, sem agendamento ou cópia externa. São proteção contra edições, não contra perda física do disco.
- Documentação/AGENTS orientam o trabalho; não impõem bloqueio técnico de escrita.
- Testes móveis anteriores usaram viewports simulados. Não há validação em aparelhos físicos, leitores de tela ou benchmark em máquina de baixa potência registrada.

## Última alteração verificada

**CTRL-001 — implantação de controle, documentação e backup inicial**, detalhada em [HISTORICO_ALTERACOES.md](HISTORICO_ALTERACOES.md). Escopo: adicionar somente `AGENTS.md` e `_CONTROLE_PROJETO/`.

Verificação desta tarefa: inventário de todos os **17 arquivos preexistentes**, comparação de SHA-256 e tamanhos antes/depois, cópia e conferência dos **7 arquivos da aplicação**, conferência do manifesto e das referências documentais. Nenhum arquivo preexistente, inclusive `.qa`, foi modificado; nenhum dado do navegador foi acessado. Os resultados são de integridade documental, não uma nova rodada de testes funcionais.

Evidência anterior consultada, de 29/10/2026: `.qa/chrome-results.json`, `.qa/edge-results.json` e `.qa/opera-results.json` registram **75 verificações aprovadas cada, zero falhas e zero erros capturados**, totalizando 225. Não foi inventado horário para essa execução anterior, e os testes não foram repetidos nesta implantação.

## Backup inicial aprovado

- Identificador: **`versao_inicial`**.
- Local: `backups/versao_inicial/`, relativo a este documento.
- Marco: conteúdo da aplicação encontrado imediatamente antes da implantação deste controle; corresponde à versão inicial aprovada deste sistema de proteção, não a uma suposta versão histórica anterior à organização do código.
- Conteúdo: original oficial + seis arquivos da pasta `central-demandas`, total **7 arquivos / 92.385 bytes**.
- Verificação: SHA-256 e tamanho de cada cópia iguais aos da origem. Nenhum arquivo do escopo omitido ou acrescentado à cópia da aplicação.
- Manifesto: [MANIFESTO_SHA256.json](backups/versao_inicial/MANIFESTO_SHA256.json), com sete entradas copiadas e inventário dos 17 arquivos preexistentes.
- Fora do snapshot: `.qa`, os novos documentos de controle, `.git`, dependências, temporários e `localStorage`. `.qa` está no inventário de preservação, mas não é uma cópia recuperável deste backup.

Hash SHA-256 do original oficial: `663579A00D8835992F0881CD312E5EA82497F069217E2C79BE5CD0990F5BA63F`.

## Git e pendências verificáveis

Git disponível: `2.54.0.windows.1`. O topo detectado é **`C:/Users/felipe.lobato`**, ancestral de `Demandas`. Na consulta restrita ao projeto, `git status` indicou `?? ./`, `git ls-files -- .` não retornou arquivos e não foram encontrados commits para estes caminhos. **Não existe commit Git desta versão do projeto.** Nenhum comando de escrita Git foi executado.

Pendências de proteção, sem implementação autorizada nesta tarefa:

1. Definir versionamento Git com escopo próprio ou explicitamente delimitado, antes de depender de commits para recuperação; não manipular indiscriminadamente o repositório ancestral.
2. Se houver necessidade de proteção contra perda do disco, definir um destino externo de backup. Nenhum envio foi realizado.
3. Se houver necessidade de recuperar dados do navegador, definir um procedimento separado; os backups presentes são de arquivos.
4. Preservar o conhecimento das diferenças entre as duas entradas. As limitações do original foram documentadas, sem corrigi-las nem duplicar automaticamente mudanças.

Não há alteração funcional pendente criada por esta tarefa. Recursos novos, integrações e mudanças no design dependem de solicitações futuras.


## Atualização de revisão — publicação e backend
- `index.html` agora existe na raiz e é sincronizado pelo `sync_pages.py` a partir da fonte de verdade `central-demandas/index.html`. Veja `README_PUBLICACAO.md`.
- Backend em construção: o ZIP contém SQL inicial, configuração de conexão e scripts, mas não contém `backend/src/server.js`, rotas ou API de demandas; login e tempo real não estão completos.
- O CSS e JavaScript permanecem em `central-demandas/css` e `central-demandas/js`.
