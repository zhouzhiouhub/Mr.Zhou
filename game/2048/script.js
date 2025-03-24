// 游戏变量
let board = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let score = 0;
let highScore = 0;
let gameOver = false;

// DOM元素
const grid = document.getElementById('grid');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const finalScoreElement = document.getElementById('final-score');
const finalHighScoreElement = document.getElementById('final-high-score');
const gameOverBox = document.getElementById('game-over');
const newGameButton = document.getElementById('new-game');
const restartButton = document.getElementById('restart');

// 获取并初始化历史最高分
function initHighScore() {
    const savedHighScore = localStorage.getItem('2048-highScore');
    highScore = savedHighScore ? parseInt(savedHighScore) : 0;
    highScoreElement.textContent = highScore;
    finalHighScoreElement.textContent = highScore;
}

// 保存历史最高分
function saveHighScore(score) {
    localStorage.setItem('2048-highScore', score.toString());
}

// 创建网格
function createGrid() {
    grid.innerHTML = '';
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.id = 'cell-' + i;
        grid.appendChild(cell);
    }
}

// 重置游戏
function resetGame() {
    board = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    score = 0;
    gameOver = false;
    updateScore();
    gameOverBox.style.display = 'none';
    
    // 添加两个初始方块
    addRandomTile();
    addRandomTile();
    
    updateBoard();
}

// 添加随机方块
function addRandomTile() {
    const emptyIndexes = [];
    for (let i = 0; i < 16; i++) {
        if (board[i] === 0) {
            emptyIndexes.push(i);
        }
    }
    
    if (emptyIndexes.length > 0) {
        const index = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
        board[index] = Math.random() < 0.9 ? 2 : 4;
    }
}

// 更新分数
function updateScore() {
    scoreElement.textContent = score;
    finalScoreElement.textContent = score;
    
    // 更新最高分
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;
        finalHighScoreElement.textContent = highScore;
        saveHighScore(highScore);
    }
}

// 更新游戏面板
function updateBoard() {
    for (let i = 0; i < 16; i++) {
        const cell = document.getElementById('cell-' + i);
        cell.className = 'cell';
        cell.textContent = '';
        
        if (board[i] !== 0) {
            cell.classList.add('tile-' + board[i]);
            cell.textContent = board[i];
        }
    }
}

// 检查游戏是否结束
function checkGameOver() {
    for (let i = 0; i < 16; i++) {
        if (board[i] === 0) {
            return false;
        }
    }
    
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 3; col++) {
            const index = row * 4 + col;
            if (board[index] === board[index + 1]) {
                return false;
            }
        }
    }
    
    for (let col = 0; col < 4; col++) {
        for (let row = 0; row < 3; row++) {
            const index = row * 4 + col;
            if (board[index] === board[index + 4]) {
                return false;
            }
        }
    }
    
    return true;
}

// 显示游戏结束
function showGameOver() {
    gameOver = true;
    gameOverBox.style.display = 'flex';
}

// 移动处理函数
function move(direction) {
    if (gameOver) return;
    
    const oldBoard = [...board];
    let moved = false;
    
    if (direction === 'left') {
        for (let row = 0; row < 4; row++) {
            let line = [
                board[row * 4],
                board[row * 4 + 1],
                board[row * 4 + 2],
                board[row * 4 + 3]
            ];
            
            line = line.filter(val => val !== 0);
            
            for (let i = 0; i < line.length - 1; i++) {
                if (line[i] === line[i + 1]) {
                    line[i] *= 2;
                    score += line[i];
                    line.splice(i + 1, 1);
                }
            }
            
            while (line.length < 4) {
                line.push(0);
            }
            
            for (let col = 0; col < 4; col++) {
                board[row * 4 + col] = line[col];
            }
        }
    } else if (direction === 'right') {
        for (let row = 0; row < 4; row++) {
            let line = [
                board[row * 4],
                board[row * 4 + 1],
                board[row * 4 + 2],
                board[row * 4 + 3]
            ];
            
            line = line.filter(val => val !== 0);
            
            for (let i = line.length - 1; i > 0; i--) {
                if (line[i] === line[i - 1]) {
                    line[i] *= 2;
                    score += line[i];
                    line.splice(i - 1, 1);
                    i--;
                }
            }
            
            while (line.length < 4) {
                line.unshift(0);
            }
            
            for (let col = 0; col < 4; col++) {
                board[row * 4 + col] = line[col];
            }
        }
    } else if (direction === 'up') {
        for (let col = 0; col < 4; col++) {
            let line = [
                board[col],
                board[col + 4],
                board[col + 8],
                board[col + 12]
            ];
            
            line = line.filter(val => val !== 0);
            
            for (let i = 0; i < line.length - 1; i++) {
                if (line[i] === line[i + 1]) {
                    line[i] *= 2;
                    score += line[i];
                    line.splice(i + 1, 1);
                }
            }
            
            while (line.length < 4) {
                line.push(0);
            }
            
            for (let row = 0; row < 4; row++) {
                board[row * 4 + col] = line[row];
            }
        }
    } else if (direction === 'down') {
        for (let col = 0; col < 4; col++) {
            let line = [
                board[col],
                board[col + 4],
                board[col + 8],
                board[col + 12]
            ];
            
            line = line.filter(val => val !== 0);
            
            for (let i = line.length - 1; i > 0; i--) {
                if (line[i] === line[i - 1]) {
                    line[i] *= 2;
                    score += line[i];
                    line.splice(i - 1, 1);
                    i--;
                }
            }
            
            while (line.length < 4) {
                line.unshift(0);
            }
            
            for (let row = 0; row < 4; row++) {
                board[row * 4 + col] = line[row];
            }
        }
    }
    
    for (let i = 0; i < 16; i++) {
        if (board[i] !== oldBoard[i]) {
            moved = true;
            break;
        }
    }
    
    if (moved) {
        updateScore();
        addRandomTile();
        updateBoard();
        
        if (checkGameOver()) {
            showGameOver();
        }
    }
}

// 按钮事件监听
newGameButton.addEventListener('click', resetGame);
restartButton.addEventListener('click', resetGame);

// 键盘事件监听
document.addEventListener('keydown', function(e) {
    if (gameOver) return;
    
    switch(e.key) {
        case 'ArrowUp':
            e.preventDefault();
            move('up');
            break;
        case 'ArrowDown':
            e.preventDefault();
            move('down');
            break;
        case 'ArrowLeft':
            e.preventDefault();
            move('left');
            break;
        case 'ArrowRight':
            e.preventDefault();
            move('right');
            break;
    }
});

// 触摸事件支持
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: false });

document.addEventListener('touchend', function(e) {
    if (gameOver) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 20) {
            move('right');
        } else if (dx < -20) {
            move('left');
        }
    } else {
        if (dy > 20) {
            move('down');
        } else if (dy < -20) {
            move('up');
        }
    }
}, { passive: false });

// 初始化游戏
createGrid();
initHighScore();
resetGame();
