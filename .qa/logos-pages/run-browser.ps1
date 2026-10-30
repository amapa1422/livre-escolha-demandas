param([string]$TestFile = 'browser-tests.js', [string]$OutputFile = 'chrome-results.json')
$ErrorActionPreference = 'Stop'
# Reutiliza somente o transporte C# já existente; mantém uma sessão CDP durante todo o teste.
$transportSource = Get-Content -LiteralPath (Join-Path $PSScriptRoot '../cdp.ps1') -Raw -Encoding UTF8
$transport = [regex]::Match($transportSource, "(?s)Add-Type -TypeDefinition @'\r?\n(.*?)\r?\n'@")
if (!$transport.Success) { throw 'Transporte CDP não encontrado.' }
Add-Type -TypeDefinition $transport.Groups[1].Value
$targets = Invoke-RestMethod 'http://127.0.0.1:9228/json/list'
$target = $targets | Where-Object { $_.type -eq 'page' } | Select-Object -First 1
if ($target.url -ne 'http://127.0.0.1:8765/.qa/logos-pages/runner.html') { throw 'Use somente o runner isolado.' }
$socket = New-Object QaSocket
$socket.Connect($target.webSocketDebuggerUrl)
$events = New-Object System.Collections.Generic.List[object]
function Invoke-QaCdp($id, $method, $parameters) {
    $socket.Send((@{id=$id;method=$method;params=$parameters} | ConvertTo-Json -Depth 20 -Compress))
    do {
        $reply = $socket.Read() | ConvertFrom-Json
        if ($reply.method -in @('Runtime.exceptionThrown','Log.entryAdded') -or ($reply.method -eq 'Runtime.consoleAPICalled' -and $reply.params.type -eq 'error')) { $events.Add($reply) }
    } while ($reply.id -ne $id)
    return $reply
}
try {
    Invoke-QaCdp 1 'Page.enable' @{} | Out-Null
    Invoke-QaCdp 2 'Network.clearBrowserCache' @{} | Out-Null
    $instrument = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'instrument.json') -Raw -Encoding UTF8 | ConvertFrom-Json
    Invoke-QaCdp 3 'Page.addScriptToEvaluateOnNewDocument' $instrument | Out-Null
    Invoke-QaCdp 4 'Runtime.enable' @{} | Out-Null
    Invoke-QaCdp 5 'Log.enable' @{} | Out-Null
    if ($TestFile -eq 'browser-tests.js') {
        Invoke-QaCdp 6 'Runtime.evaluate' @{expression="document.querySelectorAll('iframe').forEach(f=>f.remove())"} | Out-Null
    }
    $expression = "fetch('/.qa/logos-pages/" + $TestFile + "').then(r=>r.text()).then(code=>(0,eval)(code))"
    $result = Invoke-QaCdp 7 'Runtime.evaluate' @{expression=$expression;awaitPromise=$true;returnByValue=$true;userGesture=$true}
    $result | Add-Member -NotePropertyName consoleEvents -NotePropertyValue @($events.ToArray())
    [IO.File]::WriteAllText((Join-Path $PSScriptRoot $OutputFile), ($result | ConvertTo-Json -Depth 30), (New-Object Text.UTF8Encoding($false)))
    $result.result.result.value | Select-Object passed,failed,errors | ConvertTo-Json -Depth 5
    Write-Output ('Eventos de console: ' + $events.Count)
} finally { $socket.Close() }
