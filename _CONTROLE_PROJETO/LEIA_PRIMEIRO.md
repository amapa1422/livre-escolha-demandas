# Leia primeiro — LivreEscolha · Central de Demandas

**Vigente — BACKEND-003 (30/10/2026):** `backend/src/server.js` agora existe. Executar `npm.cmd start` em `backend/` e abrir `http://127.0.0.1:3000`. HTTP integrado usa PostgreSQL/autenticação/Socket.IO; abertura por arquivo mantém armazenamento local independente. Consulte [RELATORIO_BACKEND.md](RELATORIO_BACKEND.md) e [backend/README.md](../backend/README.md). As descrições anteriores sobre ausência de backend são históricas.

Controle implantado em 29/10/2026. Fuso de todos os novos registros: **America/Sao_Paulo**, com deslocamento UTC explícito.

**Atualização factual de 30/10/2026:** a fonte atual é `central-demandas/`; existe `index.html` na raiz, gerado por `sync_pages.py`. O Git agora tem raiz própria em `Demandas/`. As descrições estruturais abaixo são do marco inicial; consulte primeiro a seção vigente de [ESTADO_ATUAL.md](ESTADO_ATUAL.md) e o relatório [LOGOS-PAGES-002](RELATORIO_LOGOS_PAGES.md). As regras de preservação e backup continuam válidas.

## Regra principal

**O sistema existente é a versão aprovada. Preserve funcionalidades, dados, design e desempenho.** Uma solicitação autoriza somente as mudanças necessárias ao seu escopo. Mudanças incompatíveis em recursos existentes devem ter seu impacto explicado antes da implementação e depender de solicitação explícita que as contemple.

A implantação deste controle acrescenta somente documentação, instruções e cópias. Não modifica arquivos funcionais nem reorganiza o projeto.

## Localização e versões existentes

Todos os caminhos abaixo são relativos a `Demandas/`:

| Caminho | Papel |
| --- | --- |
| `demandas_otimizado (1).html` | Fonte oficial original, com HTML, CSS e JavaScript no mesmo arquivo; preservada integralmente. |
| `central-demandas/index.html` | Entrada da entrega organizada existente. |
| `central-demandas/css/style.css` | Estilos da entrega organizada. |
| `central-demandas/js/app.js` | Comportamento da entrega organizada. |
| `.qa/` | Roteiro, relatórios e capturas da validação anterior; não é a aplicação. |
| `AGENTS.md` | Regras permanentes para trabalhos nesta árvore. |
| `_CONTROLE_PROJETO/` | Memória documental, estado, histórico e backups. |

Não existe `index.html` na raiz `Demandas/`. Não mova arquivos para fazer a árvore coincidir com exemplos de instruções. O HTML original e a versão organizada não são sincronizados automaticamente. Identifique qual entrada a solicitação afeta; não atualize a outra por iniciativa própria. As diferenças estão registradas em [FUNCIONALIDADES.md](FUNCIONALIDADES.md).

## Ordem de trabalho

Antes de editar, leia este documento, [ESTADO_ATUAL.md](ESTADO_ATUAL.md), [FUNCIONALIDADES.md](FUNCIONALIDADES.md), [DESIGN_APROVADO.md](DESIGN_APROVADO.md) e [HISTORICO_ALTERACOES.md](HISTORICO_ALTERACOES.md).

1. Relacione o pedido aos arquivos e comportamentos necessários; identifique impactos.
2. Verifique alterações ainda não registradas. Compare com o último estado/backup e consulte o Git somente no escopo deste projeto. Uma diferença não documentada pode ser trabalho do usuário: preserve-a, não a desfaça.
3. Antes de modificar qualquer arquivo existente, crie um backup único dos arquivos relevantes, incluindo a documentação que será atualizada. Para arquivos novos, registre que não existiam.
4. Preserve caminhos relativos, arquivos ocultos necessários e conteúdo byte a byte. Verifique quantidade, tamanho e SHA-256 da origem e da cópia antes de editar.
5. Faça somente a mudança solicitada. Mantenha a estrutura, as opções de negócio, o visual e as otimizações não afetadas.
6. Teste o recurso, os relacionados e os possíveis erros de console. Para mudanças exclusivamente documentais, verifique integridade e referências; não declare testes de navegador que não executou.
7. Acrescente uma entrada cronológica no histórico e atualize o estado, com arquivos, resultado, backup anterior e orientação de reversão.

## Convenção dos backups

- Backup inicial imutável: `backups/versao_inicial/`.
- Futuras identificações: `AAAA-MM-DD_HHmmss_descricao-curta`; acrescente um sufixo único em caso de colisão.
- Sempre verifique se a pasta já existe. Se existir, escolha outro identificador; nunca reutilize nem sobrescreva.
- Dentro da pasta, preserve os caminhos relativos à raiz do projeto. Inclua um manifesto com identificação, data/fuso, escopo, exclusões, arquivos, tamanhos e SHA-256.
- Exclua `node_modules`, `.git`, temporários, perfis de navegador e a árvore `backups` de qualquer cópia recursiva. Não copie a raiz inteira sem uma seleção explícita de arquivos.
- Um backup parcial deve ser identificado como parcial e listar exatamente o que protege. Para operações que afetem a aplicação inteira, proteja a aplicação inteira.
- O backup inicial cobre os sete arquivos do original e de `central-demandas`, inclusive `README.md`, `.gitignore` e `.gitkeep`. `.qa` não foi copiada: seus hashes constam do inventário de preservação no manifesto.
- As instruções e documentos deste controle nasceram depois do snapshot inicial; não estão dentro dele. Devem integrar os backups futuros quando forem alterados.

Confira os procedimentos em [INSTRUCOES_REVERSAO.md](INSTRUCOES_REVERSAO.md). Não execute `git reset --hard`, `git clean -fd`, exclusões destrutivas ou sobrescritas em massa sem autorização explícita. Antes de qualquer reversão, preserve também o estado que será substituído em outro backup.

## Git encontrado

O Git instalado reconhece um repositório ancestral em `C:/Users/felipe.lobato`, fora da raiz deste projeto. Na implantação, `Demandas/` estava sem arquivos rastreados e sem commits próprios encontrados. Nenhum repositório foi inicializado, nenhum arquivo foi adicionado ao índice e nenhum commit foi criado nesta tarefa documental.

Não use `git add .` ou operações amplas no repositório ancestral. O Git pode complementar os backups em trabalho futuro, com escopo explícito e conferência do topo do repositório; não há um commit de recuperação desta versão disponível agora.

## Limites da proteção

Documentação e hashes permitem orientar e verificar o trabalho, mas não bloqueiam fisicamente edições nem criam backups agendados. Os backups ficam no mesmo disco e não protegem contra sua perda. Nenhum serviço de nuvem ou sincronização foi configurado.

**Backup de arquivos não é backup de `localStorage`.** Demandas e prints salvos no navegador não são incluídos nestas cópias. Restaurar o código não recupera registros apagados, e **Restaurar demo** substitui os dados do navegador após confirmação.
