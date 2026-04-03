# План: Реструктуризация проекта Memory Game

## Текущее состояние

### Staged изменения:
1. `.opencode/config.yaml` (новый)
2. `AGENTS.md` (новый)
3. `opencode_instructions.md` (новый)
4. `src/game.js` (переименован из `game.js`)
5. `src/index.html` (переименован из `index.html`)
6. `src/spec.md` (переименован из `spec.md`)
7. `src/style.css` (переименован из `style.css`)

### Проблемы:
1. `index.html` в `src/` ссылается на `style.css` (строка 7) - относительный путь из корня
2. `index.html` в `src/` ссылается на `game.js` (строка 68) - относительный путь из корня
3. Файлы уже staged как новые в `src/`

### Цель:
- Перенести `index.html` и `style.css` из `src/` в корень
- Оставить `game.js` и `spec.md` в `src/`
- Обновить ссылки в `index.html`
- Сохранить все изменения через git

## Детальный план действий

### Шаг 1: Отмена staging для файлов, которые нужно перенести
```bash
git restore --staged src/index.html src/style.css
```

### Шаг 2: Перенос файлов через git mv
```bash
git mv src/index.html .
git mv src/style.css .
```

### Шаг 3: Обновление ссылок в index.html
Текущая строка 68: `<script src="game.js"></script>`
Изменить на: `<script src="src/game.js"></script>`

Текущая строка 7: `<link rel="stylesheet" href="style.css">`
Оставить без изменений (правильный путь из корня)

### Шаг 4: Добавление изменений в staging
```bash
git add index.html style.css
```

### Шаг 5: Проверка структуры
```bash
git status
ls -la
ls -la src/
```

## Ожидаемый результат

### Корень проекта:
- `index.html` (с обновленной ссылкой на `src/game.js`)
- `style.css`
- `README.md`
- `AGENTS.md`
- `opencode_instructions.md`
- `.opencode/config.yaml`
- `src/` (папка)

### Папка src:
- `game.js`
- `spec.md`

### Staged изменения:
- Все новые файлы и перемещения

## Риски и проверки

### Проверка 1: Корректность ссылок
После изменений проверить:
1. `index.html` открывается в браузере
2. Стили применяются
3. JavaScript работает

### Проверка 2: Git статус
Убедиться, что все изменения staged правильно

### Проверка 3: Структура проекта
Соответствует ожиданиям пользователя

## Вопросы для уточнения

1. **spec.md** - оставить в `src/` или перенести в корень? (Сейчас staged как `src/spec.md`)
2. Нужно ли обновить README.md с информацией о новой структуре?
3. Стоит ли создать `.gitignore` для исключения временных файлов?

## Примечания

- Все операции выполняются через git для сохранения истории
- `game.js` остается в `src/` как исходный код
- `index.html` и `style.css` в корне для простоты доступа
- Ссылки обновляются минимально необходимым образом

---

**Дата создания:** 01.04.2026  
**Статус:** Готов к выполнению  
**Файл плана:** `.opencode/plans/restructure_project.md`