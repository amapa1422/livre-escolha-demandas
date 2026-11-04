# Publicação no GitHub Pages — Central de Demandas

**SUPABASE-020 — publicado em 04/11/2026:** [site oficial](https://amapa1422.github.io/livre-escolha-demandas/), aplicação `4f96fa2`, [Actions aprovado](https://github.com/amapa1422/livre-escolha-demandas/actions/runs/41843292760). Source=GitHub Actions confirmado por API. 133 recursos publicados correspondem ao pacote auditado; arquivos privados 404; seis verificações anônimas reais aprovadas. Teste autenticado em produção aguarda login manual nas janelas dedicadas; não afirmar essa parte aprovada ainda. Resultado e limitações em [RELATORIO_PUBLICACAO.md](_CONTROLE_PROJETO/RELATORIO_PUBLICACAO.md). Design preservado, publicação executada com autorização explícita.

**SUPABASE-020 — publicação autorizada em 04/11/2026, em execução:** proprietário confirmou três Redirect URLs cadastrados e autorizou commit/push/workflow. API autenticada confirmou Source=GitHub Actions (`build_type=workflow`). Main local alinhada à remota antes do envio; 27 testes isolados de CI aprovados, scanner/actionlint/sync/pacote final de 134 arquivos aprovados. Nenhuma mudança no design. Resultado do deploy e testes no site serão registrados após execução; esta entrada ainda não afirma publicação concluída. Credenciais privadas e artefatos QA/backups fora da seleção de commit.

**SUPABASE-019 — parâmetros de produção recebidos:** Site URL correto; redirect com ** cobre callbacks se literal, preferir URLs exatas do [guia vigente](_CONTROLE_PROJETO/PUBLICACAO_FINAL.md). Templates padrão podem permanecer. **Mudar Pages Source de Deploy from a branch para GitHub Actions antes de push** e preparar SMTP próprio para convites/recuperação dos funcionários em produção. Código/workflow/seleção local aprovados, 149 fontes/134 públicos sem credenciais reais detectadas. Nada foi publicado; nenhuma alteração do design ou da aplicação.

**SUPABASE-018 — inatividade/restauração aprovada em 04/11/2026:** proprietário confirmou bloqueio do funcionário, manutenção do acesso admin, restauração SQL e retorno do funcionário ao painel. Captura confirma papel funcionario/ativo=true no perfil de teste. Resultado manual real registrado; não é reteste automatizado de RLS/Storage/RPC sob inatividade. Os 17 testes entre papéis e validações locais anteriores permanecem aprovados. Falta confirmar no painel os callbacks/templates de produção e origem Pages=GitHub Actions; limpeza QA 12/13 pendente operacional. Aplicação/design preservados, nenhum commit/push/deploy. Guia vigente: [PUBLICACAO_FINAL.md](_CONTROLE_PROJETO/PUBLICACAO_FINAL.md).

**SUPABASE-017 — revisão de 04/11/2026:** integração preservada; URL/chave públicas aceitas pelo Auth real (200), signup desativado. Sync/sintaxe/scanner/actionlint/build e seis casos de prefixo com SDK real aprovados novamente. Manifesto de 149 fontes e pacote de 134 arquivos preparados; índice ainda vazio, sem commit/push/deploy. Os 17 testes entre papéis permanecem aprovados. **Falta comprovar inatividade/restauração e limpar/conferir QA 12/13, confirmar Site URL/Redirect URLs/templates reais e origem GitHub Actions no painel.** Consulte o guia vigente [PUBLICACAO_FINAL.md](_CONTROLE_PROJETO/PUBLICACAO_FINAL.md). A espera de inativação registrada ontem não significa roteiro ainda ativo hoje; sessões dedicadas indisponíveis. Nenhuma alteração da aplicação/design nesta revisão.

**SUPABASE-016 — preparação final em andamento:** use [PUBLICACAO_FINAL.md](_CONTROLE_PROJETO/PUBLICACAO_FINAL.md) para revisar o pacote e os comandos. Workflow manual exige `main` e `confirmar_publicacao=true`, aprovado no actionlint 1.7.12; nenhum workflow disparado. Scanner auditou seleção de 149 arquivos, arquivos rastreados/novos e índice Git, sem padrões de credenciais reais ou correspondências aos dois valores privados locais comparados em memória. Pacote público de 134 arquivos aprovado; seis verificações locais reais sob `/livre-escolha-demandas/` aprovadas. Funcionário impedido por RPC de finalizar caso do admin, estado/responsável preservados. **Aguardando inativação específica e configuração real dos callbacks do painel.** Não liberada/publicada. Seguir o guia atual; não usar publicação histórica por branch.

**SUPABASE-015 — testes reais entre papéis aprovados:** Chrome/admin e Edge/funcionário com identidades distintas, 17 verificações aprovadas. Funcionário criou demanda com print, assumiu/finalizou para si e leu histórico; exclusão, atribuição a outro e escritas diretas indevidas recusadas. Disputa entre as duas contas teve uma vencedora e responsável correspondente. Admin excluiu as duas demandas de teste e cards sumiram dos dois sem reload/filtros alterados. Evidência `.qa/supabase/roles-real.json`; detalhes/limites em VALIDACAO_REAL_SUPABASE. As esperas por login descritas abaixo foram resolvidas. Não publicado. Restam testes de conta inativa, finalização de caso alheio por funcionário, convites/callbacks de produção.

**SUPABASE-014 — testes entre papéis em preparação:** proprietário informou funcionário ativo. Roteiro real específico preparado, aguardando login do funcionário no Edge dedicado reaberto; Chrome recuperou admin. Nenhum novo teste entre papéis aprovado ou dado criado até essa espera. Resultados dinâmicos em `.qa/supabase/roles-real.json`. Não publicar ainda.

**SUPABASE-013 — atualização de segurança em 03/11/2026:** após alteração pelo proprietário, Auth/settings real confirmou `disable_signup=true` (HTTP 200). Onze novas verificações reais aprovadas, incluindo bloqueio de UPDATE direto/auditoria arbitrária (42501), uma única vencedora em duas tentativas simultâneas de assumir, finalização/exclusão por RPC com aviso privado, proteção de página e recusa anônima nas cinco tabelas/RPC. Concorrência nesta rodada usa duas conexões da mesma conta admin; não substitui teste entre funcionários. A pendência anterior de cadastro público está resolvida. Permanecem contas de funcionário/inativo e callbacks de produção. Nenhuma publicação realizada; detalhes e limites em VALIDACAO_REAL_SUPABASE.

**SUPABASE-012 — resultado real de 03/11/2026:** proprietário confirmou aplicação de 003. Teste real com Chrome e Edge independentes aprovado: 19 verificações, demanda de teste 4, aviso privado recebido em 577 ms, card removido dos dois sem reload e filtros/aba preservados (verificação concluída em 3.410 ms). Anônimo recusado no tópico. Criação/consulta/RPCs/histórico/print privado aprovados. Nenhuma publicação realizada. Detalhes em [VALIDACAO_REAL_SUPABASE.md](_CONTROLE_PROJETO/VALIDACAO_REAL_SUPABASE.md).

**Ainda não liberar como validação completa de segurança:** Auth/settings retornou `disable_signup=false` na revisão final; desativar cadastro público pelo painel e conferir novamente. Falta exercitar contas reais de funcionário/inativo, concorrência entre funcionários e callbacks de produção. Sessão restaurada, logout no Edge, independência do Chrome, proteção de páginas, recusa de leitura anônima nas cinco tabelas e responsividade em quatro larguras passaram. Migrações 001/002/003 já aplicadas conforme proprietário; as instruções anteriores de execução abaixo são históricas. Não reaplicar banco legado nem executar migrations às cegas.

**SUPABASE-009 — correção da exclusão Realtime:** o diagnóstico administrativo confirmou exclusão lógica e histórico preservado. A política que exige `excluido_em IS NULL` impede o evento de chegar por postgres_changes após excluir. O JavaScript agora também escuta um aviso privado e vazio de atualização. **Executar somente a nova [migração 003](supabase/migrations/003_realtime_exclusao_privada.sql)** no SQL Editor (001/002 já aplicadas conforme informado), recarregar as abas e concluir o teste real antes de publicar. A migração não muda as políticas de demandas/histórico nem a RPC de excluir. Sem publicação nesta tarefa.

## Versão atual — SUPABASE-006 — 03/11/2026

A fonte `central-demandas/` agora usa Supabase Auth/PostgreSQL/Storage/Realtime em HTTP, sem Express ou Socket.IO. A raiz continua gerada por `sync_pages.py`. Design e CSS do painel preservados. Backend antigo mantido em `backend/`; cinco arquivos do front-end Express estão preservados em `backend/legacy-frontend/`. Não use o iniciador Node para servir a nova versão: o servidor legado exige suas próprias sessões e CSP. Para testar a versão nova, sirva a raiz estaticamente, por exemplo `python -m http.server 8000`, e abra `http://localhost:8000/`. Abertura `file://` continua local e independente, sem importar registros.

**A integração foi validada localmente com conta Supabase real de administrador; ainda não foi publicada.** Antes do uso operacional:

1. Migrações 001, 002 e 003 já aplicadas pelo proprietário. Não executar `backend/migrations/001_initial.sql`. Nenhum SQL foi aplicado automaticamente pelo agente.
2. Em Auth → Sign In / Providers → Email (a localização pode variar no painel), **desativar o cadastro de novos usuários/Allow new users to sign up**. A consulta pública de configurações retornou `disable_signup: false`; a ausência de formulário no site não desativa o endpoint público.
3. Em Auth → URL Configuration, definir Site URL `https://amapa1422.github.io/livre-escolha-demandas/` e permitir os callbacks exatos:
   - `https://amapa1422.github.io/livre-escolha-demandas/central-demandas/login.html`
   - `https://amapa1422.github.io/livre-escolha-demandas/central-demandas/login.html?mode=recovery`
   - `https://amapa1422.github.io/livre-escolha-demandas/central-demandas/login.html?mode=invite`
4. Conferir que `prints-demandas` continua privado, aceita PNG/JPEG/WebP até 1 MB e autoriza upload em `UID/ID/arquivo.ext`. A função nova registra somente objetos existentes desse caminho; não torna o bucket público.
5. Validar os acessos reais e a matriz de RLS/concorrência/Realtime descrita no [relatório](_CONTROLE_PROJETO/RELATORIO_SUPABASE.md). Não foram solicitadas senhas nem chaves administrativas.

A Project URL correta e a publishable key fornecidas já estão em `central-demandas/js/supabase-config.js`. Somente esses dois valores são públicos; nunca incluir Secret key, service_role ou `.env`. O SDK está fixado em 2.118.0 e é carregado por HTTPS pelo jsDelivr.

### Publicar com artefato estático

1. Gerar/verificar: `python sync_pages.py` e `python sync_pages.py --check`.
2. Testar: `node --test --test-isolation=none scripts/test-supabase-*.cjs`.
3. Revisar e enviar ao GitHub somente os arquivos selecionados. Não houve commit/push nesta tarefa.
4. No GitHub → Settings → Pages, escolher **GitHub Actions**. O workflow `.github/workflows/pages.yml` é manual: executar **Actions → Publicar Demandas no GitHub Pages → Run workflow** depois de concluir a configuração do Supabase. Ele testa, empacota e publica apenas HTML/CSS/JS/catálogo/logos.

Para revisar o pacote localmente: `python scripts/build-pages.py .pages-build`. O destino deve estar vazio ou não existir; o empacotador não apaga arquivos. O pacote criado nesta tarefa está em `.pages-build/`, ignorado pelo Git. Não contém backend, SQL, QA, backups, `.env` ou HTML monolítico. Os caminhos funcionam sob `/livre-escolha-demandas/`.

### Cadastrar novos funcionários

Pelo Dashboard administrativo do Supabase Auth, **convidar por e-mail**, com redirect para o login com `?mode=invite` quando disponível. A trigger existente cria o perfil vinculado ao UUID de Auth. Conferir em `public.perfis` que nome, `ativo` e `papel` estão corretos; alterações de privilégios são feitas apenas no ambiente administrativo confiável. Felipe permanece admin; demais funcionários usam `funcionario`. O site não possui cadastro público nem edição de perfis. Para desativar acesso, marcar `ativo = false` pelo painel; o banco deve negar operações imediatamente pelas políticas e o front-end revalida o perfil em cada sincronização/operação. Não usar `backend/scripts/user-add.js` para criar usuários Supabase.

O link de convite abre a definição/confirmação de senha. Recuperação usa **Esqueci minha senha**. Preservar templates com `ConfirmationURL` ou apontar templates `token_hash` ao login com `?token_hash=...&type=invite`/`recovery`; não incluir tokens em commits ou relatórios.

### Reversão

Backup desta integração: `_CONTROLE_PROJETO/backups/2026-11-03_supabase-integracao_9a16bd72/`, com manifesto e suplementos conferidos. Criar novo backup antes de reverter e aplicar somente as diferenças desejadas, preservando trabalho posterior. Não apagar dados ou reverter banco automaticamente. Consulte `_CONTROLE_PROJETO/INSTRUCOES_REVERSAO.md`.

## Histórico de publicação — registros anteriores superados acima

**SUPABASE-005 — 03/11/2026:** configuração pública preenchida e RPCs preparadas em módulo isolado. A URL fornecida não resolve no DNS; faltam sua confirmação e as definições de colunas/políticas para concluir o adaptador. O site ainda usa Node.js; não publicar esta etapa como migração concluída. Veja o [relatório atualizado](_CONTROLE_PROJETO/RELATORIO_SUPABASE.md).

**SUPABASE-004 — 03/11/2026: preparação, ainda sem migração operacional.** Configuração pública e cliente isolado estão em `central-demandas/js/supabase-*.js`, sem ativação nos HTMLs. Para continuar, fornecer Project URL, publishable key e o resultado de `supabase/inspecionar.sql` (somente leitura). O esquema/RLS remoto não está disponível localmente. A aplicação atual ainda depende do Node.js; preencher o arquivo de configuração não muda esse comportamento. Consulte [relatório e próximos passos](_CONTROLE_PROJETO/RELATORIO_SUPABASE.md).

**Atualização BACKEND-003, 30/10/2026:** o sistema integrado agora é iniciado por `npm.cmd start` dentro de `backend/`, em `http://127.0.0.1:3000`. Login, API, PostgreSQL e Socket.IO dependem desse servidor; GitHub Pages/Live Server não os executam. Não publique a aplicação operacional como se fosse apenas um site estático. As instruções históricas de geração abaixo continuam válidas para sincronizar HTML/catálogo, mas não substituem a execução do backend. Abertura `file://` mantém o modo local anterior, com dados independentes. Veja [backend/README.md](backend/README.md).

**Fonte de verdade do front-end:** `central-demandas/index.html`, `central-demandas/css/style.css` e `central-demandas/js/app.js`.

**Entrada para GitHub Pages:** `index.html` na raiz. É gerada pelo `sync_pages.py`, com caminhos de CSS/JS/catálogo ajustados para `central-demandas/...`. **Não edite os dois HTMLs manualmente**: altere a versão de `central-demandas/` e execute o script. A geração é sempre da fonte principal para a raiz, nunca no sentido inverso.

**Catálogo canônico:** `central-demandas/assets/clientes/clientes.json`. O mesmo script gera `catalogo.js` a partir do JSON, permitindo uso local por `file://` sem fetch/CORS. A aplicação resolve logos em relação ao próprio `app.js`, incluindo o prefixo do repositório. Ao atualizar empresas, edite o JSON e gere novamente; não mantenha duas listas manualmente.

## Após cada mudança na interface

1. Altere arquivos em `central-demandas/`.
2. Rode `python sync_pages.py` na raiz `Demandas/`.
3. Rode `python sync_pages.py --check`.
4. Teste o `index.html` da raiz por um servidor local (por exemplo, Live Server), verificando Estilos, Console e Rede.
5. Revise os arquivos selecionados, faça commit e publique conforme o fluxo do repositório. Inclua os dois arquivos gerados e as logos referenciadas; exclua segredos, originais privados e temporários.

`--check` falha se as saídas estiverem desatualizadas, faltar CSS/JS/logo, houver IDs/nomes duplicados ou caminhos locais inválidos. Funciona sem bibliotecas externas; Python 3 é necessário apenas para geração/verificação, não para abrir o site. Nesta máquina, a validação utilizou um Python temporário isolado, pois o comando `python` do sistema aponta para o instalador da Microsoft Store.

## Resultado local de 30/10/2026

Raiz, `central-demandas/index.html`, `/livre-escolha-demandas/index.html` e `/livre-escolha-demandas/central-demandas/index.html` foram exercitados em servidor local com CSS, JS, catálogo e imagens. Abertura direta da raiz por arquivo também passou. A nova versão ainda não foi enviada ao remoto nem implantada; esse teste local não comprova o deploy hospedado. Consulte `_CONTROLE_PROJETO/RELATORIO_LOGOS_PAGES.md`.

No GitHub: **Settings → Pages → Deploy from a branch → main → /(root)**.

Site: `https://amapa1422.github.io/livre-escolha-demandas/`.

### Importante

- GitHub Pages **não executa Node.js nem PostgreSQL**. O backend foi implementado e testado localmente; hospedagem externa não foi realizada.
- HTTP operacional usa PostgreSQL. Abertura direta por arquivo usa `localStorage` independente; não utilize dados reais de clientes no site público.
- Nunca publique `.env`, senhas ou dados de clientes. Não envie arquivos de `backend/storage`, backups privados nem `.git` em ZIPs compartilhados.
- O `demandas_otimizado (1).html` é uma referência original independente, não a versão para publicar.
