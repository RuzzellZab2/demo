const gameBoard = document.getElementById('game-board');
const movesElement = document.getElementById('moves');
const timerElement = document.getElementById('timer');
const bestResultElement = document.getElementById('best-result');
const newGameButton = document.getElementById('new-game');
const size4x4Button = document.getElementById('size4x4');
const size6x6Button = document.getElementById('size6x6');
const messageElement = document.getElementById('message');
const messageTitle = document.getElementById('message-title');
const messageText = document.getElementById('message-text');
const finalTimeElement = document.getElementById('final-time');
const finalMovesElement = document.getElementById('final-moves');
const playAgainButton = document.getElementById('play-again');

const symbols4x4 = ['🍎', '🍌', '🍒', '🍇', '🍊', '🍓', '🍉', '🥝'];
const symbols6x6 = [...symbols4x4, '🍋', '🍍', '🥭', '🍑', '🍈', '🥥', '🫐', '🍐', '🌰', '🥑', '🌽', '🥦', '🥕', '🧄', '🧅', '🥔', '🍠', '🥒'];

let cards = [];
let openedCards = [];
let matchedPairs = 0;
let moves = 0;
let canClick = true;
let gameTime = 0;
let timerInterval = null;
let currentBoardSize = '4x4';
let totalPairs = 8;
let totalCards = 16;
let gameStarted = false;

function createCards() {
    const symbols = currentBoardSize === '4x4' ? symbols4x4.slice(0, 8) : symbols6x6.slice(0, 18);
    const cardSymbols = [...symbols, ...symbols];
    return cardSymbols.map((symbol, index) => ({
        id: index,
        symbol: symbol,
        isMatched: false,
        isOpened: false
    }));
}

function shuffleCards(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function renderBoard() {
    gameBoard.innerHTML = '';
    gameBoard.className = `game-board size-${currentBoardSize}`;
    
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.id = card.id;
        
        if (card.isMatched) {
            cardElement.classList.add('matched');
        }
        
        if (card.isOpened) {
            cardElement.classList.add('opened');
        }
        
        if (card.isMatched) {
            cardElement.classList.add('disabled');
        }
        
        const cardInner = document.createElement('div');
        cardInner.className = 'card-inner';
        
        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        cardFront.textContent = '?';
        
        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        cardBack.textContent = card.symbol;
        
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        cardElement.appendChild(cardInner);
        
        cardElement.addEventListener('click', () => handleCardClick(card.id));
        gameBoard.appendChild(cardElement);
    });
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    gameTime = 0;
    updateTimer();
    timerInterval = setInterval(() => {
        gameTime++;
        updateTimer();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimer() {
    const minutes = Math.floor(gameTime / 60);
    const seconds = gameTime % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function handleCardClick(cardId) {
    if (!canClick) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isMatched || card.isOpened || openedCards.length >= 2) return;
    
    if (!gameStarted) {
        gameStarted = true;
        startTimer();
    }
    
    card.isOpened = true;
    openedCards.push(card);
    renderBoard();
    
    if (openedCards.length === 2) {
        moves++;
        movesElement.textContent = moves;
        canClick = false;
        
        setTimeout(checkMatch, 1000);
    }
}

function checkMatch() {
    const [card1, card2] = openedCards;
    
    if (card1.symbol === card2.symbol) {
        card1.isMatched = true;
        card2.isMatched = true;
        matchedPairs++;
        
        if (matchedPairs === totalPairs) {
            showWinMessage();
        }
    } else {
        card1.isOpened = false;
        card2.isOpened = false;
    }
    
    openedCards = [];
    canClick = true;
    renderBoard();
}

function showWinMessage() {
    stopTimer();
    const minutes = Math.floor(gameTime / 60);
    const seconds = gameTime % 60;
    const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    finalTimeElement.textContent = timeStr;
    finalMovesElement.textContent = moves;
    
    messageElement.style.display = 'flex';
    
    saveBestScore(moves, gameTime);
    updateBestResult();
}

function hideWinMessage() {
    messageElement.style.display = 'none';
}

function saveBestScore(moves, time) {
    const bestScoreKey = `memory_best_${currentBoardSize}`;
    const currentBest = localStorage.getItem(bestScoreKey);
    
    if (!currentBest) {
        localStorage.setItem(bestScoreKey, JSON.stringify({ moves, time }));
        return;
    }
    
    const best = JSON.parse(currentBest);
    if (time < best.time || (time === best.time && moves < best.moves)) {
        localStorage.setItem(bestScoreKey, JSON.stringify({ moves, time }));
    }
}

function getBestScore() {
    const bestScoreKey = `memory_best_${currentBoardSize}`;
    const best = localStorage.getItem(bestScoreKey);
    
    if (!best) return null;
    
    return JSON.parse(best);
}

function updateBestResult() {
    const best = getBestScore();
    
    if (!best) {
        bestResultElement.textContent = '-';
        return;
    }
    
    const minutes = Math.floor(best.time / 60);
    const seconds = best.time % 60;
    const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    bestResultElement.textContent = `${best.moves} ходов, ${timeStr}`;
}

function resetGame() {
    stopTimer();
    cards = shuffleCards(createCards());
    openedCards = [];
    matchedPairs = 0;
    moves = 0;
    canClick = true;
    gameTime = 0;
    gameStarted = false;
    
    movesElement.textContent = moves;
    timerElement.textContent = '00:00';
    hideWinMessage();
    
    updateBestResult();
    renderBoard();
}

function changeBoardSize(size) {
    if (currentBoardSize === size) return;
    
    currentBoardSize = size;
    totalPairs = size === '4x4' ? 8 : 18;
    totalCards = size === '4x4' ? 16 : 36;
    
    size4x4Button.classList.toggle('active', size === '4x4');
    size6x6Button.classList.toggle('active', size === '6x6');
    
    resetGame();
}

size4x4Button.addEventListener('click', () => changeBoardSize('4x4'));
size6x6Button.addEventListener('click', () => changeBoardSize('6x6'));
newGameButton.addEventListener('click', resetGame);
playAgainButton.addEventListener('click', resetGame);

resetGame();