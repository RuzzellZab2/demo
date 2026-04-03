const http = require('http');

// Функция для отправки запроса к MCP серверу Playwright
async function fetchPageWithPlaywright() {
    console.log('🌐 Чтение страницы https://example.com через Playwright MCP...\n');
    
    // MCP сервер Playwright использует SSE (Server-Sent Events) для коммуникации
    // Для простоты создам прямое соединение через Playwright API
    
    const { chromium } = require('playwright');
    
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        console.log('📥 Загружаю страницу https://example.com...');
        
        // Устанавливаем таймаут и переходим на страницу
        await page.goto('https://example.com', { waitUntil: 'networkidle' });
        
        console.log('✅ Страница загружена');
        console.log(`📄 Заголовок: ${await page.title()}`);
        console.log(`🔗 URL: ${page.url()}`);
        
        // Получаем содержимое страницы
        const content = await page.content();
        
        console.log('\n📋 Основное содержимое страницы:');
        console.log('─'.repeat(50));
        
        // Извлекаем текст из основных элементов
        const h1Text = await page.textContent('h1');
        const pText = await page.textContent('p');
        const allText = await page.textContent('body');
        
        if (h1Text) console.log(`Заголовок H1: ${h1Text}`);
        if (pText) console.log(`Параграф: ${pText}`);
        
        console.log('\n🔍 Структура страницы:');
        
        // Считаем элементы
        const h1Count = await page.$$eval('h1', els => els.length);
        const pCount = await page.$$eval('p', els => els.length);
        const aCount = await page.$$eval('a', els => els.length);
        const imgCount = await page.$$eval('img', els => els.length);
        
        console.log(`   • Заголовков H1: ${h1Count}`);
        console.log(`   • Параграфов: ${pCount}`);
        console.log(`   • Ссылок: ${aCount}`);
        console.log(`   • Изображений: ${imgCount}`);
        
        // Получаем мета-информацию
        const viewport = await page.viewportSize();
        console.log(`\n📱 Viewport: ${viewport.width}x${viewport.height}`);
        
        // Делаем скриншот
        console.log('\n📸 Делаю скриншот...');
        await page.screenshot({ path: 'example-com-screenshot.png', fullPage: false });
        console.log('✅ Скриншот сохранен как example-com-screenshot.png');
        
        // Получаем сетевые запросы
        console.log('\n🌐 Сетевые запросы:');
        const requests = page.request;
        console.log('   (Для получения детальной информации нужна настройка request interception)');
        
        console.log('\n📊 Статус загрузки:');
        console.log(`   • Статус: ${await page.evaluate(() => document.readyState)}`);
        
        // Извлекаем все ссылки
        console.log('\n🔗 Ссылки на странице:');
        const links = await page.$$eval('a', anchors => 
            anchors.map(a => ({
                text: a.textContent.trim().substring(0, 50),
                href: a.href,
                title: a.title || 'нет'
            }))
        );
        
        links.forEach((link, i) => {
            console.log(`   ${i+1}. ${link.text} → ${link.href}`);
        });
        
        console.log('\n📄 Полный HTML (первые 1000 символов):');
        console.log('─'.repeat(50));
        console.log(content.substring(0, 1000) + '...');
        
    } catch (error) {
        console.error('❌ Ошибка при загрузке страницы:', error.message);
    } finally {
        await browser.close();
        console.log('\n✅ Браузер закрыт');
    }
}

// Альтернативный вариант через прямое использование Playwright
async function simplePlaywrightFetch() {
    console.log('🚀 Использую Playwright напрямую...\n');
    
    const { chromium } = require('playwright');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        console.log('🌐 Перехожу на https://example.com...');
        
        const response = await page.goto('https://example.com', {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });
        
        console.log(`✅ Ответ сервера: ${response.status()} ${response.statusText()}`);
        
        // Ждем загрузки контента
        await page.waitForLoadState('networkidle');
        
        console.log('\n📋 Информация о странице:');
        console.log('─'.repeat(40));
        
        const pageInfo = {
            title: await page.title(),
            url: page.url(),
            h1: await page.textContent('h1').catch(() => 'не найден'),
            description: await page.$eval('meta[name="description"]', el => el.content).catch(() => 'нет'),
            viewport: await page.viewportSize(),
            contentLength: (await page.content()).length
        };
        
        console.log(`Заголовок: ${pageInfo.title}`);
        console.log(`URL: ${pageInfo.url}`);
        console.log(`H1: ${pageInfo.h1}`);
        console.log(`Описание: ${pageInfo.description}`);
        console.log(`Размер контента: ${pageInfo.contentLength} символов`);
        console.log(`Viewport: ${pageInfo.viewport.width}x${pageInfo.viewport.height}`);
        
        // Получаем основной текст
        console.log('\n📄 Основной текст страницы:');
        console.log('─'.repeat(40));
        
        const mainText = await page.evaluate(() => {
            const bodyText = document.body.innerText;
            // Убираем лишние пробелы и переносы
            return bodyText.replace(/\s+/g, ' ').trim().substring(0, 500);
        });
        
        console.log(mainText + '...');
        
        // Анализ DOM
        console.log('\n🔍 Анализ DOM-структуры:');
        
        const domStats = await page.evaluate(() => {
            return {
                elements: document.querySelectorAll('*').length,
                headings: {
                    h1: document.querySelectorAll('h1').length,
                    h2: document.querySelectorAll('h2').length,
                    h3: document.querySelectorAll('h3').length
                },
                links: document.querySelectorAll('a').length,
                images: document.querySelectorAll('img').length,
                scripts: document.querySelectorAll('script').length,
                styles: document.querySelectorAll('link[rel="stylesheet"], style').length
            };
        });
        
        console.log(`   Всего элементов: ${domStats.elements}`);
        console.log(`   Заголовки: H1=${domStats.headings.h1}, H2=${domStats.headings.h2}, H3=${domStats.headings.h3}`);
        console.log(`   Ссылки: ${domStats.links}`);
        console.log(`   Изображения: ${domStats.images}`);
        console.log(`   Скрипты: ${domStats.scripts}`);
        console.log(`   Стили: ${domStats.styles}`);
        
        // Скриншот
        console.log('\n📸 Создаю скриншот...');
        await page.screenshot({ 
            path: 'example-com-direct.png',
            fullPage: true 
        });
        console.log('✅ Скриншот сохранен: example-com-direct.png');
        
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
    } finally {
        await browser.close();
        console.log('\n🏁 Завершено');
    }
}

// Запускаем
simplePlaywrightFetch();