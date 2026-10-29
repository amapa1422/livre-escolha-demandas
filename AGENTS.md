# LivreEscolha — regras permanentes do projeto

Estas instruções se aplicam à raiz `Demandas/` e a todos os seus subdiretórios. O sistema existente é a versão oficial aprovada. Toda alteração futura deve ser delimitada, documentada, testada e reversível.

## Antes de qualquer alteração

1. Ler `_CONTROLE_PROJETO/LEIA_PRIMEIRO.md`.
2. Consultar `_CONTROLE_PROJETO/ESTADO_ATUAL.md`.
3. Consultar `_CONTROLE_PROJETO/FUNCIONALIDADES.md`.
4. Consultar `_CONTROLE_PROJETO/DESIGN_APROVADO.md`.
5. Consultar `_CONTROLE_PROJETO/HISTORICO_ALTERACOES.md`.
6. Identificar a solicitação, a entrada do sistema e somente os arquivos necessários. O original é `demandas_otimizado (1).html`; a entrega organizada está em `central-demandas/`. Não existe `index.html` na raiz e não se deve reorganizar o código por causa de exemplos de estrutura.
7. Criar um backup único dos arquivos relevantes **antes** de modificá-los, incluindo documentação existente que será atualizada. Preservar caminhos relativos e bytes, verificar SHA-256/tamanhos e registrar escopo, horário e ID. Para arquivos novos, registrar que não existiam. Nunca sobrescrever backups anteriores nem copiar recursivamente a pasta de backups, `.git`, dependências ou temporários.
8. Verificar alterações anteriores ainda não registradas, comparando estado, histórico, arquivos e último backup aplicável. Preservar trabalho do usuário; não presumir que diferenças são descartáveis. Registrar descobertas e definir impactos antes de alterações incompatíveis.

## Durante a alteração

- Modificar somente o necessário para atender à solicitação. A autorização é a do escopo solicitado; não expandi-la para funcionalidades não envolvidas.
- Não modificar outras funcionalidades sem autorização. Explicar o impacto antes de implementar uma mudança incompatível em recurso existente.
- Não alterar o design aprovado por iniciativa própria: manter layout, cores, tipografia, espaçamentos, botões, ícones, modais, responsividade e transições, salvo pedido explícito que os contemple.
- Não adicionar bibliotecas sem necessidade nem substituir código funcional por preferência técnica.
- Não apagar funcionalidades existentes ou alterar categorias, responsáveis, status, formato de registros ou chaves de persistência sem solicitação correspondente.
- Não executar operações destrutivas sem autorização. Nunca executar `git reset --hard`, `git clean -fd`, sobrescritas em massa ou exclusões destrutivas sem autorização explícita.
- Não sobrescrever nem editar backups anteriores. Tratar `versao_inicial` como snapshot imutável; criar outro ID para novas cópias.
- Preservar desempenho: evitar animações excessivas/contínuas, blur pesado, sombras animadas, reprocessamento desnecessário, bibliotecas grandes e aumento de carregamento sem benefício. Manter as transições suaves e `prefers-reduced-motion` aprovados.
- Não sincronizar automaticamente mudanças entre o HTML original e a versão organizada. Elas têm diferenças de implementação documentadas; identificar o alvo solicitado.
- Preservar dados do navegador. Backup de código não recupera `localStorage`; **Restaurar demo** apaga/substitui os registros locais após confirmação.
- Na implantação, o Git encontrado tinha topo em `C:/Users/felipe.lobato`, fora deste projeto, e os arquivos de `Demandas` não estavam rastreados. Confirmar esse estado antes de operações Git e restringir o escopo; nunca usar staging/limpeza amplos no repositório ancestral.

## Depois da alteração

1. Verificar se a funcionalidade solicitada funciona.
2. Testar os recursos relacionados e os cenários de erro relevantes.
3. Verificar possíveis erros no console quando houver execução da aplicação.
4. Confirmar que o restante do sistema permanece funcionando; conferir preservação visual/responsiva quando aplicável. Para tarefas apenas documentais, validar conteúdo, referências e integridade dos arquivos existentes, informando que não houve nova execução funcional.
5. Atualizar `_CONTROLE_PROJETO/HISTORICO_ALTERACOES.md`, em ordem cronológica, com data/hora/fuso, ID, pedido, arquivos, alteração, impactos, testes, resultados, backup anterior e commit real quando existir. Não inventar testes ou histórico.
6. Atualizar `_CONTROLE_PROJETO/ESTADO_ATUAL.md` e os documentos de funcionalidades/design somente se uma mudança autorizada justificar. Manter pendências e limitações verificáveis.
7. Informar quais arquivos foram adicionados, modificados ou removidos, resultados e limitações.
8. Explicar como reverter a alteração com base no backup/commit real, preservando trabalho posterior. Consultar `_CONTROLE_PROJETO/INSTRUCOES_REVERSAO.md` e criar backup separado do estado atual antes de qualquer reversão.

## Memória e evidências

Usar a documentação local como memória persistente; não depender apenas do histórico do chat. Não documentar recursos inexistentes como implementados. Relatórios em `.qa/` são evidências anteriores, não prova de testes executados na tarefa atual. O runner de QA só deve ser ativado em perfil descartável, pois o roteiro substitui dados de teste.

O controle é documental e baseado em cópias locais: não há bloqueio técnico de edição, backup automático, sincronização externa ou recuperação automática de dados do navegador.
