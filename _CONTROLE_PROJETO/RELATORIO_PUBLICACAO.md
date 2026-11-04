# Publicação Supabase + GitHub Pages — 04/11/2026

Site: https://amapa1422.github.io/livre-escolha-demandas/

## Resultado confirmado

- Autorização explícita do proprietário para commit, push, workflow e testes de produção recebida em 04/11/2026.
- Source verificado independentemente pela API GitHub: `build_type=workflow` (GitHub Actions).
- Commit de aplicação publicado: `4f96fa2703f1d0b105f95067ffa68fc8699059c4`.
- [GitHub Actions 41843292760](https://github.com/amapa1422/livre-escolha-demandas/actions/runs/41843292760): concluído com **success**, incluindo testes, scanner, build e deploy.
- 27 testes isolados de CI aprovados localmente e etapa correspondente aprovada no Actions. São verificações isoladas, distintas dos testes reais do Supabase.
- 133 arquivos públicos servidos comparados com o pacote auditado: todos HTTP 200 e conteúdo correspondente (normalizando apenas LF/CRLF para textos). `.nojekyll` não contabilizado como recurso HTTP.
- `.env`, backend/server, SQL de migração, documentação privada e `.git/config` retornam 404 no site.
- Seis verificações anônimas reais em produção aprovadas: página protegida, URLs com prefixo, cinco tabelas recusando leitura, invite/recovery sem sessão recusados e ausência de erros JavaScript capturados.
- CSS/design e funcionalidades aprovadas preservados; nenhuma alteração funcional foi feita nesta publicação.

## Teste autenticado no site

Janelas dedicadas Chrome/admin e Edge/funcionário abertas no endereço oficial. Roteiro real aguarda login manual antes de criar um registro QA com print. Prevê consulta PostgreSQL, criação, RPCs, print privado, ampliação, atualização dos cards e exclusão lógica sincronizada. Até esta atualização, não criado registro nessa rodada; não apresentar como testes autenticados de produção já aprovados.

Evidências locais: `.qa/supabase/deploy-20261104.json`, `published-static-20261104.json`, `published-browser-20261104.json` e `production-real-20261104.json`. Essas evidências não fazem parte do pacote público.

## Segurança e limitações

Scanner aprovou seleção de fontes/índice sem padrões de credenciais reais e sem correspondências aos dois valores privados locais comparados apenas em memória. `.env`, uploads, novos backups, perfis de navegador e QA fora do commit selecionado e do artefato. Publishable key é pública; nenhuma Secret key/service_role foi usada. Credencial GitHub já cadastrada foi usada só em memória pelo gerenciador, sem token em arquivos ou saídas.

Inativação/restauração manual aprovada pelo proprietário na etapa 018; 17 verificações reais entre papéis aprovadas anteriormente na 015. Não foram repetidas apenas para publicar. SMTP próprio e teste de entrega de convite/recuperação a destinatário autorizado em produção continuam sem confirmação; login por senha de contas existentes é independente dessa entrega. Limpeza dos QA antigos 12/13 ainda a conferir via sessão admin, excluindo somente se identificados como os registros da rodada interrompida.

## Recuperação

Backup pré-publicação: `_CONTROLE_PROJETO/backups/2026-11-04_publicacao_625e464b`, 156 arquivos conferidos mais suplemento do roteiro real. Base anterior local/remota era `041ed578ad215e531a45c0bafe6d8f7747d2ecf2`. Qualquer reversão exige backup atual separado, revisão do commit escolhido e autorização para novo deploy; não reverter banco ou apagar dados automaticamente. Nenhum rollback foi executado.
