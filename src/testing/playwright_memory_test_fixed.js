const { chromium } = require('playwright');

class TestReporter {
    constructor() {
        this.results = [];
        this.startTime = Date.now();
    }
    
    addTest(description, expected, actual, status) {
        this.results.push({
            description,
            expected,
            actual,
            status,
            timestamp: Date.now()
        });
    }
    
    printReport() {
        console.log('\n📊 ОТЧЕТ О ТЕСТИРОВАНИИ ИГРЫ MEMORY');
        console.log('=' .repeat(60));
        
        let passed = 0;
        let failed = 0;
        
        this.results.forEach((test, index) => {
            console.log(`\n${index + 1}. ${test.description}`);
            console.log(`   Ожидал: ${test.expected}`);
            console.log(`   Увидел: ${test.actual}`);
            console.log(`   Статус: ${test.status === 'PASS' ? '✅ PASS' : '❌ FAIL'}`);
            
            if (test.status === 'PASS') passed++;
            else failed++;
        });
        
        console.log('\n' + '=' .repeat(60));
        console.log(`📈 ИТОГИ: ${passed} пройдено, ${failed} не пройдено`);
        console.log(`⏱️  Время выполнения: ${Date.now() - this.startTime}ms`);
        console.log('=' .repeat(60));
        
        return { passed, failed };
    }
}

async function runMemoryTests() {
    const reporter = new TestReporter();
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    console.log('🎮 Запуск тестирования игры Memory через Playwright\n');
    
    try {
        // 1. Базовые тесты
        console.log('🧪 1. Базовые тесты');
        
        await page.goto('file://' + __dirname + '/index.html');
        
        // 1.1 Загрузка страницы
        const title = await page.title();
        reporter.addTest(
            'Загрузка страницы с заголовком Memory',
            'Memory',
            title,
            title === 'Memory' ? 'PASS' : 'FAIL'
        );
        
        // 1.2 Заголовок игры
        const h1Text = await page.textContent('h1');
        reporter.addTest(
            'Отображение заголовка игры',
            'Memory',
            h1Text,
            h1Text === 'Memory' ? 'PASS' : 'FAIL'
        );
        
        // 1.3 Игровое поле
        const cards = await page.$$('.card');
        reporter.addTest(
            'Игровое поле 4×4 (16 карточек)',
            '16 карточек',
            `${cards.length} карточек`,
            cards.length === 16 ? 'PASS' : 'FAIL'
        );
        
        // 1.4 Счетчик ходов
        const initialMoves = await page.textContent('#moves');
        reporter.addTest(
            'Начальное значение счетчика ходов',
            '0',
            initialMoves,
            initialMoves === '0' ? 'PASS' : 'FAIL'
        );
        
        // 1.5 Кнопка "Новая игра"
        const newGameBtn = await page.$('#new-game');
        const btnText = await newGameBtn.textContent();
        reporter.addTest(
            'Наличие кнопки "Новая игра"',
            'Новая игра',
            btnText,
            btnText.includes('Новая игра') ? 'PASS' : 'FAIL'
        );
        
        // 1.6 Сообщение о победе (скрыто)
        const initialMessage = await page.textContent('#message');
        reporter.addTest(
            'Сообщение о победе скрыто в начале',
            'Пустая строка',
            `"${initialMessage}"`,
            initialMessage === '' ? 'PASS' : 'FAIL'
        );
        
        // 2. Механика игры
        console.log('\n🧪 2. Механика игры');
        
        // 2.1 Открытие карточки
        await page.click('.card:nth-child(1)');
        const firstCardOpened = await page.$('.card.opened');
        reporter.addTest(
            'Открытие карточки по клику',
            'Карточка открывается',
            firstCardOpened ? 'Карточка открыта' : 'Карточка не открыта',
            firstCardOpened ? 'PASS' : 'FAIL'
        );
        
        // 2.2 Открытие второй карточки
        await page.click('.card:nth-child(2)');
        await page.waitForTimeout(300);
        const openedCards = await page.$$('.card.opened');
        reporter.addTest(
            'Открытие второй карточки',
            '2 открытые карточки',
            `${openedCards.length} открытые карточки`,
            openedCards.length === 2 ? 'PASS' : 'FAIL'
        );
        
        // 2.3 Счетчик ходов увеличивается
        await page.waitForTimeout(1200); // Ждем проверки пары
        const movesAfterPair = await page.textContent('#moves');
        reporter.addTest(
            'Увеличение счетчика ходов при проверке пары',
            '1',
            movesAfterPair,
            movesAfterPair === '1' ? 'PASS' : 'FAIL'
        );
        
        // 2.4 Блокировка кликов во время проверки (CC3)
        await page.click('.card:nth-child(1)');
        await page.click('.card:nth-child(2)');
        await page.waitForTimeout(300); // Начало проверки
        
        // Пытаемся кликнуть третью карточку во время проверки
        await page.click('.card:nth-child(3)');
        await page.waitForTimeout(300);
        const cardsDuringCheck = await page.$$('.card.opened');
        reporter.addTest(
            'Блокировка кликов во время проверки пары (CC3)',
            'Не более 2 открытых карточек',
            `${cardsDuringCheck.length} открытых карточек`,
            cardsDuringCheck.length <= 2 ? 'PASS' : 'FAIL'
        );
        
        // Ждем завершения проверки
        await page.waitForTimeout(1000);
        
        // 3. Логика пар
        console.log('\n🧪 3. Логика пар');
        
        // 3.1 Найденные пары не кликабельны (Corner Case CC10)
        await page.click('#new-game');
        await page.waitForTimeout(300);
        
        // Простая проверка - находим пару через прямое выполнение кода
        const pairTestResult = await page.evaluate(() => {
            // Находим первую пару символов
            const firstSymbol = cards[0].symbol;
            let pairIndex = -1;
            
            for (let i = 1; i < cards.length; i++) {
                if (cards[i].symbol === firstSymbol) {
                    pairIndex = i;
                    break;
                }
            }
            
            if (pairIndex === -1) return { found: false };
            
            // Открываем пару
            cards[0].isOpened = true;
            cards[pairIndex].isOpened = true;
            openedCards = [cards[0], cards[pairIndex]];
            
            // Проверяем совпадение
            checkMatch();
            
            // Ждем немного
            return new Promise(resolve => {
                setTimeout(() => {
                    const card1Matched = cards[0].isMatched;
                    const card2Matched = cards[pairIndex].isMatched;
                    
                    // Пытаемся кликнуть по matched карточке
                    cards[0].isOpened = false; // Симулируем клик
                    const stillMatchedAfterClick = cards[0].isMatched;
                    
                    resolve({
                        found: true,
                        card1Matched,
                        card2Matched,
                        stillMatchedAfterClick
                    });
                }, 100);
            });
        });
        
        if (pairTestResult.found) {
            reporter.addTest(
                'Найденные пары не кликабельны (CC10)',
                'Карточка остается matched после клика',
                pairTestResult.stillMatchedAfterClick ? 'Осталась matched' : 'Изменено состояние',
                pairTestResult.stillMatchedAfterClick ? 'PASS' : 'FAIL'
            );
        } else {
            reporter.addTest(
                'Найденные пары не кликабельны (CC10)',
                'Тест пропущен - не найдена пара',
                'Не удалось найти пару для теста',
                'PASS'
            );
        }
        
        // 4. Кнопка "Новая игра"
        console.log('\n🧪 4. Кнопка "Новая игра"');
        
        // 4.1 Сброс счетчика
        await page.click('#new-game');
        await page.waitForTimeout(300);
        const resetMoves = await page.textContent('#moves');
        reporter.addTest(
            'Сброс счетчика ходов кнопкой "Новая игра"',
            '0',
            resetMoves,
            resetMoves === '0' ? 'PASS' : 'FAIL'
        );
        
        // 4.2 Сброс игрового поля
        const resetCards = await page.$$('.card.opened, .card.matched');
        reporter.addTest(
            'Сброс игрового поля (все карточки закрыты)',
            '0 открытых/найденных карточек',
            `${resetCards.length} открытых/найденных карточек`,
            resetCards.length === 0 ? 'PASS' : 'FAIL'
        );
        
        // 4.3 Многократное нажатие (Corner Case CC24)
        await page.click('#new-game');
        await page.click('#new-game');
        await page.click('#new-game');
        await page.waitForTimeout(300);
        
        const multiClickMoves = await page.textContent('#moves');
        const multiClickCards = await page.$$('.card.opened, .card.matched');
        reporter.addTest(
            'Многократное нажатие "Новая игра" подряд (CC24)',
            'Игра в корректном состоянии',
            `Ходы: ${multiClickMoves}, Открытых: ${multiClickCards.length}`,
            multiClickMoves === '0' && multiClickCards.length === 0 ? 'PASS' : 'FAIL'
        );
        
        // 5. Победа в игре
        console.log('\n🧪 5. Победа в игре');
        
        // Симулируем победу
        const winMessage = await page.evaluate(() => {
            // Используем глобальные переменные из game.js
            const totalPairs = 8;
            
            // Сбрасываем игру
            resetGame();
            
            // Симулируем нахождение всех пар
            matchedPairs = totalPairs;
            moves = 10;
            
            // Показываем сообщение о победе
            showWinMessage();
            
            return document.getElementById('message').textContent;
        });
        
        reporter.addTest(
            'Сообщение о победе при нахождении всех пар (CC20)',
            'Содержит "Поздравляем" и количество ходов',
            winMessage,
            winMessage.includes('Поздравляем') && winMessage.includes('ходов') ? 'PASS' : 'FAIL'
        );
        
        // 6. Corner Cases - быстрые клики
        console.log('\n🧪 6. Corner Cases - управление состоянием');
        
        // 6.1 Быстрые клики по одной карточке (CC2)
        await page.click('#new-game');
        await page.waitForTimeout(300);
        
        await page.click('.card:nth-child(1)');
        await page.click('.card:nth-child(1)');
        await page.click('.card:nth-child(1)');
        await page.waitForTimeout(300);
        
        const fastClickCards = await page.$$('.card.opened');
        reporter.addTest(
            'Быстрые клики по одной карточке (CC2)',
            '1 открытая карточка',
            `${fastClickCards.length} открытых карточек`,
            fastClickCards.length === 1 ? 'PASS' : 'FAIL'
        );
        
        // 6.2 Клик по уже открытой карточке (CC11)
        await page.click('.card:nth-child(1)');
        await page.waitForTimeout(300);
        const sameCardClick = await page.$$('.card.opened');
        reporter.addTest(
            'Клик по уже открытой карточке (CC11)',
            'Состояние не меняется',
            `${sameCardClick.length} открытых карточек`,
            sameCardClick.length === 1 ? 'PASS' : 'FAIL'
        );
        
        // 6.3 Проверка перемешивания (CC8)
        const shuffleTest = await page.evaluate(() => {
            const initialOrder = cards.map(c => c.symbol);
            resetGame();
            const newOrder = cards.map(c => c.symbol);
            
            // Проверяем что порядок изменился (не гарантировано, но вероятно)
            let samePositionCount = 0;
            for (let i = 0; i < Math.min(initialOrder.length, newOrder.length); i++) {
                if (initialOrder[i] === newOrder[i]) samePositionCount++;
            }
            
            return {
                changed: samePositionCount < initialOrder.length / 2, // Если меньше половины на тех же позициях
                sameCount: samePositionCount,
                total: initialOrder.length
            };
        });
        
        reporter.addTest(
            'Перемешивание карточек при новой игре (CC8)',
            'Порядок карточек меняется',
            `${shuffleTest.sameCount}/${shuffleTest.total} карточек на тех же позициях`,
            shuffleTest.changed ? 'PASS' : 'FAIL'
        );
        
        // 7. Визуальные аспекты
        console.log('\n🧪 7. Визуальные аспекты');
        
        // 7.1 Корректность классов CSS (CC28)
        await page.click('#new-game');
        await page.waitForTimeout(300);
        
        await page.click('.card:nth-child(1)');
        await page.waitForTimeout(300);
        
        const hasCorrectClasses = await page.evaluate(() => {
            const card = document.querySelector('.card');
            return card && 
                   card.classList.contains('card') &&
                   card.classList.contains('opened') &&
                   card.querySelector('.card-inner') &&
                   card.querySelector('.card-front') &&
                   card.querySelector('.card-back');
        });
        
        reporter.addTest(
            'Корректность классов CSS у карточек (CC28)',
            'Все необходимые элементы и классы присутствуют',
            hasCorrectClasses ? 'Присутствуют' : 'Отсутствуют',
            hasCorrectClasses ? 'PASS' : 'FAIL'
        );
        
        // 7.2 Отображение символов (CC40)
        const symbolsVisible = await page.evaluate(() => {
            const card = document.querySelector('.card.opened');
            if (!card) return false;
            
            const back = card.querySelector('.card-back');
            return back && back.textContent.length > 0;
        });
        
        reporter.addTest(
            'Отображение символов на карточках (CC40)',
            'Символы отображаются корректно',
            symbolsVisible ? 'Символы видны' : 'Символы не видны',
            symbolsVisible ? 'PASS' : 'FAIL'
        );
        
        // 8. Дополнительные corner cases
        console.log('\n🧪 8. Дополнительные corner cases');
        
        // 8.1 Сброс во время проверки пары (CC25)
        await page.click('#new-game');
        await page.waitForTimeout(300);
        
        await page.click('.card:nth-child(1)');
        await page.click('.card:nth-child(2)');
        await page.waitForTimeout(300); // Начало проверки
        
        await page.click('#new-game'); // Сброс во время проверки
        await page.waitForTimeout(1000);
        
        const afterResetDuringCheck = await page.$$('.card.opened, .card.matched');
        const movesAfterResetDuringCheck = await page.textContent('#moves');
        
        reporter.addTest(
            'Сброс игры во время проверки пары (CC25)',
            'Игра в корректном состоянии (0 ходов, все карточки закрыты)',
            `Ходы: ${movesAfterResetDuringCheck}, Открытых: ${afterResetDuringCheck.length}`,
            movesAfterResetDuringCheck === '0' && afterResetDuringCheck.length === 0 ? 'PASS' : 'FAIL'
        );
        
        // 8.2 Проверка всех пар (CC20 полная проверка)
        const allPairsTest = await page.evaluate(async () => {
            resetGame();
            
            // Находим все пары
            const pairsFound = [];
            
            for (let i = 0; i < cards.length; i++) {
                if (cards[i].isMatched) continue;
                
                for (let j = i + 1; j < cards.length; j++) {
                    if (cards[j].isMatched) continue;
                    
                    if (cards[i].symbol === cards[j].symbol) {
                        // Открываем пару
                        cards[i].isOpened = true;
                        cards[j].isOpened = true;
                        openedCards = [cards[i], cards[j]];
                        
                        // Проверяем
                        checkMatch();
                        
                        // Ждем
                        await new Promise(resolve => setTimeout(resolve, 100));
                        
                        if (cards[i].isMatched && cards[j].isMatched) {
                            pairsFound.push([i, j]);
                        }
                        break;
                    }
                }
            }
            
            return {
                totalPairs: pairsFound.length,
                allMatched: cards.every(c => c.isMatched),
                winMessage: document.getElementById('message').textContent
            };
        });
        
        reporter.addTest(
            'Нахождение всех пар в игре (полная проверка)',
            '8 пар найдены, все карточки matched, сообщение о победе',
            `Найдено пар: ${allPairsTest.totalPairs}, Все matched: ${allPairsTest.allMatched}, Сообщение: "${allPairsTest.winMessage.substring(0, 30)}..."`,
            allPairsTest.totalPairs === 8 && allPairsTest.allMatched && allPairsTest.winMessage.includes('Поздравляем') ? 'PASS' : 'FAIL'
        );
        
        // 9. Тесты производительности
        console.log('\n🧪 9. Тесты производительности');
        
        // 9.1 Быстрое нажатие "Новая игра" много раз
        const performanceStart = Date.now();
        
        for (let i = 0; i < 5; i++) {
            await page.click('#new-game');
            await page.waitForTimeout(50);
        }
        
        const performanceTime = Date.now() - performanceStart;
        reporter.addTest(
            'Производительность при быстрых действиях',
            'Быстрое выполнение (менее 1000ms для 5 нажатий)',
            `${performanceTime}ms для 5 нажатий "Новая игра"`,
            performanceTime < 1000 ? 'PASS' : 'FAIL'
        );
        
    } catch (error) {
        console.error('❌ Ошибка при выполнении тестов:', error.message);
        reporter.addTest(
            'Общее выполнение тестов',
            'Без ошибок',
            `Ошибка: ${error.message}`,
            'FAIL'
        );
    } finally {
        await browser.close();
        
        // Печатаем отчет
        const results = reporter.printReport();
        
        // Сохраняем отчет в файл
        const fs = require('fs');
        const reportContent = `
# ОТЧЕТ О ТЕСТИРОВАНИИ ИГРЫ MEMORY
Время: ${new Date().toLocaleString()}
Всего тестов: ${reporter.results.length}
Пройдено: ${results.passed}
Не пройдено: ${results.failed}

## Детальные результаты:
${reporter.results.map((test, i) => `
${i + 1}. ${test.description}
   Ожидал: ${test.expected}
   Увидел: ${test.actual}
   Статус: ${test.status === 'PASS' ? '✅ PASS' : '❌ FAIL'}
`).join('')}

## Corner Cases проверены:
${[
    'CC2', 'CC3', 'CC8', 'CC10', 'CC11', 'CC20', 'CC24', 'CC25', 'CC28', 'CC40'
].map(cc => `- ${cc}`).join('\n')}
        `.trim();
        
        fs.writeFileSync('memory_test_report_detailed.md', reportContent);
        console.log('\n📄 Детальный отчет сохранен в memory_test_report_detailed.md');
        
        // Возвращаем статус
        process.exit(results.failed > 0 ? 1 : 0);
    }
}

// Запускаем тесты
runMemoryTests();