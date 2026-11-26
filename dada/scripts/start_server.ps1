$root = Split-Path -Parent $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:3000/")
$listener.Start()

Write-Host "Chronicles RPG rodando em http://localhost:3000/"
Write-Host "Diretorio: $root"
Start-Process "http://localhost:3000/"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $relativePath = $context.Request.Url.AbsolutePath.TrimStart("/")
        if ([string]::IsNullOrWhiteSpace($relativePath)) {
            $relativePath = "index.html"
        }

        $filePath = [System.IO.Path]::GetFullPath((Join-Path $root $relativePath.Replace("/", "\")))
        $prefix = [System.IO.Path]::GetFullPath($root)

        if (-not $filePath.StartsWith($prefix, [System.StringComparison]::OrdinalIgnoreCase) -or -not (Test-Path $filePath -PathType Leaf)) {
            $context.Response.StatusCode = 404
            $bytes = [System.Text.Encoding]::UTF8.GetBytes("404 - Arquivo nao encontrado")
        } else {
            $extension = [System.IO.Path]::GetExtension($filePath).ToLowerInvariant()
            $contentTypes = @{
                ".html" = "text/html; charset=utf-8"
                ".css" = "text/css; charset=utf-8"
                ".js" = "text/javascript; charset=utf-8"
                ".json" = "application/json"
                ".svg" = "image/svg+xml"
            }
            $context.Response.ContentType = if ($contentTypes.ContainsKey($extension)) { $contentTypes[$extension] } else { "application/octet-stream" }
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
        }

        $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
        $context.Response.OutputStream.Close()
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
