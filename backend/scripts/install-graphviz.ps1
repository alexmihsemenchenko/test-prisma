# Скрипт для установки Graphviz на Windows
# Использование: .\scripts\install-graphviz.ps1

Write-Host "Установка Graphviz для Windows..." -ForegroundColor Cyan

# URL установщика Graphviz (последняя стабильная версия)
$graphvizUrl = "https://gitlab.com/api/v4/projects/4207231/packages/generic/graphviz-releases/11.0.0/windows_10_cmake_Release_graphviz-install-11.0.0-win64.exe"
$installerPath = "$env:TEMP\graphviz-installer.exe"

Write-Host "Скачивание установщика..." -ForegroundColor Yellow
try {
    # Пытаемся скачать установщик
    Invoke-WebRequest -Uri $graphvizUrl -OutFile $installerPath -UseBasicParsing
    Write-Host "Установщик скачан успешно!" -ForegroundColor Green
    
    Write-Host "`nЗапуск установщика..." -ForegroundColor Yellow
    Write-Host "ВНИМАНИЕ: Установщик откроется в интерактивном режиме." -ForegroundColor Yellow
    Write-Host "Пожалуйста, завершите установку и убедитесь, что Graphviz добавлен в PATH." -ForegroundColor Yellow
    
    # Запускаем установщик
    Start-Process -FilePath $installerPath -Wait
    
    Write-Host "`nУстановка завершена!" -ForegroundColor Green
    Write-Host "Очистка временных файлов..." -ForegroundColor Yellow
    Remove-Item $installerPath -ErrorAction SilentlyContinue
    
    # Проверяем установку
    Write-Host "`nПроверка установки..." -ForegroundColor Cyan
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    
    $dotPath = Get-Command dot -ErrorAction SilentlyContinue
    $gvprPath = Get-Command gvpr -ErrorAction SilentlyContinue
    
    if ($dotPath -or $gvprPath) {
        Write-Host "✓ Graphviz успешно установлен!" -ForegroundColor Green
        if ($dotPath) {
            & dot -V
        }
    } else {
        Write-Host "⚠ Graphviz установлен, но не найден в PATH." -ForegroundColor Yellow
        Write-Host "Пожалуйста, перезапустите терминал или добавьте вручную:" -ForegroundColor Yellow
        Write-Host "C:\Program Files\Graphviz\bin" -ForegroundColor White
    }
    
} catch {
    Write-Host "Ошибка при скачивании: $_" -ForegroundColor Red
    Write-Host "`nАльтернативный способ установки:" -ForegroundColor Yellow
    Write-Host "1. Перейдите на https://graphviz.org/download/" -ForegroundColor White
    Write-Host "2. Скачайте установщик для Windows" -ForegroundColor White
    Write-Host "3. Запустите установщик и следуйте инструкциям" -ForegroundColor White
    Write-Host "4. Убедитесь, что при установке выбрана опция 'Add Graphviz to the system PATH'" -ForegroundColor White
}

