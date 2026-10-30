# Estado atual do projeto

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
