# Документация проекта

## Граф зависимостей

Для генерации графа зависимостей используется [Madge](https://github.com/pahen/madge).

### Доступные команды:

- `npm run dep:graph` - Генерирует SVG граф (требует Graphviz)
- `npm run dep:image` - Генерирует PNG граф (требует Graphviz)
- `npm run dep:json` - Генерирует JSON файл с зависимостями
- `npm run dep:dot` - Генерирует DOT формат (для Graphviz)
- `npm run dep:circular` - Проверяет наличие циклических зависимостей
- `npm run dep:orphans` - Находит файлы без зависимостей

### Установка Graphviz для визуализации

Для генерации изображений (SVG/PNG) требуется установленный Graphviz.

**Windows (автоматическая установка):**
```powershell
.\scripts\install-graphviz.ps1
```

**Windows (ручная установка):**
1. Скачайте установщик с [официального сайта](https://graphviz.org/download/)
2. Запустите установщик и следуйте инструкциям
3. Убедитесь, что выбрана опция "Add Graphviz to the system PATH"

**Проверка установки:**
```powershell
.\scripts\check-graphviz.ps1
```

**macOS:**
```bash
brew install graphviz
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install graphviz
```

После установки Graphviz команды `npm run dep:graph` и `npm run dep:image` будут работать.

✅ **Graphviz установлен!** Все команды для визуализации доступны.

### Просмотр DOT файлов

Если Graphviz не установлен, вы можете:
1. Использовать онлайн сервисы для просмотра DOT файлов (например, [Graphviz Online](https://dreampuf.github.io/GraphvizOnline/))
2. Использовать VS Code расширение "Graphviz Preview"

### Конфигурация

Конфигурация Madge находится в файле `.madgerc`. По умолчанию исключаются:
- Тестовые файлы (`.spec.ts`)
- Скомпилированные файлы (`dist`)
- Сгенерированный код (`generated`)
- Файлы деклараций (`.d.ts`)

## Структура проекта

Для просмотра структуры папок и файлов проекта используются команды:

### Доступные команды:

- `npm run structure` - Сохраняет структуру папки `src/` в файл `docs/project-structure.txt`
- `npm run structure:full` - Сохраняет полную структуру проекта в файл `docs/project-structure-full.txt`
- `npm run structure:show` - Показывает структуру `src/` в терминале
- `npm run structure:src` - Показывает структуру `src/` в терминале (альтернатива)

### Пример использования:

```bash
# Просмотр структуры в терминале
npm run structure:show

# Сохранение структуры в файл
npm run structure
```

Структура будет сохранена в текстовый файл в папке `docs/`.

