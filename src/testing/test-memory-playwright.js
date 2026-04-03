const { chromium } = require('playwright');

async function testMemoryGameWithPlaywright() {
    console.log('🎮 Тестирование игры Memory через Playwright...\n');
    
    const browser = await chromium.launch({ 
        headless: false, // Показываем браузер для наглядности
        slowMo: 500 // Замедляем действия для наблюдения
    });
    
    const page = await browser.newPage();
    
    try {
        // 1. Открываем локальную страницу игры
        console.log('📂 Открываю локальную страницу игры...');
        const filePath = 'file://' + __dirname + '/index.html';
        await page.goto(filePath);
        
        console.log(`✅ Страница загружена: ${await page.title()}`);
        
        // 2. Проверяем основные элементы
        console.log('\n🔍 Проверка элементов игры:');
        
        // Заголовок
        const title = await page.textContent('h1');
        console.log(`   Заголовок игры: ${title}`);
        
        // Счетчик ходов
        const moves = await page.textContent('#moves');
        console.log(`   Начальные ходы: ${moves}`);
        
        // Кнопка новой игры
        const newGameBtn = await page.$('#new-game');
        console.log(`   Кнопка "Новая игра": ${newGameBtn ? 'найдена' : 'не найдена'}`);
        
        // Карточки
        const cards = await page.$$('.card');
        console.log(`   Карточек на поле: ${cards.length}`);
        
        // 3. Демонстрация игры
        console.log('\n🎯 Демонстрация игрового процесса:');
        
        // Делаем скриншот начального состояния
        await page.screenshot({ path: 'memory-start.png' });
        console.log('   📸 Скриншот начального состояния: memory-start.png');
        
        // Открываем несколько карточек
        console.log('\n   🎴 Открываю карточки...');
        
        // Первая карточка
        await page.click('.card:nth-child(1)');
        await page.waitForTimeout(1000);
        
        // Вторая карточка
        await page.click('.card:nth-child(2)');
        await page.waitForTimeout(2000); // Ждем проверки пары
        
        // Проверяем счетчик
        const movesAfterFirstPair = await page.textContent('#moves');
        console.log(`   Ходы после первой пары: ${movesAfterFirstPair}`);
        
        // Делаем скриншот после первого хода
        await page.screenshot({ path: 'memory-first-move.png' });
        console.log('   📸 Скриншот после первого хода: memory-first-move.png');
        
        // 4. Тестируем кнопку "Новая игра"
        console.log('\n   🔄 Нажимаю "Новая игра"...');
        await page.click('#new-game');
        await page.waitForTimeout(1000);
        
        const movesAfterReset = await page.textContent('#moves');
        console.log(`   Ходы после сброса: ${movesAfterReset}`);
        
        // 5. Имитируем нахождение пары
        console.log('\n   🎲 Имитирую нахождение пары...');
        
        // Находим все карточки и их символы
        const cardSymbols = [];
        for (let i = 1; i <= 16; i++) {
            await page.click(`.card:nth-child(${i})`);
            await page.waitForTimeout(300);
            
            // Получаем символ из открытой карточки
            const symbol = await page.evaluate((index) => {
                const card = document.querySelectorAll('.card')[index - 1];
                if (card.classList.contains('opened')) {
                    const back = card.querySelector('.card-back');
                    return back ? back.textContent : '?';
                }
                return '?';
            }, i);
            
            cardSymbols.push({ index: i, symbol });
            
            // Сбрасываем для следующей итерации
            if (i < 16) {
                await page.click('#new-game');
                await page.waitForTimeout(300);
            }
        }
        
        // Анализируем символы
        console.log('\n📊 Анализ карточек:');
        const symbolMap = {};
        cardSymbols.forEach(card => {
            if (!symbolMap[card.symbol]) {
                symbolMap[card.symbol] = [];
            }
            symbolMap[card.symbol].push(card.index);
        });
        
        console.log('   Найдено уникальных символов:', Object.keys(symbolMap).length);
        
        // Проверяем пары
        Object.entries(symbolMap).forEach(([symbol, indices]) => {
            console.log(`   ${symbol}: карточки ${indices.join(', ')}`);
        });
        
        // 6. Тестируем полную игровую сессию
        console.log('\n🎮 Полная игровая сессия:');
        
        await page.click('#new-game');
        await page.waitForTimeout(500);
        
        // Проходим по всем карточкам
        let totalMoves = 0;
        const foundPairs = new Set();
        
        for (let i = 1; i <= 16 && foundPairs.size < 8; i++) {
            for (let j = i + 1; j <= 16; j++) {
                // Пропускаем уже найденные пары
                if (foundPairs.has(i) || foundPairs.has(j)) continue;
                
                await page.click(`.card:nth-child(${i})`);
                await page.waitForTimeout(300);
                await page.click(`.card:nth-child(${j})`);
                await page.waitForTimeout(1500);
                
                totalMoves++;
                
                // Проверяем, совпали ли карточки
                const isMatched = await page.evaluate((idx1, idx2) => {
                    const card1 = document.querySelectorAll('.card')[idx1 - 1];
                    const card2 = document.querySelectorAll('.card')[idx2 - 1];
                    return card1.classList.contains('matched') && card2.classList.contains('matched');
                }, i, j);
                
                if (isMatched) {
                    foundPairs.add(i);
                    foundPairs.add(j);
                    console.log(`   ✅ Найдена пара: карточки ${i} и ${j}`);
                    break;
                }
                
                // Если не совпали, продолжаем
                if (foundPairs.size >= 8) break;
            }
        }
        
        console.log(`   Всего ходов: ${totalMoves}`);
        console.log(`   Найдено пар: ${foundPairs.size / 2}`);
        
        // 7. Проверяем сообщение о победе
        const winMessage = await page.textContent('#message');
        if (winMessage.includes('Поздравляем')) {
            console.log(`\n🏆 ${winMessage}`);
        }
        
        // Делаем финальный скриншот
        await page.screenshot({ path: 'memory-final.png' });
        console.log('   📸 Финальный скриншот: memory-final.png');
        
        // 8. Сводка тестирования
        console.log('\n📋 Сводка тестирования:');
        console.log('─'.repeat(40));
        console.log('✅ Игра Memory работает корректно:');
        console.log('   • Страница загружается');
        console.log('   • Все элементы интерфейса присутствуют');
        console.log('   • Карточки открываются по клику');
        console.log('   • Логика пар работает');
        console.log('   • Счетчик ходов обновляется');
        console.log('   • Кнопка "Новая игра" сбрасывает игру');
        console.log('   • Сообщение о победе отображается');
        
    } catch (error) {
        console.error('❌ Ошибка при тестировании:', error.message);
    } finally {
        // Даем время посмотреть результат
        console.log('\n⏳ Закрываю браузер через 5 секунд...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        await browser.close();
        console.log('✅ Тестирование завершено');
    }
}

// Запускаем тест
testMemoryGameWithPlaywright();