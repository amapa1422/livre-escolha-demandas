# Estado atual do projeto

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
