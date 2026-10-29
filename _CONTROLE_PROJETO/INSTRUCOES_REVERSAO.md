# Instruções de reversão

Este documento é um procedimento para uso futuro. **Nenhuma restauração é executada pela abertura do documento, e nenhuma reversão foi feita na implantação do controle.**

## Regras obrigatórias

1. Leia o histórico e o estado atual. Identifique a alteração, os caminhos afetados e o backup/commit correspondente.
2. Confira o escopo autorizado pelo pedido de reversão. Explique impactos e conflitos com alterações posteriores antes de mudanças incompatíveis.
3. Antes de substituir qualquer arquivo, crie outro backup único do estado atual dos arquivos relevantes e da documentação que será atualizada. Confira hashes e registre esse ID.
4. Valide a integridade da versão que pretende restaurar. Preserve os caminhos relativos; o original monolítico e a versão organizada são entradas diferentes.
5. Não use `git reset --hard`, `git clean -fd`, sobrescritas em massa ou exclusões destrutivas sem autorização explícita do usuário. Não apague nem sobrescreva backups.
6. Depois de restaurar, teste o recurso e os relacionados, examine o console quando houver execução funcional e atualize histórico/estado. Registre a reversão como nova alteração, sem apagar o registro anterior.

**Restaurar código não restaura dados do navegador.** Não acione **Restaurar demo** para tentar recuperar arquivos ou registros antigos: ele substitui a lista local pelos exemplos.

## 1. Consultar histórico e versões disponíveis

Na raiz `C:\Users\felipe.lobato\Desktop\Demandas`, os seguintes comandos são somente leitura:

```powershell
Get-Content -LiteralPath '_CONTROLE_PROJETO/HISTORICO_ALTERACOES.md' -Encoding UTF8
Get-Content -LiteralPath '_CONTROLE_PROJETO/ESTADO_ATUAL.md' -Encoding UTF8
Get-ChildItem -LiteralPath '_CONTROLE_PROJETO/backups' -Directory
Get-Content -LiteralPath '_CONTROLE_PROJETO/backups/versao_inicial/MANIFESTO_SHA256.json' -Encoding UTF8
```

O backup inicial tem sete arquivos recuperáveis: o HTML original e os seis arquivos de `central-demandas`. `.qa` aparece no inventário de integridade do manifesto, mas **não foi copiada**. AGENTS e documentos de controle também não existiam antes desse snapshot. Não use o inventário de 17 arquivos como se fosse uma lista de 17 cópias.

## 2. Conferir a integridade do backup

Exemplo somente leitura para o backup inicial; interrompe em qualquer divergência:

```powershell
$ErrorActionPreference = 'Stop'
$restoreProjectRoot = (Resolve-Path -LiteralPath '.').Path
$restoreBackupRoot = (Resolve-Path -LiteralPath '_CONTROLE_PROJETO/backups/versao_inicial').Path
$restoreManifest = Get-Content -LiteralPath (Join-Path $restoreBackupRoot 'MANIFESTO_SHA256.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$restorePayload = @(Get-ChildItem -LiteralPath $restoreBackupRoot -Recurse -Force -File |
  Where-Object { $_.FullName -ne (Join-Path $restoreBackupRoot 'MANIFESTO_SHA256.json') })
if ($restorePayload.Count -ne $restoreManifest.file_count) { throw 'Quantidade de arquivos divergente.' }
foreach ($entry in $restoreManifest.files) {
  $candidate = [IO.Path]::GetFullPath((Join-Path $restoreBackupRoot $entry.path))
  if (!$candidate.StartsWith($restoreBackupRoot + '\', [StringComparison]::OrdinalIgnoreCase)) {
    throw 'Caminho fora do backup.'
  }
  $file = Get-Item -LiteralPath $candidate
  $hash = (Get-FileHash -LiteralPath $candidate -Algorithm SHA256).Hash
  if ($file.Length -ne $entry.bytes -or $hash -ne $entry.sha256) {
    throw ('Backup divergente: ' + $entry.path)
  }
}
'Backup conferido; nenhuma restauração executada.'
```

Se houver divergência, não sobrescreva a aplicação. Preserve o material e investigue a origem da diferença. SHA-256 permite conferir conteúdo contra o manifesto; não torna o backup inviolável.

## 3. Comparar a versão atual com um backup

No VS Code: clique com o botão direito no arquivo do backup → **Selecionar para Comparação**; depois no arquivo atual → **Comparar com Selecionado**. Confirme os caminhos no cabeçalho para evitar confundir as duas entradas.

Também é possível comparar hashes:

```powershell
Get-FileHash -LiteralPath 'central-demandas/js/app.js' -Algorithm SHA256
Get-FileHash -LiteralPath '_CONTROLE_PROJETO/backups/versao_inicial/central-demandas/js/app.js' -Algorithm SHA256
```

Ou usar o Git instalado, sem depender de arquivos rastreados:

```powershell
& 'C:\Users\felipe.lobato\AppData\Local\Programs\Git\cmd\git.exe' diff --no-index -- '_CONTROLE_PROJETO/backups/versao_inicial/central-demandas/js/app.js' 'central-demandas/js/app.js'
```

Em `git diff --no-index`, código de saída 1 significa que existem diferenças; não significa falha na restauração, pois esse comando não restaura nada.

## 4. Restaurar somente um arquivo

Exemplo para **`central-demandas/js/app.js`**, somente após solicitação que autorize sua restauração e após validar o backup. Não execute este exemplo por rotina: ele substitui o arquivo escolhido. Se houver alterações posteriores que devam permanecer, use o procedimento por alteração da próxima seção.

Primeiro, preserve o arquivo atual em um novo backup, sem sobrescrever outro:

```powershell
$ErrorActionPreference = 'Stop'
$restoreProjectRoot = (Resolve-Path -LiteralPath '.').Path
$restoreRelative = 'central-demandas/js/app.js'
$restoreCurrent = Join-Path $restoreProjectRoot $restoreRelative
$restoreZone = [TimeZoneInfo]::FindSystemTimeZoneById('E. South America Standard Time')
$restoreTime = [TimeZoneInfo]::ConvertTime([DateTimeOffset]::UtcNow, $restoreZone)
$restoreId = $restoreTime.ToString('yyyy-MM-dd_HHmmss') + '_antes-reversao_' + [guid]::NewGuid().ToString('N').Substring(0,8)
$restoreSafetyRoot = Join-Path $restoreProjectRoot ('_CONTROLE_PROJETO/backups/' + $restoreId)
if (Test-Path -LiteralPath $restoreSafetyRoot) { throw 'Destino já existe; escolha outro ID.' }
if (!(Test-Path -LiteralPath $restoreCurrent -PathType Leaf)) { throw 'Arquivo atual ausente; registre a ausência antes de planejar a restauração.' }
New-Item -ItemType Directory -Path (Join-Path $restoreSafetyRoot 'central-demandas/js') | Out-Null
[IO.File]::Copy($restoreCurrent, (Join-Path $restoreSafetyRoot $restoreRelative), $false)
$restoreHash = (Get-FileHash -LiteralPath $restoreCurrent -Algorithm SHA256).Hash
if ($restoreHash -ne (Get-FileHash -LiteralPath (Join-Path $restoreSafetyRoot $restoreRelative) -Algorithm SHA256).Hash) {
  throw 'A cópia preventiva não confere.'
}
$restoreSafetyManifest = [ordered]@{
  backup_id = $restoreId
  recorded_at = $restoreTime.ToString('yyyy-MM-ddTHH:mm:sszzz')
  scope = 'Parcial: somente o arquivo escolhido, antes da reversão'
  files = @(@{ path = $restoreRelative; bytes = (Get-Item -LiteralPath $restoreCurrent).Length; sha256 = $restoreHash })
}
$restoreSafetyManifest | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $restoreSafetyRoot 'MANIFESTO_SHA256.json') -Encoding UTF8
$restoreSafetyRoot
```

Esse exemplo protege somente o arquivo escolhido. Faça também um backup separado dos documentos de estado/histórico antes de atualizá-los, conforme `AGENTS.md`, e registre ambos os IDs. Nunca amplie o escopo para toda a árvore sem selecionar o que precisa ser protegido.

Depois da conferência e da autorização para esse arquivo, na mesma sessão, a substituição individual é:

```powershell
$restoreSource = Join-Path $restoreProjectRoot ('_CONTROLE_PROJETO/backups/versao_inicial/' + $restoreRelative)
[IO.File]::Copy($restoreSource, $restoreCurrent, $true)
if ((Get-FileHash -LiteralPath $restoreCurrent -Algorithm SHA256).Hash -ne (Get-FileHash -LiteralPath $restoreSource -Algorithm SHA256).Hash) {
  throw 'Arquivo restaurado divergente.'
}
```

Teste o fluxo afetado e registre o resultado. Para recuperar o HTML original, selecione explicitamente `demandas_otimizado (1).html` e adapte os caminhos de segurança; não substitua `index.html` por esse conteúdo monolítico.

## 5. Reverter somente uma alteração

1. Localize sua identificação no histórico e o backup anterior correspondente.
2. Compare o arquivo atual com o backup e, se existir, com o commit da alteração. Identifique também mudanças posteriores.
3. Preserve o estado atual em backup separado.
4. Sem commit disponível, aplique somente os trechos inversos da alteração identificada. Não copie um arquivo antigo inteiro se isso remover trabalho posterior que deve permanecer. Se os trechos forem inseparáveis, exponha o conflito e defina o escopo com o usuário antes de prosseguir.
5. Teste os comportamentos afetados e registre uma nova entrada de reversão.

O projeto não tem atualmente commits próprios. Se no futuro houver um commit real e isolado para a mudança, `git revert <hash-real>` pode gerar uma reversão rastreável, **após** verificar topo do repositório, escopo do commit, alterações locais e backup preventivo. Não use esse comando em um commit ancestral que contenha outros projetos. Não invente hashes ou execute `revert` sobre um exemplo literal.

## 6. Recuperar uma versão completa

1. Escolha um backup **completo** da aplicação. Um backup parcial não permite reconstruí-la sozinho.
2. Faça um backup completo separado da aplicação atual e dos documentos relevantes; registre também arquivos novos ausentes na versão de destino.
3. Valide o manifesto do destino e examine uma cópia de revisão antes de substituir a versão principal. Use perfil de navegador isolado se for testar a cópia, para não confundir dados locais.
4. Liste os arquivos a substituir. Para `versao_inicial`, são o original monolítico e os seis arquivos de `central-demandas`. O snapshot não contém `.qa` nem a documentação do controle.
5. Obtenha autorização explícita para a substituição em massa, caso essa operação esteja no escopo. Restaure somente a lista conferida, preservando caminhos e conteúdo. **Não limpe a raiz** para fazê-la coincidir com o backup; arquivos posteriores exigem decisão específica e backup antes de qualquer remoção.
6. Verifique hashes, referências CSS/JS e o fluxo completo da aplicação. Mantenha os backups e acrescente ao histórico o que foi restaurado, o que permaneceu e os resultados.

Não há comando de restauração em massa automatizado neste projeto. A ausência desse comando evita que uma recuperação de código apague o controle, outras versões ou trabalhos posteriores.

## 7. Uso adicional do Git

Na implantação deste controle, `git rev-parse --show-toplevel` em `Demandas` retornou `C:/Users/felipe.lobato`. Os arquivos do projeto estavam sem rastreamento e sem commits próprios. Portanto, **Git ainda não substitui o backup inicial**.

Antes de usar Git em uma tarefa futura, confirme novamente o topo e restrinja consultas e mudanças ao projeto. Não inicialize outro repositório, altere configuração global, faça staging amplo ou publique arquivos como parte implícita de uma reversão. Uma configuração futura de versionamento deve definir seu escopo e então registrar hashes reais no histórico. Commits não incluem `localStorage`.

## 8. Recuperação dos dados do navegador é separada

Os backups presentes não contêm demandas e prints cadastrados, porque esses registros estão em `localStorage`, nas chaves `livre_escolha_demandas_demo_v1` e `demandas_sidebar_closed`. São vinculados a navegador/perfil/origem; abrir a cópia de um arquivo em outro caminho pode apresentar outro armazenamento.

Não há importação/exportação de dados implementada. Para recuperar registros seria necessária uma cópia prévia dos dados e um procedimento específico, autorizado e validado separadamente. Não limpe o armazenamento, não migre esquemas nem restaure exemplos para tentar reparar uma versão do código.
