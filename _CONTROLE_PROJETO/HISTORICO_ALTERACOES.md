# Histórico de alterações

Ordem cronológica crescente. Datas/horários de novas entradas usam America/Sao_Paulo e deslocamento UTC. Não sobrescrever entradas antigas para ocultar mudanças; acrescente retificações quando necessário.

## Evidências anteriores à implantação

O projeto já continha o HTML oficial, a versão organizada e os artefatos `.qa` quando este controle foi criado. O README existente e `.qa/RESULTADOS.md` documentam organização/validação anterior em 29/10/2026; os três JSONs de resultados confirmam 75 verificações aprovadas por navegador. O horário e um commit daquela execução não estão registrados nesses artefatos. Por isso, não se cria aqui uma sequência de alterações anteriores ou horários presumidos.

## 2026-10-29T13:37:27-03:00 — CTRL-001 — Proteção documental e backup inicial

**Solicitação do usuário:** implementar documentação permanente, memória, histórico, regras no AGENTS e backup inicial verificável, sem alterar arquivos funcionais, design, lógica ou estrutura existente.

**Arquivos existentes modificados:** nenhum.

**Arquivos adicionados:**

- `AGENTS.md` na raiz `Demandas`.
- `_CONTROLE_PROJETO/LEIA_PRIMEIRO.md`.
- `_CONTROLE_PROJETO/FUNCIONALIDADES.md`.
- `_CONTROLE_PROJETO/DESIGN_APROVADO.md`.
- `_CONTROLE_PROJETO/HISTORICO_ALTERACOES.md`.
- `_CONTROLE_PROJETO/ESTADO_ATUAL.md`.
- `_CONTROLE_PROJETO/INSTRUCOES_REVERSAO.md`.
- `_CONTROLE_PROJETO/backups/versao_inicial/MANIFESTO_SHA256.json`.
- Sete cópias sob `_CONTROLE_PROJETO/backups/versao_inicial/`: `demandas_otimizado (1).html`, `central-demandas/index.html`, `central-demandas/css/style.css`, `central-demandas/js/app.js`, `central-demandas/README.md`, `central-demandas/.gitignore` e `central-demandas/assets/images/.gitkeep`.

**O que foi alterado:** criada somente a camada documental e de cópias; registrados funcionamento atual, diferenças entre entradas, design aprovado, estrutura real, limites, estado do Git, convenção de backups e procedimentos de reversão.

**Funcionalidades afetadas:** nenhuma. Não foi editado HTML/CSS/JavaScript existente nem acessado o armazenamento do navegador. Nenhuma dependência, integração, servidor ou rotina automática foi acrescentada.

**Testes/verificações desta tarefa:**

| Verificação | Resultado |
| --- | --- |
| Inventário anterior e comparação final | 17 arquivos preexistentes preservados, mesmos tamanhos e SHA-256; nenhum removido. |
| Backup inicial | 7/7 arquivos copiados, 92.385 bytes, com SHA-256 e tamanhos idênticos; estrutura relativa e arquivos ocultos preservados. |
| Escopo do backup | Somente o original e `central-demandas`; sem `.git`, `node_modules`, temporários, perfis ou cópia recursiva de backups. Manifesto separado dos sete arquivos da aplicação. |
| Documentação | Seis documentos solicitados e AGENTS presentes; referências locais conferidas; funcionalidades/design fundamentados no código. |
| Git | Consulta restrita ao projeto; repositório ancestral identificado; zero arquivos do projeto rastreados; sem commit, staging, reset ou limpeza. |
| Navegador/console | Não executados nesta tarefa documental. Relatórios anteriores consultados separadamente: 225 verificações aprovadas, zero falhas/erros capturados. |

**Backup anterior à implantação:** `versao_inicial`, criado a partir dos arquivos preexistentes antes de acrescentar documentação. Os novos documentos não tinham versão anterior; não constam do payload desse backup.

**Commit Git:** não existe commit desta alteração. Nenhum commit foi criado.

**Reversão:** os arquivos funcionais já permanecem no estado anterior. Para desfazer apenas a implantação do controle, após pedido explícito e backup separado do estado atual, arquive `AGENTS.md` e a documentação em vez de apagá-los indiscriminadamente; preserve os backups existentes. Para recuperar arquivos da aplicação, use [INSTRUCOES_REVERSAO.md](INSTRUCOES_REVERSAO.md). Nenhuma reversão foi executada.

## Modelo para a próxima entrada

Copie este modelo ao fim da sequência de entradas, preenchendo somente informações verificadas:

```text
Data e horário (ISO 8601 com fuso):
Identificação e título da alteração:
Solicitação do usuário / escopo autorizado:
Arquivos existentes modificados:
Arquivos adicionados ou removidos:
O que foi alterado e por quê:
Funcionalidades afetadas e impactos:
Alterações anteriores não registradas encontradas e como foram preservadas:
Testes realizados:
Resultados e limitações de verificação:
Backup anterior (ID, escopo e manifesto):
Commit Git (hash real ou "não criado"):
Como reverter esta alteração preservando as posteriores:
Pendências:
```
