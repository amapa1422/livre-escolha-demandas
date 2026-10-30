# LivreEscolha · Central de Demandas

## Atualização vigente — 30/10/2026

Use esta pasta como fonte principal; `../index.html` e `assets/clientes/catalogo.js` são gerados por `../sync_pages.py`. Abra qualquer entrada diretamente no navegador ou por servidor estático. Para editar o catálogo, altere `assets/clientes/clientes.json` e execute `python sync_pages.py` na raiz.

O cabeçalho mantém Nova demanda; Restaurar demo, a caixa de demonstração e as identificações de protótipo no rodapé foram removidos. Somente o título usa Plus Jakarta Sans laranja (com fonte alternativa local). O catálogo contém 291 empresas, autocompletar acessível e logos associadas via campo opcional `clientId`, preservando demandas antigas e digitação livre. Prints são otimizados localmente somente quando há benefício, sem reduzir resolução.

Nenhum backend foi conectado. A fonte externa é opcional: sem internet o título usa a alternativa local. As demais operações e o catálogo funcionam offline. A chave de armazenamento continua a mesma; trocar de origem/perfil não transfere registros.

Testes atuais e pendências: [relatório](../_CONTROLE_PROJETO/RELATORIO_LOGOS_PAGES.md). As seções seguintes documentam a organização anterior, incluindo recursos de demonstração que foram removidos nesta atualização.

## Referência da organização anterior

Protótipo local em HTML, CSS e JavaScript puro, organizado a partir do arquivo oficial `../demandas_otimizado (1).html`. O original permanece intacto. A interface, os textos, as categorias, os responsáveis disponíveis, os status e os dados de demonstração foram preservados.

## Executar no VS Code

1. No VS Code, use **Arquivo → Abrir Pasta** e selecione `central-demandas`.
2. No Explorador do VS Code, clique com o botão direito em `index.html` e escolha **Revelar no Explorador de Arquivos**.
3. Abra `index.html` com Chrome, Edge ou Opera.

Não há instalação, `npm`, build, servidor ou conexão de internet necessários. Edite os arquivos, salve e atualize o navegador. Os scripts são clássicos e os caminhos são relativos, permitindo abrir diretamente por `file://`.

## Estrutura

```text
central-demandas/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── assets/
│   └── images/
│       └── .gitkeep
├── README.md
└── .gitignore
```

- `index.html`: estrutura da interface e dos quatro overlays, campos e opções originais, referências aos arquivos locais.
- `css/style.css`: estilos originais divididos nas mesmas 11 seções; também recebe as declarações antes inline, com os mesmos valores.
- `js/app.js`: configuração, persistência, renderização, modais, validação de imagens e eventos, organizados por responsabilidade dentro de uma função isolada.
- `assets/images/`: reservado para recursos estáticos futuros. Os prints continuam dentro dos registros no navegador, como no protótipo.

## Preservação e correções

As chaves continuam sendo `livre_escolha_demandas_demo_v1` e `demandas_sidebar_closed`. Não há migração, limpeza automática nem alteração dos campos dos registros. Os exemplos originais foram copiados literalmente, inclusive a responsável histórica **Ana** em um exemplo já lançado; o dropdown mantém somente **Felipe, Pedro, Vinícius, Kaique e Luíz**.

- Cadastro, atribuição, finalização, exclusão e restauração só alteram a memória/tela depois que o armazenamento confirma a gravação. Uma falha mantém os dados e os formulários necessários para tentar novamente.
- JSON e registros inválidos são preservados no armazenamento. Registros válidos ainda podem ser consultados; alterações ficam bloqueadas para evitar sobrescrever os demais. Uma restauração explicitamente confirmada mantém o comportamento destrutivo original do botão **Restaurar demo**.
- PNG, JPG e WebP mantêm o limite de **1 MB**. A validação verifica tipo, tamanho, assinatura do arquivo e decodificação. Falhas de leitura são tratadas; envios simultâneos não duplicam cadastros.
- Textos inseridos no HTML são escapados. Imagens só aceitam URLs locais `data:` dos formatos permitidos; o `src` é atribuído pelo DOM, sem interpolação de atributos.
- Eventos inline foram substituídos por listeners. Cartões, detalhes, navegação e fechamento de modais utilizam delegação.
- Modais contêm o foco do teclado e tornam o fundo inerte. O foco retorna ao acionador e é preservado quando um cartão muda. O print também pode ser ampliado pelo teclado. ESC continua fechando todos os overlays, como no original; botão e clique no fundo do zoom mantêm os detalhes abertos.

## Desempenho

- CSS original preservado, incluindo `content-visibility`, tamanho intrínseco dos cartões, transições curtas e `prefers-reduced-motion`.
- Indicadores calculados em uma passagem e atualizados somente quando os dados mudam; digitar na pesquisa não recalcula métricas.
- Referências aos elementos fixos e formatador de datas reutilizados.
- A geração do próximo ID usa uma passagem sem espalhar todos os IDs como argumentos de `Math.max`.
- A pesquisa continua imediata, sem debounce, dependências ou processamento em segundo plano.

Essas mudanças reduzem trabalho desnecessário; não foi realizado benchmark em computador corporativo de baixa potência.

## Dados locais e limitações

Os dados pertencem ao navegador, perfil e origem utilizados. Ao abrir outro caminho por `file://`, outro navegador ou uma URL de servidor, os registros anteriores podem não aparecer, pois o escopo do armazenamento pode mudar. **A chave é a mesma, mas isso não transfere dados entre origens.** Continue usando o HTML original para acessar dados que estejam vinculados ao caminho antigo; nenhum registro desse perfil foi acessado ou migrado durante o trabalho.

O espaço de `localStorage` é limitado e varia por navegador. Prints em base64 consomem esse espaço. O sistema não sincroniza usuários, abas ou computadores e não oferece backup, autenticação, banco de dados ou integração com WhatsApp. Em caso de registros corrompidos, preserve uma cópia do valor original antes de qualquer reparação manual; **Restaurar demo** substitui esses registros após confirmação.

## Validação

O roteiro automatizado fica fora da aplicação, em `../.qa/browser-tests.js`, e usa navegadores reais em modo headless com perfis isolados. Nenhum teste usa o perfil pessoal do usuário. Os relatórios finais ficam em `../.qa/`.

O roteiro cobre os 18 passos solicitados: painel inicial, cadastro com print, indicadores, busca, filtro, atribuição, status em andamento, detalhes, ampliação/fechamento, lançamento, abas/menu, recolhimento/expansão, recarga com persistência, exclusão com confirmação, celular e erros de execução. Também verifica ordenações, restauração/cancelamento, PNG/JPG/WebP, limite de tamanho, arquivos falsos/truncados, FileReader, falhas de gravação em todas as operações, JSON inválido, HTML malicioso e teclado.

A comparação com o original verifica geometria e estilos computados dos elementos do painel nas larguras **1920, 1366, 768, 390 e 320 px**, com os mesmos registros. Modais são exercitados nas larguras 768, 390 e 320 px. Isso valida o comportamento responsivo em viewports simulados; não substitui testes em aparelhos físicos ou leitores de tela.

Consulte `../.qa/RESULTADOS.md` para as versões dos navegadores e os resultados finais.
