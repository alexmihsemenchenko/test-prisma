# Скрипт для отображения структуры проекта с фильтрацией
# Использование: .\scripts\show-structure.ps1 [src|full]

param(
    [string]$Scope = "src"
)

if ($Scope -eq "src") {
    Write-Host "`n=== Структура исходного кода (src/) ===" -ForegroundColor Cyan
    tree /F /A src
} else {
    Write-Host "`n=== Полная структура проекта ===" -ForegroundColor Cyan
    tree /F /A . | Select-String -Pattern "node_modules|dist|\.git" -NotMatch
}

Write-Host "`nДля сохранения в файл используйте: npm run structure" -ForegroundColor Yellow

