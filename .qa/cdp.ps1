param([string]$Method = 'Runtime.evaluate', [string]$ParamsFile, [string]$ScriptFile, [int]$Port = 9228, [string]$OutputFile, [int]$ViewportWidth, [int]$ViewportHeight)
$ErrorActionPreference = 'Stop'
Add-Type -TypeDefinition @'
using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
public class QaSocket {
  ClientWebSocket socket = new ClientWebSocket();
  public void Connect(string uri) { socket.Options.Proxy = null; socket.ConnectAsync(new Uri(uri), CancellationToken.None).GetAwaiter().GetResult(); }
  public void Send(string text) {
    var bytes = Encoding.UTF8.GetBytes(text);
    socket.SendAsync(new ArraySegment<byte>(bytes), WebSocketMessageType.Text, true, CancellationToken.None).GetAwaiter().GetResult();
  }
  public string Read() {
    var result = new StringBuilder();
    var bytes = new byte[65536];
    using (var timeout = new CancellationTokenSource(55000)) {
      WebSocketReceiveResult part;
      do {
        part = socket.ReceiveAsync(new ArraySegment<byte>(bytes), timeout.Token).GetAwaiter().GetResult();
        if (part.MessageType == WebSocketMessageType.Close) throw new InvalidOperationException("Browser connection closed");
        result.Append(Encoding.UTF8.GetString(bytes, 0, part.Count));
      } while (!part.EndOfMessage);
    }
    return result.ToString();
  }
  public void Close() { socket.Dispose(); }
}
'@
$targets = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/json/list"
$target = $targets | Where-Object { $_.type -eq 'page' } | Select-Object -First 1
$socket = New-Object QaSocket
$socket.Connect($target.webSocketDebuggerUrl)
$parameters = @{}
if ($ParamsFile) { $parameters = Get-Content -LiteralPath $ParamsFile -Raw -Encoding UTF8 | ConvertFrom-Json }
if ($ScriptFile) { $parameters = @{ expression = (Get-Content -LiteralPath $ScriptFile -Raw -Encoding UTF8); awaitPromise = $true; returnByValue = $true; userGesture = $true } }
try {
  if ($ViewportWidth) {
    $socket.Send((@{id=2; method='Emulation.setDeviceMetricsOverride'; params=@{width=$ViewportWidth;height=$ViewportHeight;deviceScaleFactor=1;mobile=$false}} | ConvertTo-Json -Depth 5 -Compress))
    do { $reply = $socket.Read(); $result = $reply | ConvertFrom-Json } while ($result.id -ne 2)
    Start-Sleep -Milliseconds 300
  }
  $socket.Send((@{ id = 1; method = $Method; params = $parameters } | ConvertTo-Json -Depth 30 -Compress))
  if ($Method -eq 'Browser.close') { return }
  do { $reply = $socket.Read(); $result = $reply | ConvertFrom-Json } while ($result.id -ne 1)
  if ($OutputFile) { [IO.File]::WriteAllText((Join-Path $PWD $OutputFile), $reply, (New-Object System.Text.UTF8Encoding($false))) }
  else { $reply }
} finally { $socket.Close() }
