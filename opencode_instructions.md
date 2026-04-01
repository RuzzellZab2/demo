# Инструкции по настройке OpenCode для разработчика

## Установка OpenCode

### Требования
- Node.js 18+ и npm
- Git
- Доступ к терминалу

### Установка через npm
```bash
npm install -g @opencode/cli
```

### Проверка установки
```bash
opencode --version
```

## Настройка проекта

### Инициализация OpenCode в проекте
```bash
cd /path/to/your/project
opencode init
```

### Конфигурационный файл
Создается `.opencode/config.yaml`:
```yaml
model: deepseek/deepseek-chat
temperature: 0.7
max_tokens: 4000
context_window: 16000
system_prompt: |
  Ты помогаешь разрабатывать проект.
  Следуй инструкциям из AGENTS.md.
  Будь лаконичным и конкретным в ответах.
```

### Настройка модели
В `config.yaml` можно указать:
- `model` — модель AI (deepseek/deepseek-chat, gpt-4, и т.д.)
- `temperature` — креативность (0.0-1.0)
- `max_tokens` — максимальная длина ответа
- `context_window` — размер контекста

## Работа с OpenCode

### Запуск
```bash
opencode
```

### Основные команды
- `/help` — справка по командам
- `/exit` — выход
- `/clear` — очистка истории
- `/config` — просмотр конфигурации

### Файл AGENTS.md
Создайте `AGENTS.md` с инструкциями для AI:
- Контекст проекта
- Стиль кода
- Рабочие процессы
- Контакты

## Документация

### Официальная документация
- [OpenCode Docs](https://opencode.ai/docs) — основная документация
- [Getting Started](https://opencode.ai/docs/getting-started) — начало работы
- [Configuration](https://opencode.ai/docs/configuration) — настройка
- [Commands](https://opencode.ai/docs/commands) — команды CLI

### GitHub
- [Репозиторий OpenCode](https://github.com/anomalyco/opencode)
- [Issues](https://github.com/anomalyco/opencode/issues) — баги и фичи
- [Discussions](https://github.com/anomalyco/opencode/discussions) — обсуждения

### Сообщество
- [Discord](https://discord.gg/opencode) — чат поддержки
- [Twitter](https://twitter.com/opencodeai) — анонсы

## Лучшие практики

### Структура проекта
```
project/
├── .opencode/
│   └── config.yaml
├── AGENTS.md
├── README.md
└── src/
```

### Инструкции для AI
В `AGENTS.md` включайте:
- Технологии проекта
- Стиль кода
- Git workflow
- Контакты разработчиков

### Безопасность
- Не коммитьте `config.yaml` с API ключами
- Используйте `.gitignore` для секретов
- Проверяйте код перед коммитом

## Решение проблем

### Проверка установки
```bash
which opencode
node --version
npm --version
```

### Обновление OpenCode
```bash
npm update -g @opencode/cli
```

### Очистка кэша
```bash
opencode clear-cache
```

### Логи
Логи находятся в `~/.opencode/logs/`

## Интеграция с IDE

### VS Code
Установите расширение OpenCode из Marketplace

### JetBrains IDE
Используйте терминальный плагин

### Neovim/Tmux
Работа через терминал

## Дополнительные ресурсы

### Примеры конфигураций
- [Примеры на GitHub](https://github.com/anomalyco/opencode-examples)

### Видео туториалы
- [YouTube канал](https://youtube.com/@opencodeai)

### Блог
- [Блог OpenCode](https://opencode.ai/blog)

## Контакты поддержки

- Email: support@opencode.ai
- GitHub Issues: для багов
- Discord: для вопросов сообщества
- Twitter: для анонсов

---

*Обновлено: 01.04.2026*