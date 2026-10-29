# Design aprovado — LivreEscolha · Central de Demandas

Referência: estilos de `demandas_otimizado (1).html` e `central-demandas/css/style.css`, conferidos em 29/10/2026. A estrutura visual está no original e em `central-demandas/index.html`; cartões e conteúdo dos detalhes também são montados pelo JavaScript.

**O design atual está aprovado. Não alterar layout, paleta, tipografia, tamanhos, pesos, espaçamentos, bordas, ícones, textos, animações ou comportamento responsivo sem solicitação explícita que contemple a mudança.** Esta documentação não cria novos estilos. A paleta abaixo é a referência oficial deste projeto, extraída do código existente.

## Paleta e tema

Tema escuro com superfícies neutras, `color-scheme: dark` e laranja concentrado nas ações/destaques.

| Uso/token | Valor aprovado |
| --- | --- |
| Fundo `--bg` | `#0e1014` |
| Barra lateral `--side` | `#0a0c0f` |
| Painéis `--panel`, `--panel2`, `--panel3` | `#15181e`, `#1b1f26`, `#232832` |
| Bordas `--line`, `--line2` | `#272c35`, `#353b47` |
| Texto `--text`, `--text2`, `--muted` | `#f3f4f6`, `#c6ccd4`, `#9097a3` |
| Marca `--brand`, hover `--brand-hi` | `#f58228`, `#ff9a4d` |
| Texto sobre marca `--brand-ink` | `#1b0f05` |
| Fundo/borda da marca `--brand-soft`, `--brand-line` | `#f5822824`, `#f5822866` |
| Pendente `--amber`, `--amber-soft` | `#f2c14e`, `#f2c14e1f` |
| Em andamento `--blue`, `--blue-soft` | `#7db4ff`, `#7db4ff1f` |
| Lançada `--green`, `--green-soft` | `#5fd7a1`, `#5fd7a11f` |
| Prioridade alta/exclusão `--red`, `--red-soft` | `#ff8c96`, `#ff8c961f` |

Preservar também as cores locais do CSS: descrição do cartão `#aeb4bf`, separador do título `#61778b`, hover do cartão `#181c23`, overlay comum `#06080bb8`, overlay do zoom `#04060af2`, placeholders `#7b828e`, seleção `#f5822855` e demais valores específicos. Não trocar cores locais ou transparências somente para uniformizar tokens.

## Tipografia

Família existente: `Inter, "Segoe UI Variable Text", "Segoe UI", system-ui, -apple-system, Roboto, "Helvetica Neue", Arial, sans-serif`. Não há download de fontes; a fonte efetiva depende das disponíveis no dispositivo.

| Elemento | Configuração de referência |
| --- | --- |
| Corpo | Peso 400, tamanho `.9375rem`, altura de linha 1.5 |
| Título principal | Peso 750, `clamp(1.625rem, 1.2rem + 1.6vw, 2.125rem)`, linha 1.1, espaçamento `-.03em` |
| Título da fila | `1.125rem`, peso 700 |
| Título do cartão | `1rem`, peso 700, linha 1.35 |
| Descrição do cartão | `.875rem`, linha 1.55 |
| Detalhes do cartão | `.75rem` |
| Indicadores numéricos | `clamp(1.75rem, 1.3rem + 1.6vw, 2.375rem)`, peso 700, números tabulares |
| Título de modal | `1.25rem`, peso 700 |

Manter pesos, line-height, tamanhos e transformações de caixa dos rótulos existentes. Não substituir emojis/ícones por outra biblioteca.

## Estrutura, componentes e interações

| Componente | Aparência e comportamento aprovados |
| --- | --- |
| Layout | Grid com barra de 244 px e conteúdo flexível. Área principal com máximo de 1240 px, centralizada, espaçamentos fluidos por `clamp`. |
| Identidade | Bloco laranja **LE** de 36 × 36 px, marca **LivreEscolha**, subtítulo **Gestão telecom** e textos atuais. |
| Barra lateral | Fundo mais escuro, navegação vertical, item ativo laranja translúcido e trilho de 3 px; cartão inferior **Modo demonstração**. Botão circular de recolher de 28 px junto à borda. Estado recolhido mantém o botão disponível no desktop. |
| Botões | `.button` com altura mínima 40 px, raio 10 px e peso 600; primário laranja com texto escuro. `.mini` com altura mínima 36 px e peso 700; assumir laranja, finalizar verde e detalhes neutro. Pressão usa `scale(.98)`. Preservar hover, focus-visible e opacidade de desabilitado. |
| Cards | Superfície escura, raio 14 px, padding `18px 20px 18px 24px`, trilho esquerdo de 4 px colorido pelo status. Texto à esquerda e coluna de ações de 168 px à direita no desktop. Selo de status com ponto e prioridade alta em vermelho. |
| Indicadores | Quatro métricas em faixa compartilhada, divisórias de 1 px, raio externo 18 px; ícones **▦**, **⏳**, **👍**, **✅**, rótulos e cores atuais. |
| Busca/filtros/abas | Campo de pesquisa com ícone, selects nativos estilizados com seta SVG embutida no CSS, altura 44 px. Abas em grupo escuro arredondado, ativo laranja translúcido. |
| Modais | Overlay escuro sem blur; caixa até 560 px de largura e 92vh/92dvh de altura, rolagem interna, raio 18 px e sombra estática. Modal de assumir limitado a 430 px. Botão × no cabeçalho. |
| Formulários | Grid de duas colunas no desktop. Inputs/selects de 42 px, textarea com mínimo 96 px, bordas neutras. Foco laranja e halo discreto; labels, obrigatoriedade, placeholders e dica de tamanho do anexo preservados. |
| Prints | Preview limitado ao espaço disponível, raio 10 px; imagem ampliável com cursor zoom-in e botão sobreposto. Zoom em overlay acima dos detalhes, `object-fit:contain`, máximo 95vw × 84vh e botão **✕ Fechar**. |
| Avisos | Toast no canto inferior direito com borda esquerda laranja, largura limitada e animação breve; texto exibido por aproximadamente 3,5 segundos. |
| Rodapé | Textos existentes sobre protótipo e armazenamento neste navegador, borda superior neutra. |

Raios de referência: `--r-sm:8px`, `--r-md:10px`, `--r-lg:14px`, `--r-xl:18px`. Sombra `--shadow:0 18px 48px #00000080`. Há valores específicos adicionais; o CSS é a fonte exata.

## Transições e desempenho

- Duração padrão `--t:160ms`; curva `cubic-bezier(.2,.7,.2,1)`.
- Barra lateral: transições existentes de grid, padding, posição e visibilidade em 200 ms. Não substituir a implementação por iniciativa própria.
- Botões: transformação breve de 100 ms ao pressionar.
- Overlay: fade de 140 ms; modal: pop de 200 ms com opacity, deslocamento de 8 px e escala inicial `.98`; toast: 200 ms.
- Cartões mantêm `content-visibility:auto` e `contain-intrinsic-size:auto 140px`.
- `prefers-reduced-motion:reduce` desativa rolagem suave e reduz animações/transições para `.01ms`, com uma iteração.
- Preservar as animações atuais; não introduzir blur, glassmorphism, sombras animadas, animações infinitas, `transition:all` indiscriminado ou bibliotecas visuais.

## Responsividade

| Faixa | Comportamento existente |
| --- | --- |
| Acima de 900 px | Quatro colunas de métricas; barra lateral; cartões com ações à direita. |
| Até 900 px | Métricas em duas colunas. |
| Até 680 px | Layout em bloco; barra vira topo sticky com marca. Menu lateral, cartão inferior e botão de recolher ficam ocultos. Conteúdo com padding `20px 16px 36px`; topo empilhado; botões principais dividem a largura. |
| Até 680 px — fila e formulários | Busca ocupa duas colunas; dois selects lado a lado; abas com rolagem interna se necessário. Cartões em uma coluna com ações lado a lado, formulário em uma coluna, overlay com padding de 10 px e rodapé em coluna. |

Não confundir a rolagem interna permitida nas abas com overflow horizontal do documento. Manter imagens, botões e modais utilizáveis nas telas menores.

## Evidências disponíveis

Capturas existentes: [desktop](../.qa/desktop.png) e [celular](../.qa/mobile.png). Relatório anterior: [RESULTADOS.md](../.qa/RESULTADOS.md), com comparação de geometria/estilos do painel entre original e entrega organizada em 1920, 1366, 768, 390 e 320 px.

Essas são evidências da validação anterior. Nesta tarefa de proteção, nenhum estilo foi modificado nem foi executada nova sessão de navegador.
