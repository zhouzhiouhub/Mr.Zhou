
// Game settings
const boardSize = 400;
const gridSize = 20;
const gridCount = boardSize / gridSize;

// Game elements
const canvas = document.getElementById('game-board');
//设置画布大小
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const finalScoreElement = document.getElementById('final-score');
const gameOverElement = document.getElementById('game-over');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');

// Direction buttons
const upBtn = document.getElementById('up-btn');
const downBtn = document.getElementById('down-btn');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');

// Difficulty buttons
const easyBtn = document.getElementById('easy-btn');
const mediumBtn = document.getElementById('medium-btn');
const hardBtn = document.getElementById('hard-btn');

// Difficulty settings
const difficulties = {
    easy: 200,
    medium: 150,
    hard: 80
};

// Game variables
let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let highScore = 0;
let gameInterval;
let gameSpeed = difficulties.easy; // Default to easy
let currentDifficulty = 'easy';
let gameRunning = false;

// Initialize the game
function initGame() {
    // Reset game state
    snake = [
        {x: 5, y: 10},
        {x: 4, y: 10},
        {x: 3, y: 10}
    ];
    
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    updateScore();
    
    // Generate first food
    generateFood();
    
    // Clear game over screen
    gameOverElement.style.display = 'none';
    
    // Draw initial state
    draw();
}

// Set difficulty
function setDifficulty(difficulty) {
    if (gameRunning) {
        clearInterval(gameInterval);
    }
    
    currentDifficulty = difficulty;
    gameSpeed = difficulties[difficulty];
    
    // Update UI
    easyBtn.classList.remove('active-difficulty');
    mediumBtn.classList.remove('active-difficulty');
    hardBtn.classList.remove('active-difficulty');
    
    document.getElementById(`${difficulty}-btn`).classList.add('active-difficulty');
    
    if (gameRunning) {
        gameInterval = setInterval(gameLoop, gameSpeed);
    }
}

// Start the game
function startGame() {
    if (!gameRunning) {
        initGame();
        gameRunning = true;
        gameInterval = setInterval(gameLoop, gameSpeed);
        startButton.textContent = '暂停游戏';
    } else {
        gameRunning = false;
        clearInterval(gameInterval);
        startButton.textContent = '继续游戏';
    }
}

//游戏循环
function gameLoop() {
    update();
    draw();
}

// 更新游戏状态
function update() {
    // Update direction
    direction = nextDirection;
    
    // Calculate new head position
    const head = {...snake[0]};
    switch(direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    
    // Check for collisions with wall
    if (head.x < 0 || head.x >= gridCount || head.y < 0 || head.y >= gridCount) {
        gameOver();
        return;
    }
    
    // Check for collisions with self
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            gameOver();
            return;
        }
    }
    
    // Add new head
    snake.unshift(head);
    
    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        // Increase score
        score += 10;
        updateScore();
        
        // Generate new food
        generateFood();
        
        // Speed up the game slightly (only in easy and medium)
        if (currentDifficulty !== 'hard' && score % 50 === 0 && gameSpeed > 60) {
            clearInterval(gameInterval);
            gameSpeed -= 10;
            gameInterval = setInterval(gameLoop, gameSpeed);
        }
    } else {
        // Remove tail if no food was eaten
        snake.pop();
    }
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, boardSize, boardSize);
    
    // Draw snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#00ff00' : '#00cc00';
        ctx.fillRect(
            segment.x * gridSize, 
            segment.y * gridSize, 
            gridSize - 1, 
            gridSize - 1
        );
    });
    
    // Draw food
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(
        food.x * gridSize, 
        food.y * gridSize, 
        gridSize - 1, 
        gridSize - 1
    );
    
    // Draw grid (optional)
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= boardSize; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, boardSize);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(boardSize, i);
        ctx.stroke();
    }
}

// Generate random food position
function generateFood() {
    while (true) {
        food = {
            x: Math.floor(Math.random() * gridCount),
            y: Math.floor(Math.random() * gridCount)
        };
        
        // Make sure food doesn't spawn on snake
        let onSnake = false;
        for (const segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                onSnake = true;
                break;
            }
        }
        
        if (!onSnake) break;
    }
}

// Update score display
function updateScore() {
    scoreElement.textContent = `分数: ${score}`;
    highScoreElement.textContent = `历史最高分: ${highScore}`;
}

// Game over handler
function gameOver() {
    clearInterval(gameInterval);
    gameRunning = false;
    finalScoreElement.textContent = score;
    gameOverElement.style.display = 'block';
    startButton.textContent = '开始游戏';

    // Update high score if needed
    if (score > highScore) {
        highScore = score;
        saveHighScore(highScore);
        console.log(`New high score: ${highScore}`);
    }
}

// Direction change function
function changeDirection(newDirection) {
    if (!gameRunning) return;
    
    // Prevent 180-degree turns
    if (
        (newDirection === 'up' && direction !== 'down') ||
        (newDirection === 'down' && direction !== 'up') ||
        (newDirection === 'left' && direction !== 'right') ||
        (newDirection === 'right' && direction !== 'left')
    ) {
        nextDirection = newDirection;
    }
}

// Keyboard controls
document.addEventListener('keydown', (event) => {
    if (!gameRunning) return;
    
    switch(event.key) {
        case 'ArrowUp':
            if (direction !== 'down') nextDirection = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') nextDirection = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') nextDirection = 'right';
            break;
    }
});

// Direction buttons event listeners
upBtn.addEventListener('click', () => changeDirection('up'));
downBtn.addEventListener('click', () => changeDirection('down'));
leftBtn.addEventListener('click', () => changeDirection('left'));
rightBtn.addEventListener('click', () => changeDirection('right'));

// Difficulty buttons event listeners
easyBtn.addEventListener('click', () => setDifficulty('easy'));
mediumBtn.addEventListener('click', () => setDifficulty('medium'));
hardBtn.addEventListener('click', () => setDifficulty('hard'));

// Touch events for mobile (prevent scrolling when using direction buttons)
upBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    changeDirection('up');
});
downBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    changeDirection('down');
});
leftBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    changeDirection('left');
});
rightBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    changeDirection('right');
});

// Button event listeners
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

// Initialize game and high score
function initialize() {
    createGrid();
    highScore = getHighScore();
    updateScore();
    initGame();
}

// Fetch high score from localStorage
function getHighScore() {
    const savedHighScore = localStorage.getItem('snakeHighScore');
    return savedHighScore ? parseInt(savedHighScore) : 0;
}

// Save high score to localStorage
function saveHighScore(score) {
    localStorage.setItem('snakeHighScore', score);
}

// Initial setup
function createGrid() {
    // Grid creation logic if needed
}

initialize();
