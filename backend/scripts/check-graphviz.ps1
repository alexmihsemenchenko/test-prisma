# Скрипт для проверки установки Graphviz
# Использование: .\scripts\check-graphviz.ps1

Write-Host "Проверка установки Graphviz..." -ForegroundColor Cyan

# Обновляем PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

$dotPath = Get-Command dot -ErrorAction SilentlyContinue
$gvprPath = Get-Command gvpr -ErrorAction SilentlyContinue

if ($dotPath) {
    Write-Host "✓ Graphviz установлен!" -ForegroundColor Green
    Write-Host "Версия dot:" -ForegroundColor Yellow
    & dot -V
    Write-Host "`nРасположение: $($dotPath.Source)" -ForegroundColor Gray
} elseif ($gvprPath) {
    Write-Host "✓ Graphviz установлен (найден gvpr)!" -ForegroundColor Green
    Write-Host "Расположение: $($gvprPath.Source)" -ForegroundColor Gray
} else {
    Write-Host "✗ Graphviz не найден в PATH" -ForegroundColor Red
    Write-Host "`nВозможные пути установки:" -ForegroundColor Yellow
    
    $possiblePaths = @(
        "C:\Program Files\Graphviz\bin",
        "C:\Program Files (x86)\Graphviz\bin",
        "$env:ProgramFiles\Graphviz\bin"
    )
    
    $found = $false
    foreach ($path in $possiblePaths) {
        if (Test-Path $path) {
            Write-Host "  ✓ Найден в: $path" -ForegroundColor Green
            Write-Host "  Добавьте этот путь в переменную окружения PATH" -ForegroundColor Yellow
            $found = $true
        }
    }
    
    if (-not $found) {
        Write-Host "  Graphviz не найден в стандартных местах" -ForegroundColor Red
        Write-Host "`nДля установки используйте:" -ForegroundColor Yellow
        Write-Host "  .\scripts\install-graphviz.ps1" -ForegroundColor White
        Write-Host "  или" -ForegroundColor White
        Write-Host "  Скачайте с https://graphviz.org/download/" -ForegroundColor White
    }
}

