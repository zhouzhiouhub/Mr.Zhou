const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;

const COLORS = ['cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red'];
const SHAPES = [
    [[1, 1, 1, 1]], // I
    [[1, 0, 0], [1, 1, 1]], // J
    [[0, 0, 1], [1, 1, 1]], // L
    [[1, 1], [1, 1]], // O
    [[0, 1, 1], [1, 1, 0]], // S
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 1, 0], [0, 1, 1]]  // Z
];

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let currentPiece = null;
let gameOver = false;
let score = 0;
let gameSpeed = 500; // 初始速度，单位为毫秒
let gameInterval = null;
let nextPiece = null;
let isGameRunning = false;
const minGameSpeed = 20;  // 最快速度（最小延迟）
const maxGameSpeed = 1000; // 最慢速度（最大延迟）
const nextCanvas = document.getElementById('nextCanvas');
const nextCtx = nextCanvas.getContext('2d');

// 获取随机方块
function getRandomPiece() {
    const shapeIndex = Math.floor(Math.random() * SHAPES.length);
    return {
        shape: SHAPES[shapeIndex],
        color: COLORS[shapeIndex],
        row: 0,
        col: Math.floor(COLS / 2) - 1
    };
}

// 绘制方块
function drawBlock(x, y, color, context = ctx) {
    context.fillStyle = color;
    context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    context.strokeStyle = '#000';
    context.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

// 绘制游戏画面
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c]) {
                drawBlock(c, r, board[r][c]);
            }
        }
    }
    if (currentPiece) {
        currentPiece.shape.forEach((row, r) => {
            row.forEach((cell, c) => {
                if (cell) {
                    drawBlock(currentPiece.col + c, currentPiece.row + r, currentPiece.color);
                }
            });
        });
    }
}

// 检测碰撞
function isCollision(offsetRow, offsetCol) {
    return currentPiece.shape.some((row, r) => {
        return row.some((cell, c) => {
            if (cell) {
                const newRow = currentPiece.row + r + offsetRow;
                const newCol = currentPiece.col + c + offsetCol;
                return (
                    newRow < 0 ||
                    newRow >= ROWS ||
                    newCol < 0 ||
                    newCol >= COLS ||
                    board[newRow][newCol]
                );
            }
            return false;
        });
    });
}

// 固定方块到棋盘
function placePiece() {
    currentPiece.shape.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell) {
                board[currentPiece.row + r][currentPiece.col + c] = currentPiece.color;
            }
        });
    });

    const linesCleared = clearLines();
    updateScore(linesCleared);

    currentPiece = { ...nextPiece };
    nextPiece = getRandomPiece();
    drawNextPiece();

    if (isCollision(0, 0)) {
        gameOver = true;
        onGameOver();
    }
}

// 消除完整行
function clearLines() {
    const originalLength = board.length;
    board = board.filter(row => row.some(cell => !cell));
    const linesCleared = originalLength - board.length;
    while (board.length < ROWS) {
        board.unshift(Array(COLS).fill(0));
    }
    return linesCleared;
}

// 更新分数
function updateScore(linesCleared) {
    score += linesCleared;
    document.getElementById('score').textContent = score;

    // 根据分数调整游戏速度，确保不超出最大/最小范围
    if (linesCleared > 0 && score % 10 === 0) { // 每10分加速一次
        gameSpeed = Math.max(minGameSpeed, Math.min(maxGameSpeed, gameSpeed - 100));
        if (isGameRunning) {
            restartGameLoop();
        }
    }
}

// 绘制下一个方块
function drawNextPiece() {
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    const offsetX = Math.floor((nextCanvas.width / BLOCK_SIZE - nextPiece.shape[0].length) / 2);
    const offsetY = Math.floor((nextCanvas.height / BLOCK_SIZE - nextPiece.shape.length) / 2);
    nextPiece.shape.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell) {
                drawBlock(c + offsetX, r + offsetY, nextPiece.color, nextCtx);
            }
        });
    });
}

// 游戏循环
function gameLoop() {
    if (!gameOver && isGameRunning) {
        if (!isCollision(1, 0)) {
            currentPiece.row++;
            console.log(`方块下降，当前速度 (延迟): ${gameSpeed}ms`); // 输出当前速度
        } else {
            placePiece();
        }
        drawBoard();
    }
}

// 重启游戏循环
function restartGameLoop() {
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);
    console.log(`游戏循环重启，当前速度 (延迟): ${gameSpeed}ms`); // 输出重启时的速度
}

// 重置棋盘
function resetBoard() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentPiece = getRandomPiece();
    nextPiece = getRandomPiece();
    drawNextPiece();
}

// 重置分数和速度
function resetScore() {
    score = 0;
    gameSpeed = maxGameSpeed; // 重置为最慢速度
    document.getElementById('score').textContent = score;
    
}

// 开始新游戏
function startNewGame() {
    if (!isGameRunning) {
        resetBoard();
        resetScore();
        gameOver = false;
        isGameRunning = true;
        document.getElementById('startGameButton').style.display = 'none';
        document.getElementById('pauseGameButton').style.display = 'inline-block';
        restartGameLoop();
        console.log('新游戏开始');
    }
}

// 暂停游戏
function pauseGame() {
    clearInterval(gameInterval);
    isGameRunning = false;
    console.log('游戏已暂停');
}

// 继续游戏
function resumeGame() {
    if (!gameOver) {
        restartGameLoop();
        isGameRunning = true;
        console.log('游戏继续');
    }
}

// 游戏结束处理
function onGameOver() {
    clearInterval(gameInterval);
    isGameRunning = false;
    showGameOverModal();
}

// 显示游戏结束模态框
function showGameOverModal() {
    const gameOverModal = document.getElementById('gameOverModal');
    if (gameOverModal) {
        gameOverModal.style.display = 'block';
    } else {
        alert('游戏结束！得分：' + score);
    }
}

// 重启游戏
function restartGame() {
    const gameOverModal = document.getElementById('gameOverModal');
    if (gameOverModal) {
        gameOverModal.style.display = 'none';
    }
    startNewGame();
}

// 处理键盘输入
document.addEventListener('keydown', (e) => {
    if (gameOver || !isGameRunning) return;
    if (e.key === 'ArrowLeft' && !isCollision(0, -1)) {
        currentPiece.col--;
    } else if (e.key === 'ArrowRight' && !isCollision(0, 1)) {
        currentPiece.col++;
    } else if (e.key === 'ArrowDown' && !isCollision(1, 0)) {
        currentPiece.row++;
    } else if (e.key === 'ArrowUp') {
        const rotatedShape = currentPiece.shape[0].map((_, i) =>
            currentPiece.shape.map(row => row[i]).reverse()
        );
        const originalShape = currentPiece.shape;
        currentPiece.shape = rotatedShape;
        if (isCollision(0, 0)) {
            currentPiece.shape = originalShape;
        }
    }
    drawBoard();
});

// 按钮事件处理
document.getElementById('leftButton')?.addEventListener('click', () => {
    if (!isCollision(0, -1) && isGameRunning && !gameOver) {
        currentPiece.col--;
        drawBoard();
    }
});

document.getElementById('rightButton')?.addEventListener('click', () => {
    if (!isCollision(0, 1) && isGameRunning && !gameOver) {
        currentPiece.col++;
        drawBoard();
    }
});

document.getElementById('downButton')?.addEventListener('click', () => {
    if (!isCollision(1, 0) && isGameRunning && !gameOver) {
        currentPiece.row++;
        drawBoard();
    }
});

document.getElementById('rotateButton')?.addEventListener('click', () => {
    if (isGameRunning && !gameOver) {
        const rotatedShape = currentPiece.shape[0].map((_, i) =>
            currentPiece.shape.map(row => row[i]).reverse()
        );
        const originalShape = currentPiece.shape;
        currentPiece.shape = rotatedShape;
        if (isCollision(0, 0)) {
            currentPiece.shape = originalShape;
        }
        drawBoard();
    }
});

document.getElementById('backButton')?.addEventListener('click', () => {
    window.history.back();
});

document.getElementById('startGameButton')?.addEventListener('click', () => {
    startNewGame();
});

document.getElementById('pauseGameButton')?.addEventListener('click', () => {
    if (isGameRunning) {
        pauseGame();
        document.getElementById('pauseGameButton').textContent = '继续游戏';
    } else {
        resumeGame();
        document.getElementById('pauseGameButton').textContent = '暂停游戏';
    }
});

document.getElementById('retryButton')?.addEventListener('click', () => {
    // 重置速度
    gameSpeed = maxGameSpeed; // 重置为最慢速度 (1000ms)
    
    // 重置滑块
    const difficultySlider = document.getElementById('difficulty');
    if (difficultySlider) {
        difficultySlider.value = gameSpeed; // 将滑块值同步到 gameSpeed
    }
    
    // 更新显示
    const difficultyValue = document.getElementById('difficultyValue');
    if (difficultyValue) {
        difficultyValue.textContent = gameSpeed; // 显示实际的 gameSpeed
    }
    
    // 重启游戏
    restartGame();
});

document.getElementById('exitButton')?.addEventListener('click', () => {
    window.close();
});

// 更新难度滑块逻辑，确保速度在 minGameSpeed 和 maxGameSpeed 之间
document.getElementById('difficulty')?.addEventListener('input', (event) => {
    const value = parseInt(event.target.value);
    gameSpeed = Math.max(minGameSpeed, Math.min(maxGameSpeed, value));
    document.getElementById('difficultyValue').textContent = gameSpeed; // 显示实际的 gameSpeed
    
    console.log('游戏速度:', gameSpeed);
    if (isGameRunning) {
        restartGameLoop();
    }
});

// 初始化时绘制下一个方块
nextPiece = getRandomPiece();
drawNextPiece();