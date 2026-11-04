# SUPABASE-007 — Validação real antes da publicação

## SUPABASE-020 — deploy autorizado e verificações de produção

Aplicação commit 4f96fa2703f1d0b105f95067ffa68fc8699059c4 enviada à main com Source verificado workflow/GitHub Actions. Execução 41843292760 concluída com success em todas as etapas, incluindo os 27 testes isolados do CI. Os testes isolados não são evidência de operação real; foram executados como requisito do workflow explicitamente autorizado nesta etapa.

Verificações realmente realizadas no site oficial: 133 recursos servidos HTTP 200/conteúdo correspondente ao pacote auditado, cinco caminhos privados 404; seis verificações anônimas com SDK real (proteção/URLs corretas, cinco tabelas negando SELECT sem sessão, invite/recovery sem sessão inválidos, zero erros JS). Nenhum mock nesses checks de produção. Evidências published-static-20261104.json e published-browser-20261104.json. Nenhuma mudança no design/app durante deploy.

Teste autenticado foi preparado no domínio publicado, Chrome admin/Edge funcionário em perfis dedicados, aguardando login manual sem senha no chat. Resultado production-real-20261104.json ainda waiting-for-login/sem demanda criada nesta atualização. Plano inclui criar com print, consultar PostgreSQL, imagem/zoom, RPCs e exclusão lógica sincronizada. Roteiro QA ajustado para base URL oficial, guards de papéis distintos e imagem; aplicação não modificada. Não afirmar login/criação/Reatime reais dessa rodada aprovados antes de concluir. Testes reais anteriores (17 entre papéis e inatividade manual) continuam históricos aprovados. SMTP/fluxo válido de e-mail não foi revalidado e QA12/13 pendentes de conferência.

## SUPABASE-019 — parâmetros de produção fornecidos

Site URL relatado coincide com endereço oficial. Redirect URL veio como raiz seguida de **; se literal /livre-escolha-demandas/**, abrange login e recuperação. Recomendada lista exata do guia. Templates relatados como padrão, sem links personalizados; Source não inspecionado. Compatibilidade do formato padrão é documentada, porém convite/recuperação válidos em produção ainda exigem verificação após deploy. Origem Pages relatada Deploy from a branch deve mudar para GitHub Actions antes do push.

Consultadas fontes oficiais de [redirects](https://supabase.com/docs/guides/auth/redirect-urls), [templates](https://supabase.com/docs/guides/auth/auth-email-templates), [SMTP](https://supabase.com/docs/guides/auth/auth-smtp) e [origem Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site). Serviço SMTP padrão tem destinatários restritos; configurar SMTP próprio para e-mail dos funcionários em produção. Nenhum e-mail enviado, template editado ou senha solicitada.

Reexecutados actionlint/scanner/verificador de artefato: aprovados, 149 fontes/134 públicos/zero padrões reais ou matches privados. Os testes reais anteriores não foram refeitos; aplicação/design/SQL/workflow preservados, sem mocks ou deploy. Evidência `.qa/supabase/config-producao-20261104.json` identifica dados do usuário e interpretação do glob; não é acesso independente ao painel. Backup de cinco documentos 2026-11-04_config-producao_eb403d76.

## SUPABASE-018 — bloqueio/restauração manual aprovado pelo proprietário

Em 04/11/2026 o proprietário confirmou execução do roteiro manual: funcionário inativo bloqueado, administrador manteve acesso, restaurar-funcionario.sql executado, funcionário voltou ao painel no Edge e ativo=true. Captura anexada da consulta específica de perfis confirma mesmo UUID do funcionário de teste, papel funcionario e ativo=true. Cinco verificações manuais registradas em `.qa/supabase/inativo-manual-20261104.json`, com fonte user_report/user_report_and_sql_screenshot; não executar/reclassificar o relatório automatizado antigo como aprovado.

Essa evidência resolve bloqueio/restauração pela interface. Não comprova testes diretos de RLS/Storage/RPC com sessão/JWT preservados sob inatividade; essa cobertura não foi executada pelo agente. Não há necessidade de desativar novamente a conta para registrar o resultado informado. Nenhuma conta foi alterada automaticamente, nada publicado e design preservado. Captura não confirma limpeza dos QA 12/13. Pendências de configuração real de Site URL/Redirect URLs/templates e origem GitHub Actions ainda aguardam resposta. Backup documental de cinco arquivos `2026-11-04_inativo-aprovado_4398a9de`, SHA-256/tamanhos conferidos.

## SUPABASE-017 — revisão em 04/11/2026

Evidências antigas preservadas, sem repetir a integração. `roles-real.json` permanece 17/17 aprovado; `release-real-final.json` não concluiu teste de inativo (waiting-for-deactivation), embora a recusa de finalização alheia esteja aprovada. Sessões CDP indisponíveis hoje; não há comprovação de processo aguardando ao vivo nem limpeza/restauração dos QA 12/13. Solicitar estado atual antes de qualquer UPDATE no perfil. Não usar `release-real-invalid-wait.json` como prova de inatividade ou brecha.

Novas verificações realmente executadas: GET Auth/settings HTTP 200, configuração pública correta e disable_signup=true; sync_pages; sintaxe JS; scanner de fontes/índice/valores locais em memória; actionlint 1.7.12; novo pacote público de 134 arquivos; seis casos em Chrome headless isolado com SDK real e servidor estático sob /livre-escolha-demandas/ (raiz/entrada organizada protegem e mantêm prefixo, URLs corretas, invite/recovery sem sessão recusados, callback de erro tratado/limpo, zero erros JS). Sem mocks ou envio de e-mail. Relatórios review-20261104.json/review-20261104-prefix.json.

Raiz/app/login de recuperação do domínio público respondem 200, mas HTML retornado não referencia os novos módulos Supabase. Isso não valida allowlist/templates ou nova aplicação publicada. Dados atuais do painel solicitados novamente. A [documentação oficial](https://supabase.com/docs/guides/auth/redirect-urls) exige correspondência com Redirect URLs e Site URL de produção. Fluxo completo de e-mail válido na nova versão não realizado antes do deploy.

149 fontes selecionadas auditadas e 202 arquivos rastreados, zero padrões reais/matches com dois valores privados locais comparados em memória; exceção exata de fixture sintético documentada no scanner. .env não rastreado e ignorado; índice sem alterações. Não é auditoria integral do histórico remoto nem garantia sobre segredos desconhecidos. Workflow local manual/main/boolean validado, nenhuma execução de CI/Actions/commit/push/publicação. CSS/hash preservados, nenhuma modificação funcional. Backup de cinco documentos 2026-11-04_revisao-final_e3f42b1f.

## SUPABASE-016 — pré-publicação em andamento

Funcionário tentou finalizar via RPC demanda criada/atribuída ao admin: recusa P0001, status andamento e responsável administrativo preservados. Primeira tentativa gerou 10/11 e testou a espera incorretamente antes da alteração manual; `release-real-invalid-wait.json` não comprova inatividade ou brecha. Foi corrigida a espera para consultar explicitamente ativo em polling fora de waitForFunction async e confirmar novamente antes de testar o JWT. 10/11 excluídas logicamente. Nova execução `.qa/supabase/release-real-final.json`, demandas 12/13, aguarda inativação real via `supabase/teste-inativo.sql`; restauração em arquivo específico e limpeza dessas duas previstas no finally após confirmação de ativo=true. Não houve UPDATE administrativo automático.

Seis verificações em `.qa/supabase/pages-prefix-real.json` aprovadas, SDK real/servidor estático sob /livre-escolha-demandas/: raiz e entrada organizada redirecionam visitante para login com prefixo; app/login URLs corretas; invite/recovery sem sessão válida recusados; callback de erro limpo/tratado; recursos sem erros JS/HTTP capturados. Nenhum e-mail enviado, link válido consumido ou login no site de produção. Site URL/Redirect URLs/templates do painel solicitados ao proprietário; ainda não confirmados.

Workflow validado por actionlint 1.7.12 oficial, SHA-256 conferido. Manual/main/confirmar_publicacao=true; input padrão false e auditoria adicionados, sem executar Actions. Scanner `verify-release.py` examinou árvore rastreada/novos não ignorados/seleção de 149 arquivos/índice Git, sem padrões reais ou matches aos dois segredos locais comparados em memória. Não imprime valores; exceção exata documentada somente para fixture explicitamente fictício de rejeição. Pacote estático 134 arquivos aprovado. Não foram usados mocks nos testes atuais nem reexecutados unitários sintéticos de CI.

Nenhuma alteração visual/aplicação/SQL de permissões. Backup principal 2026-11-03_pre-publicacao_15cbb2d3 de seis arquivos e suplemento do roteiro antes de corrigir espera, SHA-256/tamanhos conferidos. Instruções/limites/comandos em PUBLICACAO_FINAL.md; .release ignorada, sem staging/commit/push/publicação. Aguardando interação para os dois bloqueios reais acima; não apresentar como todos os testes aprovados.

## SUPABASE-015 — rodada real admin/funcionário aprovada

Rodada `QA_ROLES_99d04fab`, encerrada em 03/11/2026 às 17:36:56 (America/Sao_Paulo): **17 aprovados, zero falhas** em `.qa/supabase/roles-real.json`. Chrome e Edge dedicados com identidades diferentes e papéis reais admin/funcionario, ambos ativos; canal privado autorizado nos dois.

- Funcionário criou demanda exclusiva de teste 8 com PNG privado de 1.748 bytes. Card apareceu automaticamente nos dois; admin baixou o print autenticado, confirmando acesso entre funcionários autorizados.
- RPC excluir recusou funcionário nas demandas 8 e 9; na primeira, nova leitura confirmou demanda pendente preservada. UPDATE direto retornou 42501. Tentativa de atribuir ao admin foi recusada e responsável permaneceu null. Histórico apresentou criar/assumir/finalizar ao funcionário e recusou INSERT arbitrário com 42501.
- Funcionário assumiu para si e finalizou a demanda 8; consulta confirmou responsável, status e atualização automática do card do Chrome para Em andamento/Lançada.
- Demanda 9 criada pelo admin para disputa. Duas RPCs simultâneas em contas distintas: funcionário venceu, admin recebeu recusa, exatamente um sucesso e responsável do banco correspondeu ao vencedor. Admin finalizou a demanda atribuída ao funcionário; card do Edge atualizou para Lançada.
- Admin excluiu ambas; aviso privado recebido pelo Edge e cards removidos dos dois navegadores sem reload, busca/tipo/ordem/aba preservados e sentinelas intactas. Verificações completas em 2.011 e 2.262 ms (não são medidas isoladas de transporte). Consultas dos dois papéis ocultaram as excluídas; retenção e auditoria pós-exclusão dessas demandas não consultadas administrativamente.
- Sem erros JavaScript ou chamadas ao backend legado capturados após confirmar os papéis. Scanner de 134 arquivos e sintaxe do roteiro aprovados. Design/aplicação/SQL intocados.

Interrupções anteriores preservadas: primeiro aguardava Edge; depois Chrome sem sessão, login Chrome retornou funcionario e foi encerrado somente nesse perfil para entrada do admin correto. Chrome/Edge dedicados foram fechados novamente, causando roles-real-browser-closed.json, sem demanda criada na execução interrompida. Reabertos os mesmos perfis, recuperaram admin e funcionário e o teste prosseguiu. Probe preliminar employee-preflight.json confirmou recusa de excluir ID inexistente -1, sem escrita; não substitui a prova posterior sobre registro real.

Nenhum serviço simulado, chave secreta, conta criada, privilégio alterado, SQL administrativo executado ou deploy. Backup documental `2026-11-03_validacao-papeis_b871f01e` com quatro arquivos SHA-256/tamanhos conferidos. Atualizados estado/validação/README/histórico; script de testes da etapa 014 mantido nesta execução. Permanecem fora do escopo verificado: conta inativa, finalização por funcionário de demanda alheia, novos convites/recuperação, callbacks e site publicado. Signup desativado já confirmado na etapa 013, não modificado aqui.

## SUPABASE-014 — preparação do teste admin/funcionário

Proprietário informou funcionário ativo no Edge. Conexões dedicadas 9231/9232 estavam encerradas; reabertos perfis temporários já usados. Chrome recuperou admin, Edge dedicado abriu login. Solicitado login manual nessa janela específica, pois login em janela/perfil pessoal não é acessado pelo controlador. Sem coleta de senha/token e sem copiar sessões.

Novo roteiro `scripts/qa-supabase-roles-real.cjs` aguarda funcionário ativo real antes de criar duas demandas identificadas para testar recusa de exclusão, escrita direta, atribuição a terceiro, auditoria arbitrária, criação/print por funcionário, assumir/finalizar próprios, concorrência entre identidades distintas e Realtime dos dois papéis. Não declara testes passados antes da execução. Última evidência `.qa/supabase/roles-real.json`: waiting-for-employee, nenhuma check ou demanda criada. Falha de conexão inicial preservada em roles-real-launch.json. Sintaxe/scanner estático aprovados; nenhuma mudança no design, aplicação, SQL ou publicação. Resultado funcional depende da autenticação manual pendente no Edge dedicado.

## SUPABASE-013 — cadastro fechado e testes adicionais de permissão

Em 03/11/2026, após proprietário desativar signup, GET real de Auth/settings confirmou HTTP 200 com `disable_signup=true`. Não houve tentativa de criar conta anônima. Sessão ativa no Chrome permaneceu válida, dois canais joined. Consulta autenticada de papel/ativo retornou apenas um admin ativo visível; solicitado funcionário no Edge (sem senha no chat), ainda não autenticado nessa condição.

Roteiro `scripts/qa-supabase-security-real.cjs` executado sem mocks, resultado `.qa/supabase/security-real.json`: **11 aprovados, zero falhas**. Somente demanda identificada de teste 5 criada, finalizada e excluída logicamente:

- Signup desativado confirmado no serviço real.
- UPDATE direto negado com 42501 mesmo para admin (tentou apenas manter priority=Normal no registro exclusivo de teste, sem alterar estado se houvesse brecha).
- INSERT arbitrário em historico negado com 42501; nenhuma auditoria arbitrária aceita.
- Duas chamadas simultâneas reais de assumir tiveram exatamente um sucesso e uma recusa. Escopo: duas abas/conexões SDK da mesma conta admin, não funcionários distintos.
- Finalização por RPC e exclusão por RPC com Broadcast privado aprovado entre essas duas abas; nenhuma mudança em políticas/RPCs necessárias.
- Visitante redirecionado para login; cinco tabelas e RPC excluir recusando acesso sem sessão (consulta de ID inexistente -1 para não afetar dados).
- Sessão admin e dois canais únicos joined preservados; zero erros JavaScript no controlador autenticado.

Demanda 5 não inclui print; upload/download privado foi testado na etapa 012. Testes de funcionário/inativo/concorrência entre usuários, novos convites e callbacks de produção continuam pendentes de contas/interação. Nenhuma declaração de reteste dos dois navegadores nesta etapa: o teste Chrome+Edge aprovado é o da etapa 012. Aplicação/SQL/design preservados, nenhum deploy. Backup parcial de quatro documentos `2026-11-03_auth-permissoes_bdc4bec8`; roteiro novo e evidência registrados. Scanner do pacote de 134 arquivos aprovado novamente, sem padrões privados/dependências legadas.

## SUPABASE-012 — exclusão Realtime aprovada e revisão final real

Em 03/11/2026, após proprietário confirmar `Success. No rows returned` para 003:

- Execução `QA_SUPABASE_20261103_45932042`: 19 verificações aprovadas, zero falhas. Chrome e Edge em perfis independentes, mesma conta admin autenticada manualmente. Criada apenas demanda identificada de teste 4; criação/consulta, PNG privado, acesso público negado, três RPCs e histórico antes da exclusão aprovados. INSERT/atribuição reais recebidos.
- Aviso privado da exclusão recebido em 577 ms, payload sem campos de negócio. Supabase acrescenta UUID da mensagem em `id` (não é o bigint da demanda), comportamento confirmado no [código oficial](https://github.com/supabase/realtime/pull/1385). Verificação de remoção dos dois cards concluída em 3.410 ms, sem reload, com sentinelas de página e busca/tipo/ordem/aba preservados. Anônimo explicitamente recusado com Unauthorized no tópico. Não confundir essa recusa esperada com o erro anterior da identidade autenticada.
- Primeiro reteste após aplicação (demanda 3) já recebeu aviso, porém a expectativa equivocada de payload totalmente vazio falhou. Relatório original preservado em `.qa/supabase/realtime-003-aplicada.json`; corrigido somente roteiro para validar UUID técnico e proibir demais campos. Evidência aprovada em `.qa/supabase/realtime-003-validacao-final.json`.
- Revisão final `.qa/supabase/final-real.json`: 9 verificações aprovadas/1 pendência. Sessão restaurada após recarga, dois canais únicos joined (confirmados novamente após 4 s), demandas excluídas 1–4 invisíveis sob RLS, redirecionamento de visitante, leitura das cinco tabelas recusada anonimamente, logout real no Edge sem canais, Chrome mantendo sessão independente. Sem erros JavaScript/chamadas legadas na página revisada. Responsividade sem overflow em 1366/768/390/320 px; captura mobile inspecionada.
- **Pendência de configuração:** GET real de Auth/settings retornou HTTP 200 e `disable_signup=false`. Não foi criada conta para testar signup; a configuração foi consultada diretamente. Solicitada desativação pelo painel, sem pedir chaves privadas. Até confirmação/reconsulta, não considerar segurança totalmente validada.
- Não exercitados nesta etapa: contas reais de funcionário/inativo, bloqueio de exclusão por funcionário, concorrência entre funcionários, convite/recuperação novos, callbacks em produção e site publicado. Retenção/histórico após exclusão da demanda 4 não visíveis ao cliente por RLS; comprovação administrativa anterior é da demanda 1, não da 4. Nenhuma alegação de auditoria pós-exclusão desta rodada.

Design/aplicação/SQL intocados nesta retomada. Somente roteiro real, novo roteiro de revisão e documentação alterados. Scanner do artefato (134 arquivos, zero padrões privados e dependências legadas), sync_pages e sintaxe aprovados. Nenhum mock, backend legado, SQL pelo agente, commit, push ou publicação. Edge ficou deslogado após teste de logout; Chrome preservado autenticado. Backup parcial `2026-11-03_validacao-003_a14f893d`, sete arquivos anteriores conferidos por tamanho/SHA-256.

## SUPABASE-011 — instalação de 003 ausente no diagnóstico

JSON fornecido pelo proprietário em 03/11/2026: funcao_aviso=null, trigger_exclusao=null, politicas_realtime=null, quatro privilégios básicos authenticated=true e zero avisos nos últimos 30 minutos. Os objetos da migração 003 não estão instalados no banco consultado; não é necessário inventar novas permissões. Arquivo 003 conferido, sem edição. Solicitada execução integral pelo proprietário no projeto correto, seguida de sucesso/erro. Evidência registrada em `.qa/supabase/diagnostico-003-ausente.json` e identificada como resultado do usuário. Nenhum novo teste funcional, execução de SQL ou publicação nesta etapa. Reteste real da exclusão continua pendente.

## SUPABASE-010 — reteste real em Chrome e Edge

Execução `QA_SUPABASE_20261103_3f4f3aff`, em 03/11/2026, com login manual em dois navegadores/perfis independentes da mesma conta admin. Quinze verificações aprovadas: login/perfil e consulta, autenticação do segundo navegador, conexão inicial dos dois canais, criação/consulta da demanda 2, INSERT e card no observador, PNG privado de 13.028 bytes com download autenticado e acesso público recusado (400), assumir/UPDATE, finalizar, histórico de três ações e excluir com ausência da fila. Atualização de finalização também registrada em `__realQaEvents`.

Falhou o aviso privado de exclusão: timeout de 15 s. A conexão privada inicialmente joined não permaneceu autorizada. Inspeção posterior do WebSocket em nova aba capturou resposta de entrada com status error e motivo `Unauthorized: You do not have permissions to read from this Channel topic: livreescolha-demandas-invalidate`. Cards ausentes depois não comprovam aviso, pois há reconsulta de 45 s/visibilidade. Verificação final de preservação de filtros/removal sem reload e teste anônimo não chegaram a executar. Não há aprovação da correção Realtime.

Resultado em `.qa/supabase/realtime-exclusao-dois-navegadores.json`; preservado relatório anterior. Criada consulta somente leitura `supabase/diagnosticar_canal_privado.sql`, aguardando resultado para verificar instalação de 003/privilégios sem inventar permissões. O JSON reenviado pelo proprietário confirma demanda 1/auditoria antiga, mas não contém trigger nem políticas de realtime.messages. Nenhuma nova migração aplicada pelo agente. Design e aplicação intocados nesta retomada; nenhuma publicação ou serviço simulado. Contas de funcionário/inativo, concorrência e retenção SQL da demanda 2 continuam sem verificação nesta execução.

## SUPABASE-009 — causa confirmada e correção preparada

O proprietário executou a consulta administrativa e forneceu o resultado. A demanda de teste **1 permanece no banco**, lançada e excluída logicamente em `2026-11-03T18:57:12.372823+00:00` (15:57:12 em America/Sao_Paulo). O histórico retém **criar, assumir, finalizar e excluir**. A função de excluir apenas atualiza timestamp/versão e grava a auditoria. Não houve remoção física. O campo inicialmente presumido no runner agora está respaldado pelo SQL administrativo fornecido para esse registro.

As políticas explicam o resultado: SELECT de demandas exige `excluido_em IS NULL`; SELECT de histórico exige demanda ainda ativa. Assim que a RPC exclui, a linha deixa de ser legível pela identidade autenticada. Postgres Changes respeita essa autorização e não entrega a nova linha excluída. O bloqueio deve continuar; não foram abertos privilégios sobre registros/auditorias excluídos. Resumo do diagnóstico em `.qa/supabase/exclusao-confirmada-pelo-sql.json`, identificado como informação fornecida pelo proprietário.

### Correção incremental

- `supabase/migrations/003_realtime_exclusao_privada.sql` adiciona um trigger AFTER UPDATE da transição `excluido_em NULL → não NULL`. Ele chama `realtime.send` com payload **{}**, evento `invalidate` e tópico privado `livreescolha-demandas-invalidate`, dentro da transação existente.
- Não substitui a RPC `excluir_demanda`, não altera políticas de demandas/histórico, não modifica dados existentes nem publica conteúdo de linha. O trigger fica em `private`, SECURITY DEFINER, com search_path vazio e sem permissão de execução pelo navegador.
- RLS de `realtime.messages`: SELECT específico para identidade autenticada ativa nesse tópico/extensão broadcast; política restritiva protege esse tópico mesmo diante de outra política permissiva existente. INSERT de cliente nesse tópico é negado por política restritiva; não se concede escrita em mensagens ou tabelas de negócio. Os demais tópicos não têm sua autorização modificada.
- O JavaScript mantém o canal postgres_changes existente e adiciona um único canal privado distinto. Ao receber o aviso vazio, executa a mesma sincronização já aprovada, revalidando perfil/RLS. Reconexões também disparam reconsulta. Os dois canais são removidos no logout/pagehide. Mantido fallback e comportamento de filtros/aba/modais.

### Estado de aplicação e testes

**SQL 003 ainda não aplicado pelo agente.** Solicitada sua execução pelo proprietário no SQL Editor; publishable key e perfil admin da aplicação não concedem acesso DDL. Nenhuma Secret key solicitada. Não reexecutar 001/002, já aplicadas pelo proprietário. Recarregar as abas após aplicar 003.

O adaptador fonte e a cópia em `.pages-build/` foram atualizados e têm SHA-256 idêntico. A cópia anterior foi incluída no backup. Servidor continua sendo Python estático; nada publicado. Sintaxe JS/runner e verificador do pacote público/sync_pages aprovados. Uma falha inicial de sintaxe no runner foi corrigida antes de executá-lo. Fixtures de CI foram ajustadas para os dois canais, mas **nenhum teste com serviços simulados foi executado nesta correção**, respeitando a solicitação.

O roteiro real `qa-supabase-real.cjs` agora exige o canal privado conectado antes de criar uma nova demanda de teste, verifica aviso vazio após excluir, remoção do card na segunda aba com busca/tipo/ordem/aba preservados e sem recarga, além de recusa explícita de identidade anônima no tópico. Usar `QA_RESULTS_FILE=realtime-exclusao-results.json` para preservar o resultado anterior de 13 aprovações/uma falha. **Esses testes novos ainda não foram executados; dependem da aplicação do SQL.** Não apresentar resultados sintéticos ou antigos como validação da correção.

Controladores anteriores foram encerrados após a falha, preservando Chrome independente e sessão, para não misturar relatórios. Backup preventivo desta etapa: `2026-11-03_realtime-exclusao_19ce61be`, 11 arquivos existentes com tamanho/SHA-256 conferidos; novos SQL/evidências registrados. Interface, CSS, backend, PostgreSQL local e dados existentes preservados. Reversão exige novo backup e retirada apenas dos trechos desta etapa; não executar rollback SQL automaticamente nem apagar mensagens/demandas/histórico.

Referências de implementação: [Broadcast do banco](https://supabase.com/docs/guides/realtime/broadcast) e [autorização Realtime/RLS](https://supabase.com/docs/guides/realtime/authorization). Os resultados anteriores e o histórico da investigação seguem abaixo.

## Continuação SUPABASE-008 — login e testes reais executados

O proprietário recuperou a senha e entrou na janela de validação. O roteiro confirmou **perfil ativo admin**, consulta autenticada e **13 verificações reais aprovadas**, com uma falha de evento Realtime na exclusão. Nenhum mock utilizado ou publicação realizada.

Execução `QA_SUPABASE_20261103_50eee23d`, demanda de teste **1**:

- Cadastro com print PNG real, 13.307 bytes, registrado no bucket privado e em `anexos`.
- Consulta PostgreSQL confirmou status inicial e `criado_por` da conta autenticada.
- Segunda aba recebeu INSERT real e exibiu o card.
- Download autenticado do print funcionou; endpoint público foi recusado com HTTP 400.
- RPC `assumir_demanda` mudou para andamento e atribuiu à conta autenticada; evento real de atribuição recebido.
- RPC `finalizar_demanda` mudou para lançada. A inspeção posterior também encontrou o evento UPDATE/lancada no observador.
- Histórico retornou três eventos reais: criar, assumir e finalizar.
- RPC `excluir_demanda` respondeu com sucesso e o registro saiu da fila ativa.
- **Falha:** o observador não recebeu o evento de exclusão em 15 segundos. Recebeu INSERT/pendente, UPDATE/pendente (anexo), UPDATE/andamento e UPDATE/lancada, sem evento com `excluido_em` preenchido.

Após excluir, a mesma conta admin não viu a demanda nem o histórico pelas consultas autenticadas. Isso é compatível com RLS que oculta registros excluídos, mas **a definição da função/políticas e a retenção física ainda dependem da consulta administrativa de leitura**. O roteiro inicialmente tinha um campo `physicalDeletion:false` baseado no contrato declarado da RPC; esse campo não constituiu verificação no banco. O código foi corrigido para registrar `databaseRetentionVerified:false`. Não afirmar retenção física a partir apenas da ausência na fila.

Preparado `supabase/diagnosticar_exclusao_realtime.sql`, somente leitura e limitado à função/políticas relevantes e demanda de teste 1. Solicitado o JSON ao proprietário, sem repetir o pedido de esquema completo nem solicitar chave secret. Nenhuma política foi alterada, nenhum registro adicional criado e nenhum SQL de correção aplicado nesta continuação. A demanda de teste já não aparece na fila; a confirmação de retenção de histórico/anexo deve ser feita pelo diagnóstico.

Evidência: `.qa/supabase/real-results.json`. A segunda aba usa a mesma identidade: permissões de funcionário, conta inativa e concorrência entre pessoas continuam sem teste. Recuperação de senha foi realizada pelo proprietário e login foi observado pelo roteiro; não foram coletadas credenciais nem tokens.

Backup desta retomada: `2026-11-03_retomada-real_a5334f79`, seis arquivos anteriores com SHA-256 conferidos. Design/arquivos da aplicação permanecem sem alterações nesta validação. O texto abaixo preserva o diagnóstico inicial 007, superado pelos resultados desta seção.

03/11/2026, America/Sao_Paulo. **Sem publicação, mocks ou uso do backend antigo.**

## Executado nesta etapa

- Project URL conferida no arquivo público: `https://nxqqcdddbhezuvhpemge.supabase.co`.
- Configuração contém publishable key; endpoint real `/auth/v1/settings` respondeu HTTP 200. Nenhuma Secret key/service_role utilizada. A chave não foi repetida nos relatórios.
- `disable_signup` ainda retornou `false`. A desativação de cadastro público continua sendo uma configuração administrativa pendente antes do uso operacional.
- `sync_pages.py --check` e verificador do pacote público aprovados. Não foram reexecutados testes simulados.
- Servidor **Python estático**, bind somente em `127.0.0.1:8000`, servindo `.pages-build/`. HTML, login, CSS, configuração e adaptador responderam HTTP 200; `/backend/.env` respondeu 404. Nenhum backend Express/Socket.IO iniciado.
- Migrações 001/002 executadas com sucesso **conforme informado pelo proprietário**. O agente não reaplicou SQL nem acessou o PostgreSQL local.
- Login manual tentado pelo proprietário no Chrome dedicado, usando os serviços reais: Supabase respondeu **HTTP 400, `invalid_credentials`, `Invalid login credentials`**. A falha acontece em `/auth/v1/token`, antes de consultar perfil/RLS de demandas. Não é possível comprovar a senha ou a existência da conta usando apenas a mensagem genérica.

## Situação atual

**Login autenticado ainda não confirmado.** O roteiro está preparado para continuar após uma tentativa válida, sem obter a senha pelo chat. Nenhuma demanda/cliente/anexo foi criado até o diagnóstico inicial. Consultar `.qa/supabase/real-results.json` para o estado atualizado da execução, que pode avançar após a interação do proprietário.

Credenciais da aplicação correspondem ao usuário em **Authentication → Users** deste projeto. Confirmar a existência da conta e usar sua senha Supabase. Não enviar senha, access_token, refresh_token, cookies ou sessionStorage ao chat.

Se for necessária recuperação local:

1. No Dashboard Supabase → Auth → URL Configuration, adicionar à allowlist `http://127.0.0.1:8000/central-demandas/login.html?mode=recovery` e o login local sem query. Manter a Site URL de produção existente.
2. Na página local, preencher o e-mail correto e clicar **Esqueci minha senha**. Essa ação deve ser feita pelo proprietário; nenhum e-mail de recuperação foi disparado automaticamente pelo roteiro.
3. Abrir o link recebido, definir/confirmar senha e retornar ao login local. Se houver erro de envio/link, informar somente a mensagem e manter a janela aberta para diagnóstico sanitizado.

## Roteiro real após autenticar

`scripts/qa-supabase-real.cjs` usa Playwright apenas como controlador do Chrome; **não é servidor nem simula Supabase**. O HTML é servido exclusivamente pelo Python. A instrumentação registra apenas status/códigos de respostas com erro e omite e-mails/URLs; não lê corpos de requisições nem respostas de sucesso que contenham tokens. Nenhum HAR, storageState ou dump de sessões é exportado para o repositório.

O roteiro:

1. Confere perfil ativo real e consulta a fila pelo adaptador.
2. Abre uma segunda aba com a mesma conta e inscreve um canal real de `postgres_changes` filtrado pelo marcador exclusivo do teste.
3. Cria uma demanda identificada `QA_SUPABASE_...`, sem representar cliente real, com um PNG de teste gerado em memória e enviado ao bucket real.
4. Consulta o registro pelo ID, confere `criado_por`, metadados em anexos, download autenticado e negação do endpoint público de Storage.
5. Confere recebimento do INSERT pelo canal real e atualização do card na segunda aba. O canal de verificação é independente do polling da interface.
6. Chama assumir/finalizar para a própria conta autenticada, consulta status/responsável no banco e histórico automático.
7. Executa exclusão **lógica somente da demanda desta execução**, confere saída da fila e evento real de exclusão lógica. Mantém histórico/anexo; não apaga objetos ou dados de clientes.

Os registros de teste usam os serviços reais; não são testes de produção com contas/serviços simulados. A segunda aba usa a mesma identidade: isso não comprova permissões entre funcionário e administrador nem concorrência entre duas pessoas.

## Dependências de interação e testes ainda pendentes

| Teste | Situação no diagnóstico inicial |
| --- | --- |
| URL/chave pública e Auth alcançável | Executado, HTTP 200 |
| HTML/CSS/JS estáticos e exclusão do .env | Executado, 200/404 esperados |
| Tentativa de login real | Executada, rejeitada com invalid_credentials |
| Login válido/perfil ativo | Depende de autenticação manual válida |
| Criar/consultar demanda autenticada | Não executado; depende do login |
| RPCs de assumir/finalizar/excluir | Não executadas; dependem do login |
| Upload/metadados/download privado | Não executados; dependem do login |
| Eventos Realtime e segunda aba | Não executados; dependem do login |
| Contas de funcionário, RLS entre pessoas e concorrência | Exigem contas/sessões adicionais; não cobertos pela mesma conta |
| Recuperação/convite por e-mail | Não executados automaticamente |

## Preservação e operação local

Nenhum arquivo da interface/design foi alterado nesta validação. Preparação anterior preservada. Backup documental `2026-11-03_validacao-real_e70ae429` contém estado/histórico/relatório anteriores, com SHA-256 conferidos; roteiro e evidências desta etapa são novos. Para desfazer documentação, criar novo backup e retirar apenas a seção desta etapa. Não reverter banco nem apagar dados automaticamente.

O navegador de diagnóstico usa perfil temporário independente e CDP restrito a loopback; ele deve ser fechado ao concluir. O Python permanece como processo local separado. O roteiro pode ser iniciado com `QA_CDP_URL=http://127.0.0.1:9231` para acompanhar esse navegador já aberto. Não use um navegador com outro trabalho pessoal como alvo do roteiro.

Primeira preparação do controlador: tempo de espera corrigido no roteiro; janela original fechada antes da autenticação. A nova janela foi iniciada independentemente do controlador. Essas ocorrências não são testes aprovados de login.

Referência: [códigos de erro de Auth — Supabase](https://supabase.com/docs/guides/auth/debugging/error-codes). O diagnóstico invalid_credentials acima foi obtido da resposta real desta execução.
