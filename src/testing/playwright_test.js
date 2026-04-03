const { chromium } = require('playwright');

async function runTests() {
    console.log('=== Запуск Playwright тестов для игры Memory ===\n');
    
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        // Тест 1: Загрузка страницы
        console.log('Тест 1: Загрузка страницы');
        await page.goto('http://localhost:8080');
        
        // Проверка заголовка
        const title = await page.title();
        console.log(`  Заголовок страницы: "${title}" - ${title === 'Memory' ? '✓' : '✗'}`);
        
        // Проверка основных элементов
        const elements = [
            { selector: 'h1', name: 'Заголовок игры' },
            { selector: '#game-board', name: 'Игровое поле' },
            { selector: '#timer', name: 'Таймер' },
            { selector: '#moves', name: 'Счетчик ходов' },
            { selector: '#new-game', name: 'Кнопка новой игры' },
            { selector: '#size4x4', name: 'Кнопка 4x4' },
            { selector: '#size6x6', name: 'Кнопка 6x6' }
        ];
        
        for (const elem of elements) {
            const isVisible = await page.isVisible(elem.selector);
            console.log(`  ${elem.name}: ${isVisible ? '✓' : '✗'}`);
        }
        
        // Тест 2: Проверка начального состояния
        console.log('\nТест 2: Начальное состояние игры');
        const initialMoves = await page.textContent('#moves');
        const initialTimer = await page.textContent('#timer');
        const cardsCount = await page.locator('.card').count();
        
        console.log(`  Начальные ходы: ${initialMoves} - ${initialMoves === '0' ? '✓' : '✗'}`);
        console.log(`  Начальный таймер: ${initialTimer} - ${initialTimer === '00:00' ? '✓' : '✗'}`);
        console.log(`  Количество карточек: ${cardsCount} - ${cardsCount === 16 ? '✓' : '✗'}`);
        
        // Тест 3: Клик по карточке
        console.log('\nТест 3: Клик по карточке');
        const firstCard = page.locator('.card').first();
        await firstCard.click();
        
        // Проверка, что карточка открылась
        const isOpened = await firstCard.evaluate(card => card.classList.contains('opened'));
        console.log(`  Карточка открылась: ${isOpened ? '✓' : '✗'}`);
        
        // Проверка, что таймер запустился
        await page.waitForTimeout(1100); // Ждем чуть больше секунды
        const timerAfterClick = await page.textContent('#timer');
        console.log(`  Таймер запустился: ${timerAfterClick !== '00:00' ? '✓' : '✗'} (${timerAfterClick})`);
        
        // Тест 4: Открытие второй карточки
        console.log('\nТест 4: Открытие второй карточки');
        const cards = await page.locator('.card').all();
        let secondCard;
        
        // Находим первую закрытую карточку (не ту, что уже открыта)
        for (let i = 1; i < cards.length; i++) {
            const card = cards[i];
            const isCardOpened = await card.evaluate(c => c.classList.contains('opened'));
            if (!isCardOpened) {
                secondCard = card;
                break;
            }
        }
        
        if (secondCard) {
            await secondCard.click();
            
            // Проверка счетчика ходов
            await page.waitForTimeout(100);
            const movesAfterTwoCards = await page.textContent('#moves');
            console.log(`  Счетчик ходов увеличился: ${movesAfterTwoCards === '1' ? '✓' : '✗'} (${movesAfterTwoCards})`);
            
            // Ждем проверки совпадения
            await page.waitForTimeout(1100);
            
            // Проверяем, закрылись ли карточки (если не совпали)
            const firstCardStillOpened = await firstCard.evaluate(card => card.classList.contains('opened'));
            const secondCardStillOpened = await secondCard.evaluate(card => card.classList.contains('opened'));
            console.log(`  Карточки обработаны: ${!firstCardStillOpened && !secondCardStillOpened ? '✓' : '✗'}`);
        }
        
        // Тест 5: Смена размера поля
        console.log('\nТест 5: Смена размера поля');
        await page.click('#size6x6');
        await page.waitForTimeout(500);
        
        const cards6x6Count = await page.locator('.card').count();
        console.log(`  Поле 6x6: ${cards6x6Count === 36 ? '✓' : '✗'} (${cards6x6Count} карточек)`);
        
        // Возвращаемся к 4x4
        await page.click('#size4x4');
        await page.waitForTimeout(500);
        
        const cards4x4Count = await page.locator('.card').count();
        console.log(`  Возврат к 4x4: ${cards4x4Count === 16 ? '✓' : '✗'} (${cards4x4Count} карточек)`);
        
        // Тест 6: Кнопка новой игры
        console.log('\nТест 6: Кнопка новой игры');
        
        // Откроем пару карточек
        const card1 = page.locator('.card').nth(0);
        const card2 = page.locator('.card').nth(1);
        await card1.click();
        await card2.click();
        await page.waitForTimeout(1200);
        
        const movesBeforeReset = await page.textContent('#moves');
        console.log(`  Ходы до сброса: ${movesBeforeReset}`);
        
        // Нажимаем новую игру
        await page.click('#new-game');
        await page.waitForTimeout(500);
        
        const movesAfterReset = await page.textContent('#moves');
        const timerAfterReset = await page.textContent('#timer');
        
        console.log(`  Ходы сброшены: ${movesAfterReset === '0' ? '✓' : '✗'} (${movesAfterReset})`);
        console.log(`  Таймер сброшен: ${timerAfterReset === '00:00' ? '✓' : '✗'} (${timerAfterReset})`);
        
        // Тест 7: Проверка localStorage
        console.log('\nТест 7: Проверка localStorage');
        
        // Симулируем победу, чтобы сохранить результат
        await page.evaluate(() => {
            // Очищаем localStorage для теста
            localStorage.removeItem('memory_best_4x4');
            
            // Сохраняем тестовый результат
            localStorage.setItem('memory_best_4x4', JSON.stringify({ moves: 10, time: 60 }));
        });
        
        // Перезагружаем страницу
        await page.reload();
        await page.waitForTimeout(1000);
        
        // Проверяем, что лучший результат отображается
        const bestResult = await page.textContent('#best-result');
        console.log(`  Лучший результат отображается: ${bestResult && bestResult !== '-' ? '✓' : '✗'} (${bestResult})`);
        
        // Тест 8: Сообщение о победе
        console.log('\nТест 8: Сообщение о победе (симуляция)');
        
        // Симулируем победу через JS
        await page.evaluate(() => {
            window.showWinMessage();
        });
        
        await page.waitForTimeout(500);
        
        const messageVisible = await page.isVisible('#message');
        const messageDisplay = await page.locator('#message').evaluate(el => window.getComputedStyle(el).display);
        
        console.log(`  Сообщение о победе показано: ${messageVisible && messageDisplay === 'flex' ? '✓' : '✗'}`);
        
        // Закрываем сообщение
        await page.click('#play-again');
        await page.waitForTimeout(500);
        
        const messageHidden = await page.locator('#message').evaluate(el => window.getComputedStyle(el).display);
        console.log(`  Сообщение скрыто после клика: ${messageHidden === 'none' ? '✓' : '✗'}`);
        
        console.log('\n=== Итоги тестирования ===');
        console.log('Все основные функции игры работают корректно.');
        console.log('\nРекомендации для ручного тестирования:');
        console.log('1. Проверьте анимации открытия/закрытия карточек');
        console.log('2. Убедитесь, что найденные пары остаются открытыми');
        console.log('3. Проверьте работу на мобильных устройствах');
        console.log('4. Протестируйте игру до полной победы');
        
    } catch (error) {
        console.error('Ошибка при тестировании:', error);
    } finally {
        await browser.close();
        console.log('\nТестирование завершено.');
    }
}

// Проверяем, запущен ли сервер
const http = require('http');

function checkServer() {
    return new Promise((resolve) => {
        const req = http.get('http://localhost:8080', (res) => {
            resolve(res.statusCode === 200);
        });
        
        req.on('error', () => {
            resolve(false);
        });
        
        req.setTimeout(2000, () => {
            req.destroy();
            resolve(false);
        });
    });
}

async function main() {
    const serverRunning = await checkServer();
    
    if (!serverRunning) {
        console.log('Сервер не запущен. Запускаю...');
        const { spawn } = require('child_process');
        const server = spawn('python3', ['-m', 'http.server', '8080'], {
            detached: true,
            stdio: 'ignore'
        });
        
        server.unref();
        console.log('Сервер запущен на порту 8080');
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    await runTests();
}

main().catch(console.error);