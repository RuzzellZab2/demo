# Руководство по вкладу в проект Memory Game

## Быстрый старт

### Установка окружения
```bash
# Клонирование репозитория
git clone https://github.com/RuzzellZab2d/memory-game.git
cd memory-game

# Установка зависимостей (если есть)
npm install
```

### Настройка OpenCode для разработки

OpenCode — AI-агент для помощи в разработке. Установка и настройка:

**Установка:**
```bash
# Установка через официальный скрипт
curl -fsSL https://opencode.ai/install | bash

# Или через npm
npm install -g opencode

# Или через bun
bun install -g opencode
```

**Базовая конфигурация:**
Создайте файл `.opencode/config.yaml` в корне проекта:
```yaml
model: deepseek/deepseek-chat
temperature: 0.7
max_tokens: 4000
context_window: 16000
```

**Документация и ресурсы:**
- [Официальный сайт OpenCode](https://opencode.ai)
- [Документация OpenCode](https://opencode.ai/docs)
- [GitHub репозиторий](https://github.com/anomalyco/opencode)
- [Сообщество в Discord](https://discord.gg/opencode)

**Основные команды:**
```bash
# Запуск OpenCode в текущей директории
opencode

# Запуск с указанием модели
opencode --model gpt-4

# Просмотр истории сессий
opencode --history

# Справка по командам
opencode --help
```

### Запуск игры
```bash
# Через Python
python3 -m http.server 8080

# Через Node.js
npx serve .
```

Откройте http://localhost:8080 в браузере.

## Разработка

### Добавление новой функциональности
1. Создайте ветку от `main`:
   ```bash
   git checkout -b feature/название-фичи
   ```

2. Реализуйте изменения:
   - Следуйте существующей архитектуре
   - Используйте чистый JavaScript (ES6+)
   - Не добавляйте сторонние зависимости без необходимости

3. Протестируйте изменения:
   ```bash
   # Запустите существующие тесты
   node test-memory.js
   
   # Проверьте вручную
   python3 -m http.server 8080
   ```

4. Создайте pull request с описанием изменений


### Требования к коду
- Все функции должны быть чистыми (pure) где возможно
- Избегайте глобальных переменных
- Используйте `const` для неизменяемых значений
- Используйте `let` только для изменяемых переменных
- Избегайте `var`

## Тестирование

### Тест-сценарии
Полный список тест-сценариев в [src/testing/testing_scripts_memory_game.md](src/testing/testing_scripts_memory_game.md)

## Структура проекта

```
.
├── AGENTS.md                    # Конфигурация AI-агентов
├── CONTRIBUTING.md              # Руководство по вкладу
├── .gitignore                   # Игнорируемые файлы Git
├── index.html                   # Основной HTML-файл игры
├── opencode.jsonc               # Конфигурация OpenCode
├── README.md                    # Описание проекта
├── style.css                    # Стили игры
└── src/                         # Папка для разработчиков
```

**Описание файлов:**
- `index.html`, `style.css` — фронтенд игры Memory Game
- `AGENTS.md` — инструкции для AI-агентов
- `CONTRIBUTING.md` — руководство для контрибьюторов
- `README.md` — общая документация проекта

