# Настройка GitHub репозитория для Memory Game

## Шаги для публикации проекта

### 1. Создайте репозиторий на GitHub
1. Перейдите на https://github.com/new
2. Заполните поля:
   - Repository name: `memory-game`
   - Description: `Classic memory card game with modern design`
   - Public repository
   - Не добавляйте .gitignore, README или лицензию (уже есть)

### 2. Добавьте удаленный репозиторий
```bash
git remote add origin https://github.com/YOUR_USERNAME/memory-game.git
git branch -M main
git push -u origin main
```

### 3. Настройте GitHub Pages (опционально)
1. В репозитории перейдите в Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main`, folder: `/` (root)
4. Сохраните

### 4. Проверьте доступность
После настройки игра будет доступна по адресу:
```
https://YOUR_USERNAME.github.io/memory-game/
```

## Альтернатива: Используйте существующий репозиторий
Если у вас уже есть репозиторий, просто добавьте его как remote:
```bash
git remote add origin YOUR_REPO_URL
git push -u origin main
```

## Файлы в репозитории
- `index.html` — основная страница
- `style.css` — стили игры  
- `game.js` — логика игры
- `spec.md` — исходная спецификация
- `README.md` — документация
- `.gitignore` — игнорируемые файлы

## Проверка
После публикации убедитесь, что:
1. Все файлы загружены
2. README отображается корректно
3. Игра работает на GitHub Pages (если настроено)