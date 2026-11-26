$root = Split-Path -Parent $PSScriptRoot
$indexPath = Join-Path $root "index.html"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:3005/")
$listener.Start()
$asyncResult = $listener.BeginGetContext({
    param($ar)
    $ctx = $listener.EndGetContext($ar)
    $bytes = [System.IO.File]::ReadAllBytes($indexPath)
    $ctx.Response.ContentType = "text/html"
    $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    $ctx.Response.Close()
}, $null)
$wc = New-Object System.Net.WebClient
$content = $wc.DownloadString("http://localhost:3005/")
Write-Host "DOWNLOADED_LENGTH:" $content.Length
Write-Host "CONTAINS_TITLE:" ($content.Contains("Chronicles RPG"))
$listener.Stop()