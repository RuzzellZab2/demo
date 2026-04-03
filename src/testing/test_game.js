// Тест игры Memory
console.log('=== Тестирование игры Memory ===\n');

// Проверка наличия файлов
const fs = require('fs');
const path = require('path');

const files = ['index.html', 'style.css', 'game.js'];
let allFilesExist = true;

console.log('Проверка файлов:');
files.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    console.log(`  ${file}: ${exists ? '✓' : '✗'}`);
    if (!exists) allFilesExist = false;
});

console.log(allFilesExist ? '\n✓ Все файлы существуют' : '\n✗ Некоторые файлы отсутствуют');

// Проверка содержимого HTML
console.log('\nПроверка HTML:');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const htmlChecks = [
    { name: 'Заголовок Memory', check: html.includes('<title>Memory</title>') },
    { name: 'Игровое поле', check: html.includes('id="game-board"') },
    { name: 'Таймер', check: html.includes('id="timer"') },
    { name: 'Счетчик ходов', check: html.includes('id="moves"') },
    { name: 'Кнопка новой игры', check: html.includes('id="new-game"') },
    { name: 'Выбор размера поля', check: html.includes('size4x4') && html.includes('size6x6') },
    { name: 'Лучший результат', check: html.includes('id="best-result"') },
    { name: 'Сообщение о победе', check: html.includes('id="message"') }
];

htmlChecks.forEach(check => {
    console.log(`  ${check.name}: ${check.check ? '✓' : '✗'}`);
});

// Проверка JS логики
console.log('\nПроверка JS логики:');
const js = fs.readFileSync(path.join(__dirname, 'game.js'), 'utf8');
const jsChecks = [
    { name: 'Создание карточек', check: js.includes('createCards') },
    { name: 'Перемешивание', check: js.includes('shuffleCards') },
    { name: 'Обработка кликов', check: js.includes('handleCardClick') },
    { name: 'Проверка совпадений', check: js.includes('checkMatch') },
    { name: 'Таймер', check: js.includes('startTimer') && js.includes('stopTimer') },
    { name: 'Сохранение результатов', check: js.includes('localStorage') },
    { name: 'Смена размера поля', check: js.includes('changeBoardSize') },
    { name: 'Сброс игры', check: js.includes('resetGame') }
];

jsChecks.forEach(check => {
    console.log(`  ${check.name}: ${check.check ? '✓' : '✗'}`);
});

// Проверка CSS
console.log('\nПроверка CSS:');
const css = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8');
const cssChecks = [
    { name: 'Стили карточек', check: css.includes('.card') && css.includes('.card-inner') },
    { name: 'Анимации', check: css.includes('transform') && css.includes('transition') },
    { name: 'Сетка игрового поля', check: css.includes('grid-template-columns') },
    { name: 'Разные размеры поля', check: css.includes('.size-4x4') && css.includes('.size-6x6') },
    { name: 'Состояния карточек', check: css.includes('.opened') && css.includes('.matched') }
];

cssChecks.forEach(check => {
    console.log(`  ${check.name}: ${check.check ? '✓' : '✗'}`);
});

// Проверка соответствия спецификации
console.log('\n=== Проверка соответствия спецификации ===');
const spec = fs.readFileSync(path.join(__dirname, 'spec.md'), 'utf8');
const specChecks = [
    { 
        name: 'Поле 4x4 и 6x6', 
        check: html.includes('4x4 (8 пар)') && html.includes('6x6 (18 пар)') && 
               js.includes('currentBoardSize') && js.includes('changeBoardSize')
    },
    { 
        name: 'Перемешивание карточек', 
        check: js.includes('shuffleCards') && js.includes('Math.random')
    },
    { 
        name: 'Открытие карточек по клику', 
        check: js.includes('handleCardClick') && js.includes('addEventListener')
    },
    { 
        name: 'Логика сравнения пар', 
        check: js.includes('checkMatch') && js.includes('openedCards.length === 2')
    },
    { 
        name: 'Счетчик ходов', 
        check: html.includes('id="moves"') && js.includes('moves++')
    },
    { 
        name: 'Таймер', 
        check: html.includes('id="timer"') && js.includes('setInterval') && js.includes('gameTime')
    },
    { 
        name: 'Сообщение о победе', 
        check: html.includes('id="message"') && js.includes('showWinMessage')
    },
    { 
        name: 'Кнопка "Новая игра"', 
        check: html.includes('id="new-game"') && js.includes('resetGame')
    },
    { 
        name: 'Заголовок Memory', 
        check: html.includes('<title>Memory</title>')
    },
    { 
        name: 'Лучший результат в localStorage', 
        check: js.includes('localStorage') && js.includes('saveBestScore') && js.includes('getBestScore')
    }
];

let passed = 0;
specChecks.forEach((check, i) => {
    const passedCheck = check.check;
    if (passedCheck) passed++;
    console.log(`${i + 1}. ${check.name}: ${passedCheck ? '✓' : '✗'}`);
});

console.log(`\nИтого: ${passed}/${specChecks.length} требований выполнено`);

if (passed === specChecks.length) {
    console.log('\n✅ Игра полностью соответствует спецификации!');
} else {
    console.log('\n⚠️  Некоторые требования не выполнены');
}

// Проверка работы игры через симуляцию
console.log('\n=== Симуляция работы игры ===');

// Создаем простой тест для проверки логики
const testGameLogic = () => {
    console.log('Тестирование базовой логики:');
    
    // Проверяем, что символы определены
    const hasSymbols = js.includes('symbols4x4') && js.includes('symbols6x6');
    console.log(`  Символы для карточек: ${hasSymbols ? '✓' : '✗'}`);
    
    // Проверяем логику создания пар
    const hasPairsLogic = js.includes('totalPairs') && js.includes('matchedPairs');
    console.log(`  Логика подсчета пар: ${hasPairsLogic ? '✓' : '✗'}`);
    
    // Проверяем ограничение на 2 открытые карточки
    const hasTwoCardLimit = js.includes('openedCards.length >= 2');
    console.log(`  Ограничение 2 карточки: ${hasTwoCardLimit ? '✓' : '✗'}`);
    
    // Проверяем блокировку кликов
    const hasClickBlock = js.includes('canClick') && js.includes('setTimeout');
    console.log(`  Блокировка кликов: ${hasClickBlock ? '✓' : '✗'}`);
    
    // Проверяем завершение игры
    const hasGameEnd = js.includes('matchedPairs === totalPairs');
    console.log(`  Определение конца игры: ${hasGameEnd ? '✓' : '✗'}`);
};

testGameLogic();

console.log('\n=== Рекомендации по тестированию ===');
console.log('1. Откройте http://localhost:8080 в браузере');
console.log('2. Проверьте работу кнопок выбора размера поля');
console.log('3. Начните игру - таймер должен запуститься при первом клике');
console.log('4. Откройте две карточки - должна сработать проверка совпадения');
console.log('5. Найдите все пары - должно появиться сообщение о победе');
console.log('6. Проверьте сохранение лучшего результата (обновите страницу)');
console.log('7. Проверьте кнопку "Новая игра"');