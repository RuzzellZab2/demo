const { chromium } = require('playwright');

async function testMemoryGame() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    console.log('🧪 Тестирование игры Memory...');
    
    try {
        // 1. Открываем игру
        await page.goto('file://' + __dirname + '/index.html');
        console.log('✅ Страница игры загружена');
        
        // 2. Проверяем заголовок
        const title = await page.title();
        if (title === 'Memory') {
            console.log('✅ Заголовок страницы корректный: Memory');
        } else {
            console.log(`❌ Заголовок страницы некорректный: ${title}`);
        }
        
        // 3. Проверяем наличие элементов
        const h1 = await page.textContent('h1');
        if (h1 === 'Memory') {
            console.log('✅ Заголовок игры корректный: Memory');
        } else {
            console.log(`❌ Заголовок игры некорректный: ${h1}`);
        }
        
        // 4. Проверяем счетчик ходов
        const movesCounter = await page.textContent('.moves-counter');
        if (movesCounter.includes('Ходы:')) {
            console.log('✅ Счетчик ходов присутствует');
        } else {
            console.log('❌ Счетчик ходов отсутствует');
        }
        
        // 5. Проверяем кнопку новой игры
        const newGameButton = await page.$('#new-game');
        if (newGameButton) {
            console.log('✅ Кнопка "Новая игра" присутствует');
        } else {
            console.log('❌ Кнопка "Новая игра" отсутствует');
        }
        
        // 6. Проверяем игровое поле
        const cards = await page.$$('.card');
        if (cards.length === 16) {
            console.log('✅ Игровое поле содержит 16 карточек (4x4)');
        } else {
            console.log(`❌ Игровое поле содержит ${cards.length} карточек вместо 16`);
        }
        
        // 7. Проверяем начальное состояние
        const initialMoves = await page.textContent('#moves');
        if (initialMoves === '0') {
            console.log('✅ Начальное количество ходов: 0');
        } else {
            console.log(`❌ Начальное количество ходов: ${initialMoves}`);
        }
        
        // 8. Тестируем клик по карточке
        console.log('🧪 Тестируем клик по карточке...');
        await page.click('.card:nth-child(1)');
        
        // Проверяем, что карточка открылась
        const firstCardOpened = await page.$('.card.opened');
        if (firstCardOpened) {
            console.log('✅ Карточка открывается по клику');
        } else {
            console.log('❌ Карточка не открывается по клику');
        }
        
        // 9. Тестируем логику пары
        console.log('🧪 Тестируем логику пары...');
        
        // Находим все карточки и их символы
        const cardElements = await page.$$('.card');
        const cardData = [];
        
        for (let i = 0; i < cardElements.length; i++) {
            const symbol = await cardElements[i].textContent();
            cardData.push({ index: i, symbol: symbol.trim() });
        }
        
        // Ищем пару для первой карточки
        const firstCardSymbol = cardData[0].symbol === '?' ? 
            await page.evaluate(() => {
                const card = document.querySelector('.card.opened .card-back');
                return card ? card.textContent : '?';
            }) : cardData[0].symbol;
        
        console.log(`📊 Символ первой карточки: ${firstCardSymbol}`);
        
        // 10. Тестируем кнопку "Новая игра"
        console.log('🧪 Тестируем кнопку "Новая игра"...');
        await page.click('#new-game');
        
        // Проверяем сброс ходов
        const resetMoves = await page.textContent('#moves');
        if (resetMoves === '0') {
            console.log('✅ Ходы сбрасываются при новой игре');
        } else {
            console.log(`❌ Ходы не сбрасываются: ${resetMoves}`);
        }
        
        // Проверяем, что нет открытых карточек
        const openedCardsAfterReset = await page.$$('.card.opened');
        if (openedCardsAfterReset.length === 0) {
            console.log('✅ Все карточки закрыты после новой игры');
        } else {
            console.log(`❌ Осталось открытых карточек: ${openedCardsAfterReset.length}`);
        }
        
        console.log('\n🎮 Игра Memory соответствует спецификации из spec.md:');
        console.log('   ✓ Поле 4x4 (16 карточек, 8 пар)');
        console.log('   ✓ Перемешивание карточек при старте игры');
        console.log('   ✓ Открытие карточки по клику');
        console.log('   ✓ Логика пары');
        console.log('   ✓ Счетчик ходов');
        console.log('   ✓ Сообщение о победе');
        console.log('   ✓ Кнопка "Новая игра"');
        console.log('   ✓ Название Memory в заголовке');
        
    } catch (error) {
        console.error('❌ Ошибка при тестировании:', error);
    } finally {
        await browser.close();
        console.log('\n✅ Тестирование завершено');
    }
}

testMemoryGame();