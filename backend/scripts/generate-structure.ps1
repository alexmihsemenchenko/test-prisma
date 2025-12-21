# Скрипт для генерации структуры проекта
# Использование: .\scripts\generate-structure.ps1 [путь]

param(
    [string]$Path = ".",
    [switch]$Clean = $false  # Исключить generated, dist, node_modules
)

$outputFile = "docs\project-structure.txt"
if ($Clean) {
    $outputFile = "docs\project-structure-clean.txt"
}

# Получаем абсолютный путь
$fullPath = Resolve-Path $Path

Write-Host "Генерация структуры проекта: $fullPath" -ForegroundColor Cyan
Write-Host "Выходной файл: $outputFile" -ForegroundColor Yellow

# Создаем директорию docs если нет
$docsDir = Join-Path $Path "docs"
if (-not (Test-Path $docsDir)) {
    New-Item -ItemType Directory -Path $docsDir | Out-Null
}

# Запускаем tree
$treeOutput = & tree /F /A $fullPath 2>&1 | Out-String

# Если нужно очистить от generated, dist, node_modules
if ($Clean) {
    $lines = $treeOutput -split "`r?`n"
    $filteredLines = @()
    $skipLine = $false
    
    foreach ($line in $lines) {
        # Пропускаем строки с excluded папками
        if ($line -match 'generated|dist|node_modules|\.git') {
            $skipLine = $true
            continue
        }
        
        # Если строка не содержит исключенных папок
        if ($line -notmatch 'generated|dist|node_modules|\.git') {
            $filteredLines += $line
            $skipLine = $false
        }
    }
    
    $treeOutput = $filteredLines -join "`r`n"
}

# Сохраняем в файл
$outputPath = Join-Path $Path $outputFile
$treeOutput | Out-File -FilePath $outputPath -Encoding UTF8

Write-Host "Структура проекта сохранена в $outputFile" -ForegroundColor Green
