# Funcionalidades existentes e comportamentos a preservar

Leitura do código em 29/10/2026. Esta documentação descreve o que existe; não autoriza correções ou funcionalidades novas.

## Mapa dos arquivos

- **O**: `demandas_otimizado (1).html`, original independente, com marcação, estilos e script internos.
- **H**: `central-demandas/index.html`, marcação da versão organizada.
- **J**: `central-demandas/js/app.js`, lógica da versão organizada.
- **C**: `central-demandas/css/style.css`, estilos da versão organizada.

Os fluxos principais abaixo existem em ambas as entradas. A coluna de arquivos identifica as partes da versão organizada; no original, as partes equivalentes estão todas em **O**. As diferenças de robustez entre as entradas são descritas ao final e não devem ser presumidas idênticas.

## Catálogo

| Funcionalidade | Funcionamento atual | Arquivos e contrato de preservação |
| --- | --- | --- |
| Cadastro de demandas | **Nova demanda** abre `createOverlay`. Cliente/empresa (até 100 caracteres), tipo e solicitado por (até 80) são obrigatórios; prioridade, descrição/observações (até 2500) e um print completam o formulário. Textos são aparados. O ID é o maior ID existente ou 1040, mais um; `created` recebe o instante da criação. Novo registro começa pendente, sem responsável. Após salvar, o formulário é limpo, o modal fecha e a aba Todas é selecionada. | **H** `createForm` e campos; **J** submit, `save`, `setTab`; **C** formulários/modais. Preservar nomes, limites, obrigatoriedade, ID e formato do registro. A criação não limpa a pesquisa nem o filtro de tipo já escolhidos. |
| Tipos de demanda | Exatamente **CANCELAMENTO**, **CONSULTA DE FIDELIDADE**, **TRANSFERÊNCIA DE TITULARIDADE** e **MUDANÇA**, no cadastro e no filtro. | **H** `category`, `typeFilter`; **J** validação e filtragem. Não adicionar, remover, renomear ou converter categorias antigas automaticamente. |
| Seleção de responsáveis | **👍 Assumir caso**, disponível em pendentes, abre `assumeOverlay`. Um select nativo oferece **Felipe, Pedro, Vinícius, Kaique e Luíz**, nessa ordem. Selecionar e confirmar grava o nome e muda o status. | **H** `agent`, `assumeForm`; **J** ações `assume` e submit; **C** modal/campo. Preservar dropdown, grafia e confirmação. A aparência do menu aberto é controlada pelo navegador; não é um novo componente customizado. |
| Status | Chaves: `pendente` → **Pendente**; `andamento` → **Em andamento**; `lancada` → **Lançada**. Cadastro produz pendente; assumir produz andamento; **✓ Marcar lançada** exige confirmação e produz lançada. | **J** `statuses`, ações e renderização; **H** abas/menu; **C** `.pending`, `.working`, `.done`. Preservar estados, cores e transições. Não há reabertura, edição de demanda nem troca de responsável já implementadas. |
| Prioridade | **Normal** é o padrão; **Alta** exibe o selo **⚑ Alta prioridade** e participa da ordenação. Prioridade não muda o status nem atribui responsável. | **H** `urgency`; **J** cadastro, `ticket`, ordenação; **C** `.priority`. Manter somente as duas opções e sua independência do status. |
| Indicadores e contadores | Quatro indicadores globais: total **▦**, aguardando responsável **⏳**, em andamento **👍**, lançadas **✅**. Aguardando conta registros com status pendente. O contador ao lado da fila mostra somente a quantidade após filtros. A demo contém 5 registros: 2 pendentes, 1 em andamento e 2 lançados. | **H** `total`, `pending`, `working`, `done`, `showing`; **J** `renderMetrics`, `render`; **C** `.metrics`, `.metric`. Não transformar indicadores globais em contadores filtrados. Na versão organizada, as métricas mudam após gravações bem-sucedidas. |
| Pesquisa e filtros | Pesquisa instantânea em cliente, categoria, solicitante, responsável, descrição e ID; compara trecho em minúsculas, sem normalização de acentos. Tipo é correspondência exata. Busca, tipo e status são combinados. Nenhum resultado mostra a mensagem existente. | **H** `search`, `typeFilter`; **J** `render` e eventos `input/change`; **C** toolbar/estado vazio. Preservar resposta imediata, busca sem recarga, combinação de filtros e textos. |
| Ordenação | **Mais recentes**: data decrescente; **Mais antigas**: crescente; **Prioridade alta**: Alta antes de Normal, com mais recentes primeiro no desempate. Padrão: mais recentes. | **H** `sort`; **J** ordenação da lista filtrada. Manter critérios e opções; filtros e ordenação não são persistidos. |
| Abas e navegação | **Todas**, **Pendentes**, **Em andamento** e **Lançadas** filtram a lista. O menu lateral oferece **Painel geral**, **Pendentes**, **Em andamento** e **Lançadas**, com seleção ativa correspondente. | **H** `.tab`, `.nav-item`; **J** `setTab`; **C** abas/menu. Preservar equivalência, seleção visual e pesquisa/tipo/ordenação ao alternar status. |
| Barra lateral recolhível | Botão `toggleSidebar` alterna `body.sidebar-closed`, ícone e atributos de acessibilidade. Preferência `demandas_sidebar_closed` vale `'1'` ou `'0'` e é lida na abertura. | **H** sidebar/botão; **J** `setSidebar` e persistência; **C** grid, sidebar e media queries. Manter transição e preferência. Até 680 px a barra se torna um topo com marca; navegação lateral e botão ficam ocultos. |
| Abertura e fechamento de modais | Quatro overlays: cadastro, detalhes, assumir e zoom. Fecham por seus botões e clique diretamente no fundo. **ESC fecha todos os overlays abertos**, inclusive detalhes sob o zoom. Fechar não limpa por si só o cadastro preenchido. | **H** overlays e atributos de diálogo; **J** `open`, `close`, eventos; **C** overlays/modais. Preservar IDs, ações e semântica de fechamento. Na versão organizada, manter contenção/retorno de foco e fundo inerte. |
| Upload de imagens | Um anexo opcional PNG, JPG/JPEG ou WebP de até **1.048.576 bytes (1 MB)**. `FileReader` produz uma URL `data:` armazenada no campo `image`; não há envio para servidor. Não há galeria, múltiplos anexos ou compressão automática. | **H** `attachment`, accept e aviso; **J** `readImage`, submit e detalhes; **C** campo/preview. Preservar formatos, limite, proporção e persistência. A versão organizada valida assinatura/decodificação, trata leitura malsucedida e impede envio duplicado. |
| Detalhes e ampliação de prints | **Ver detalhes →** mostra cliente, tipo, solicitante, responsável, status, prioridade, descrição, data/ID e print quando existente. Imagem ou **⌕ Ampliar imagem** abre `zoomOverlay`, preservando proporção. Fechar somente o zoom pelo botão ou fundo mantém os detalhes abertos. | **J** `showDetails`, `zoom`; **H** `detailContent`, `zoomImage`, `zoomClose`; **C** preview e zoom. Preservar dados/textos e `object-fit:contain`. Na versão organizada, Enter/Espaço na imagem também abrem o zoom. |
| Exclusão | **Excluir demanda** nos detalhes pede confirmação com o ID. Cancelar mantém o registro; confirmar o retira da lista e atualiza indicadores. Não existe lixeira nem desfazer. | **J** ação `removeDemand`, `save`, `render`; **H** detalhes; **C** botão. Preservar confirmação explícita. Na versão organizada, falha de gravação mantém registro e modal. |
| Restauração da demo | **↺ Restaurar demo** confirma que as demandas do navegador serão apagadas; em seguida substitui a lista pelos cinco exemplos e seleciona Todas. Os horários dos exemplos são calculados quando o script inicia, não como datas fixas. | **H** `resetBtn`; **J** `initial`, `save`, handler. Preservar confirmação, exemplos e comportamento. A ação não limpa explicitamente pesquisa, tipo, ordenação ou preferência da barra. O exemplo lançado de **Ana** é histórico; Ana não deve ser adicionada ao dropdown por isso. |
| Armazenamento no navegador | Array JSON em **`livre_escolha_demandas_demo_v1`**; preferência do menu na chave separada. Na ausência da chave de demandas, a demo é exibida em memória e gravada quando ocorre operação de escrita. Recarregar recupera os dados já gravados na mesma origem/perfil. | **J** `load`, `validRecord`, `save` e sidebar. Preservar chaves e campos abaixo. Sem banco, sincronização entre usuários/abas ou backup automático do navegador. Não migrar nem apagar dados silenciosamente. |
| Responsividade | Layout amplo com barra de 244 px e métricas em quatro colunas. Até 900 px: duas colunas de métricas. Até 680 px: topo com marca, conteúdo em uma coluna, formulário de uma coluna, ações de cartões lado a lado e filtros em duas colunas. Abas podem rolar dentro do próprio componente. | **C** seções layout/responsivo; **H** viewport/estrutura. **O** contém as regras equivalentes. Preservar os breakpoints, uso dos controles e ausência de overflow horizontal do documento. |

## Contrato dos registros

Campos existentes, sem versão nova de esquema nesta tarefa:

| Campo | Uso |
| --- | --- |
| `id` | Número identificador da demanda. |
| `client` | Cliente/empresa, texto. |
| `category` | Tipo de demanda, texto. |
| `requester` | Solicitante, texto. |
| `priority` | Normal ou Alta nos cadastros novos. |
| `description` | Observações, texto, pode ser vazio. |
| `status` | `pendente`, `andamento` ou `lancada`. |
| `assignee` | Responsável, texto; vazio no cadastro. Preservar nomes históricos já gravados. |
| `created` | Timestamp numérico em milissegundos. |
| `image` | URL `data:` do print ou string vazia. |

A versão organizada valida formato básico, IDs únicos e status ao carregar. Não normaliza categorias ou nomes históricos. JSON inválido é preservado; registros válidos de uma lista parcialmente inválida permanecem consultáveis, mas escritas ficam bloqueadas. Restauração da demo expressamente confirmada pode substituir os registros corrompidos. Se a leitura do armazenamento estiver indisponível, a versão organizada inicia sem registros e avisa; não grava por cima desse estado.

## Diferenças verificadas no original O

| Área | Original monolítico | Versão organizada existente |
| --- | --- | --- |
| Gravação malsucedida | Cadastro desfaz a inclusão em memória quando `save()` falha. Assumir, finalizar, excluir e restaurar já alteram a memória e seguem o fluxo sem testar o retorno de `save()`. | Só confirma o novo estado em memória/tela após `setItem` bem-sucedido. |
| Leitura de registros | Aceita um array sem validar cada registro; usa a demo se JSON/leitura falhar ou o valor não for array. | Valida registros e preserva armazenamento inválido com bloqueio de escritas. |
| Imagens | Verifica MIME e tamanho; a rejeição do FileReader não tem tratamento no submit. `src` é interpolado no HTML dos detalhes. | Verifica assinatura e decodificação, trata erros, limita fontes permitidas e atribui `src` pelo DOM. |
| Teclado/modais | Foco inicial em input/botão; não há contenção de foco, retorno gerenciado, `inert` ou ativação da imagem por Enter/Espaço. | Implementa essas proteções e mantém foco após atualização de cartão. |
| Eventos e métricas | Navegação lateral usa `onclick`/`window.setTab`; métricas são recalculadas com a lista. | Listeners/delegação; métricas separadas; referências e formatador de data reutilizados. |

Estas diferenças foram constatadas por leitura, não corrigidas nesta implantação documental. Não leve automaticamente alterações de uma entrada à outra.

## Recursos ausentes

Não existem login, permissões por usuário, API, banco de dados, integração WhatsApp, sincronização em tempo real, edição/reabertura de demandas, histórico por registro, anexos múltiplos, exportação/importação de dados pela interface ou backups agendados. O texto sobre solicitação recebida no WhatsApp é apenas orientação do formulário.
