# Preparação final — GitHub Pages

Destino: https://amapa1422.github.io/livre-escolha-demandas/

**Publicação concluída — SUPABASE-020 (04/11/2026):** commit `4f96fa2` enviado à main e [workflow 41843292760](https://github.com/amapa1422/livre-escolha-demandas/actions/runs/41843292760) aprovado, com Source=GitHub Actions verificado pela API. 133 arquivos públicos conferidos contra pacote, arquivos privados 404 e seis verificações anônimas reais aprovadas. Login/fluxo autenticado de produção aguardam interação nas janelas dedicadas; resultado detalhado em [RELATORIO_PUBLICACAO.md](RELATORIO_PUBLICACAO.md). As instruções de aguardar autorização abaixo são históricas; a autorização já foi recebida e utilizada.

**Autorização SUPABASE-020 (04/11/2026):** proprietário autorizou publicação e confirmou cadastro dos três callbacks. Source=GitHub Actions foi verificado independentemente pela API (`build_type=workflow`). Main local/remota alinhadas antes do envio. Reexecutados 27 testes isolados do CI, auditoria de segurança, sincronização, actionlint e build final de 134 arquivos, todos aprovados. Publicação em execução; resultado de Actions e smoke tests de produção ainda será registrado. Não confundir testes isolados com testes reais anteriores/seguintes. Nenhuma credencial privada ou backup/QA incluído na seleção de fontes.

**Configuração recebida — SUPABASE-019 (04/11/2026):** Site URL oficial correto; Redirect URL raiz seguido de ** relatado (se entrada literal /livre-escolha-demandas/**, cobre os callbacks). Templates padrão sem links personalizados podem permanecer; Source não inspecionado. Pages está em **Deploy from a branch**, portanto precisa mudar para **GitHub Actions antes de push**. Arquivos/workflow prontos localmente e auditados; falta configurar SMTP próprio para operação de convites/recuperação dos funcionários em produção e validar um fluxo de e-mail após deploy autorizado. Nenhuma credencial SMTP deve ir ao Git/chat. Nada foi publicado.

**Atualização SUPABASE-018 (04/11/2026):** bloqueio/restauração do funcionário **aprovado manualmente pelo proprietário**: inativo bloqueado, admin manteve acesso, SQL restaurou ativo=true e funcionário voltou ao painel. Captura confirma perfil específico/papel/ativo. Resultado em `.qa/supabase/inativo-manual-20261104.json`. Não executar nova inativação; relatório automatizado anterior permanece histórico. Esta confirmação cobre interface/restauração, não testes diretos de RLS/Storage/RPC sob JWT inativo. **Para liberar publicação faltam os valores reais de Site URL/Redirect URLs/templates e a origem GitHub Actions no painel.** Limpeza QA 12/13 ainda precisa ser conferida separadamente. Nenhum deploy realizado.

**Revisão de 04/11/2026 (SUPABASE-017):** URL/Publishable key aceitas no Auth real com HTTP 200 e disable_signup=true. Sync/sintaxe/scanner/actionlint/build aprovados novamente, mais seis testes de prefixo com SDK real em navegador isolado. Os 17 testes entre papéis são evidência aprovada anterior; finalização alheia também foi recusada. **Inatividade/restauração não concluídas nas evidências, configuração real de callbacks não fornecida e origem Pages=GitHub Actions ainda a confirmar no painel.** Sem commit/push/publicação. Artefato desta revisão: `.release/review-20261104/livre-escolha-demandas`. Índice Git vazio, 149 fontes no manifesto; pronto para revisão do commit, não liberado para publicação.

Estado desta preparação: testes finais e validação dos callbacks ainda em andamento. **Não executar a publicação antes do relatório final e da confirmação do proprietário.** Nenhum commit, push ou workflow foi disparado pelo agente.

## Resultados verificados nesta preparação

| Verificação | Resultado |
| --- | --- |
| Funcionário finalizando caso atribuído ao admin | RPC recusou; status andamento/responsável preservados |
| Bloqueio de perfil inativo/restauração pela interface | Aprovado pelo proprietário; captura confirma ativo=true. Não inclui reteste direto sob JWT preservado |
| Prefixo local igual ao repositório | Seis verificações aprovadas com servidor estático e SDK real |
| Site URL/Redirect URLs/templates relatados | Site URL correto; glob ** cobre se literal; preferir URLs exatas. Templates padrão relatados, e-mail válido ainda não testado em produção |
| Workflow YAML/expressões | actionlint 1.7.12 aprovado, sem executar Actions |
| Pacote público | 134 arquivos, sem backend ou padrões de segredo |
| Fontes previstas para GitHub | 149 arquivos no manifesto; sem padrões reais detectados, índice auditado e dois valores privados locais comparados em memória sem ocorrências |

Demandas da rodada anterior: 12 e 13, com prefixos QA. Sua limpeza e o estado atual do funcionário precisam ser conferidos; as sessões dedicadas estão indisponíveis nesta retomada, portanto o roteiro antigo não está comprovadamente aguardando ao vivo. Confirmar estado antes de executar novamente o SQL de teste; após o teste, restaurar o funcionário e excluir logicamente somente os próprios QA. A primeira espera de inatividade foi inválida (avançou antes da ação manual), foi preservada e não é evidência de brecha. O teste corrigido exige leitura explícita de ativo=false antes de prosseguir. As demandas 10/11 dessa tentativa foram excluídas logicamente.

## Validação antes do envio

Na raiz `Demandas`, usando Python 3.13 e Node 24:

```powershell
python sync_pages.py --check
python scripts/verify-release.py --prepare
python scripts/build-pages.py .release/pages
node scripts/verify-pages.cjs .release/pages
```

O destino `.release/pages` deve ser novo ou vazio. O empacotador recusa sobrescrever uma pasta preenchida. Caso precise repetir, escolha outro destino e atualize o comando de verificação. `.release/` fica fora do Git.

`verify-release.py` examina arquivos rastreados, novos não ignorados, seleção da release e blobs do índice por padrões de credenciais, sem imprimir valores. Não é uma garantia contra todo segredo possível nem analisa histórico remoto. `.env`, dependências, uploads, backups e artefatos locais não entram na seleção. O manifesto `.release/source-manifest.json` identifica caminhos/tamanhos/SHA-256 dos arquivos selecionados. A publishable key do Supabase é configuração pública; nenhuma Secret key ou service_role é necessária no GitHub Actions.

O scanner compara também PGPASSWORD/SESSION_SECRET locais em memória, sem gravar/imprimir valores. Uma única ocorrência de prefixo privado nos testes é explicitamente fictícia e comprova rejeição de configuração; a exceção é restrita a esse valor e arquivo. Nenhum teste funcional desta preparação utilizou esse fixture. Busca nominal no histórico local não encontrou `.env`/`.pem`/`.key`; isso não equivale a auditoria completa do histórico ou de credenciais desconhecidas.

## Envio e publicação — somente após confirmação

Primeiro, em GitHub → Settings → Pages, definir a origem como **GitHub Actions**. Isso evita usar o mecanismo histórico de publicação por branch.

O proprietário confirmou que a origem atual é Deploy from a branch. Portanto essa alteração vem antes de qualquer push da migração: caso contrário, o mecanismo de branch pode publicar sem executar as verificações do workflow manual. A mudança deve ser feita pelo proprietário; não foi feita automaticamente.

Conferir o manifesto, os testes finais e as alterações antes de executar:

```powershell
git status --short
git add --pathspec-from-file=.release/source-paths.txt
python scripts/verify-release.py --check
git diff --cached --stat
git diff --cached --name-only
git commit -m "Integra Demandas ao Supabase e prepara GitHub Pages"
git push origin main
```

O workflow aceita somente execução manual em `main`, com `confirmar_publicacao=true`. Não executa por push. Depois do envio e da confirmação explícita de publicação, usar GitHub → Actions → Publicar Demandas no GitHub Pages → Run workflow → confirmar_publicacao, ou, se GitHub CLI estiver instalado/autenticado:

```powershell
gh workflow run pages.yml --ref main -f confirmar_publicacao=true
gh run list --workflow pages.yml --limit 5
```

O pipeline confere sincronização/segredos, executa os testes isolados de CI existentes e empacota somente o frontend. Os testes isolados não substituem as evidências reais documentadas e não foram executados nesta rodada de testes reais. O deploy usa OIDC e permissões contents:read/pages:write/id-token:write, ambiente github-pages e um único artefato público. Não cadastrar credenciais privadas do Supabase no workflow.

## Configuração de autenticação esperada

Site URL: `https://amapa1422.github.io/livre-escolha-demandas/`.

Redirect URLs exatos de produção a conferir no painel:

- `https://amapa1422.github.io/livre-escolha-demandas/central-demandas/login.html`
- `https://amapa1422.github.io/livre-escolha-demandas/central-demandas/login.html?mode=recovery`
- `https://amapa1422.github.io/livre-escolha-demandas/central-demandas/login.html?mode=invite`

Convite/recuperação devem usar ConfirmationURL ou templates personalizados compatíveis com token_hash/type no login. Não compartilhar links reais/token de e-mail em logs ou Git. A lista real do painel e o teste completo no site publicado são verificações distintas da resolução correta dos caminhos no pacote.

Os modelos padrão relatados podem ser mantidos; não é necessário inspecionar/editar o Source para substituir por links inventados. A documentação oficial apresenta ConfirmationURL como formato padrão. Para produção, configure envio SMTP próprio exclusivamente no painel Supabase: o serviço padrão restringe destinatários à equipe do projeto. Referências: [templates](https://supabase.com/docs/guides/auth/auth-email-templates), [SMTP](https://supabase.com/docs/guides/auth/auth-smtp). Depois do deploy explicitamente aprovado, testar convite/recuperação reais sem compartilhar seus links/tokens.

## Reversão

Antes de reverter, fazer backup do estado atual e comparar diferenças. Backup desta etapa: `_CONTROLE_PROJETO/backups/2026-11-03_pre-publicacao_15cbb2d3`, com suplementos. Não reverter banco, apagar dados ou substituir trabalho posterior. Se uma publicação já tiver ocorrido no futuro, escolher um commit aprovado anterior e republicar manualmente; nenhum rollback ou alteração remota foi executado nesta preparação.
