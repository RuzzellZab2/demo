# План: Выполнение реорганизации документации проекта

## Текущее состояние (проверено)

### Отслеживаемые git файлы:
1. `.opencode/config.yaml` (9 строк) - ссылается на `AGENTS.md` в корне
2. `AGENTS.md` (5687 строк) - инструкции для AI-агентов, в корне
3. `README.md` (86 строк) - основная документация, 3 ссылки на `CONTRIBUTING.md`
4. `opencode_instructions.md` (4303 строк) - настройка OpenCode, в корне
5. `src/spec.md` (1496 строк) - техническая спецификация, уже в `src/`

### Неотслеживаемые:
1. `.opencode/plans/` - папка с планами (нужно добавить в git)
2. `testing/` - папка с тестовыми файлами, включает `CONTRIBUTING.md` (12997 строк)

### Проблемы для решения:
1. **Ссылки в README.md:** 3 ссылки на `CONTRIBUTING.md` (файл в `testing/`, не отслеживается git)
2. **Ссылка в config.yaml:** ссылается на `AGENTS.md` (будет перенесен в `src/`)
3. **Расположение файлов:** `AGENTS.md` и `opencode_instructions.md` в корне, должны быть в `src/`
4. **CONTRIBUTING.md:** в `testing/`, исключен через `.gitignore`, дублирует информацию из `AGENTS.md`

## Детальный план выполнения

### Фаза 1: Перенос документации в src/

**Шаг 1.1:** Перенос AGENTS.md
```bash
git mv AGENTS.md src/
```

**Шаг 1.2:** Перенос opencode_instructions.md
```bash
git mv opencode_instructions.md src/
```

**Шаг 1.3:** CONTRIBUTING.md
- Оставить в `testing/` (уже там, исключен через `.gitignore`)
- Убрать все ссылки на него из README.md

### Фаза 2: Обновление README.md (файл: README.md:87)

**Шаг 2.1:** Обновить ссылку "Разработка и тестирование"
- **Строка 47:** `[CONTRIBUTING.md](CONTRIBUTING.md)` → `[src/AGENTS.md](src/AGENTS.md)`

**Шаг 2.2:** Обновить ссылку "Спецификация"
- **Строка 51:** `[CONTRIBUTING.md](CONTRIBUTING.md#спецификация)` → `[src/spec.md](src/spec.md)`

**Шаг 2.3:** Обновить ссылку "Вклад в проект"
- **Строка 73:** `[CONTRIBUTING.md](CONTRIBUTING.md)` → `[src/AGENTS.md](src/AGENTS.md)`

**Шаг 2.4:** Добавить раздел "Структура проекта"
- **Место:** После строки 18 (после раздела "Быстрый старт")
- **Содержание:**
```markdown
## Структура проекта

```
memory-game/
├── index.html          # Основная HTML-страница
├── style.css           # Стили игры
├── README.md           # Основная документация
├── src/                # Исходный код и документация
│   ├── game.js         # Логика игры
│   ├── spec.md         # Техническая спецификация
│   ├── AGENTS.md       # Инструкции для AI-агентов
│   └── opencode_instructions.md # Настройка OpenCode
├── .opencode/          # Конфигурация AI-агентов
│   └── config.yaml     # Конфиг OpenCode
└── testing/            # Тестовые файлы и отчеты
```

**Шаг 2.5:** Добавить раздел "Документация"
- **Место:** После строки 52 (после раздела "Спецификация")
- **Содержание:**
```markdown
## Документация

Проект использует модульную структуру документации:

### Основные файлы
- [src/AGENTS.md](src/AGENTS.md) — инструкции для AI-агентов и разработчиков
- [src/spec.md](src/spec.md) — техническая спецификация игры
- [src/opencode_instructions.md](src/opencode_instructions.md) — настройка OpenCode

### Конфигурация
- [.opencode/config.yaml](.opencode/config.yaml) — конфигурация AI-агентов

### Тестирование
- [testing/](testing/) — тестовые файлы, скрипты и отчеты
```

### Фаза 3: Обновление .opencode/config.yaml

**Шаг 3.1:** Обновить ссылку на AGENTS.md
- **Файл:** `.opencode/config.yaml`
- **Строка 8:** `AGENTS.md` → `src/AGENTS.md`
- **Полное обновление строки 8:** `Следуй инструкциям из AGENTS.md.` → `Следуй инструкциям из src/AGENTS.md.`

### Фаза 4: Добавление планов в git

**Шаг 4.1:** Добавить папку планов в отслеживание
```bash
git add .opencode/plans/
```

### Фаза 5: Проверка изменений

**Шаг 5.1:** Проверить git статус
```bash
git status
```

**Шаг 5.2:** Проверить diff изменений
```bash
git diff --staged
```

**Шаг 5.3:** Проверить все ссылки
```bash
# Проверить ссылки в README.md
grep -n "\[.*\]\(.*\)" README.md

# Проверить ссылку в config.yaml
grep "AGENTS.md" .opencode/config.yaml
```

### Фаза 6: Создание коммита и push

**Шаг 6.1:** Создать коммит
```bash
git commit -m "reorganize documentation structure

- Move AGENTS.md and opencode_instructions.md to src/
- Update README.md with new documentation structure
- Update .opencode/config.yaml with new AGENTS.md path
- Add .opencode/plans/ to git tracking"
```

**Шаг 6.2:** Отправить изменения на GitHub
```bash
git push https://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@github.com/RuzzellZab2/demo.git
```

## Ожидаемый результат после выполнения

### Структура файлов:
```
memory-game/
├── index.html
├── style.css
├── README.md (обновленный)
├── src/
│   ├── game.js
│   ├── spec.md
│   ├── AGENTS.md (перенесен)
│   └── opencode_instructions.md (перенесен)
├── .opencode/
│   ├── config.yaml (обновленный)
│   └── plans/ (отслеживается git)
└── testing/ (не отслеживается)
    └── CONTRIBUTING.md (остается здесь)
```

### Работающие ссылки:
1. README.md → src/AGENTS.md ✓
2. README.md → src/spec.md ✓
3. README.md → .opencode/config.yaml ✓
4. config.yaml → src/AGENTS.md ✓

### Git статус:
- Все изменения staged и закоммичены
- `.opencode/plans/` отслеживается git
- `testing/` остается неотслеживаемым (правильно)

## Проверки качества

### Проверка 1: Все ссылки корректны
```bash
# После выполнения проверить:
[ -f "src/AGENTS.md" ] && echo "AGENTS.md существует"
[ -f "src/spec.md" ] && echo "spec.md существует"
[ -f "src/opencode_instructions.md" ] && echo "opencode_instructions.md существует"
[ -f ".opencode/config.yaml" ] && echo "config.yaml существует"
```

### Проверка 2: README.md валиден
- Все заголовки корректны
- Списки отформатированы правильно
- Дерево файлов актуально

### Проверка 3: OpenCode работает
- config.yaml загружается без ошибок
- Ссылка на AGENTS.md работает

## Риски и решения

### Риск 1: Сломанные ссылки
**Решение:** Проверить все ссылки в README.md и config.yaml перед коммитом

### Риск 2: OpenCode не найдет AGENTS.md
**Решение:** Обновить config.yaml с абсолютным путем `src/AGENTS.md`

### Риск 3: CONTRIBUTING.md все еще упоминается
**Решение:** Убедиться, что все 3 ссылки в README.md обновлены

### Риск 4: Структура дерева неактуальна
**Решение:** Проверить актуальность дерева файлов в разделе "Структура проекта"

### Риск 5: Конфликты при push
**Решение:** Сначала pull, затем push, или использовать force если необходимо

## Время выполнения
- Фаза 1-3: 5-10 минут
- Фаза 4-5: 2-3 минуты
- Фаза 6: 1-2 минуты
- **Итого:** 8-15 минут

## Примечания

1. **CONTRIBUTING.md** остается в `testing/` как исторический/тестовый файл
2. **.opencode/plans/** добавляется в git для отслеживания истории планов
3. **testing/** остается неотслеживаемым через `.gitignore`
4. Все изменения выполняются через `git mv` для сохранения истории
5. Коммит-сообщение подробное для ясности изменений

---

**Файл плана:** `.opencode/plans/execute_documentation_reorganization.md`
**Дата создания:** 01.04.2026
**Статус:** Готов к выполнению
**Зависимости:** Нет
**Приоритет:** Высокий