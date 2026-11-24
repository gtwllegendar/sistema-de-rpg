try {
    $p = Start-Process powershell -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File C:\Users\gabriel62169216\.gemini\antigravity\scratch\rpg-sheet-manager\start_server.ps1" -PassThru
    Start-Sleep -Seconds 2
    $resp = Invoke-WebRequest -Uri "http://localhost:3000/" -UseBasicParsing
    Write-Host "STATUS:" $resp.StatusCode
    Write-Host "CONTENT_LENGTH:" $resp.Content.Length
    Write-Host "TITLE_MATCH:" ($resp.Content -match "Chronicles RPG")
} catch {
    Write-Host "ERROR:" $_
} finally {
    if ($p) {
        Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
    }
}