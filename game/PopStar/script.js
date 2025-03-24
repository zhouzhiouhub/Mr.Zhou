let canvas, ctx;
const cols = 10, rows = 12, size = 40;
let grid = [];
const colors = ["red", "blue", "green", "yellow", "purple"];
let gameOverModal, exitButton, playAgainButton;
let levelCompleteModal, nextLevelButton, restartButton;
let currentScoreElement, currentTargetScoreElement, currentLevelElement;
let finalScoreElement, levelScoreElement, levelTargetElement;

// 分数和关卡相关变量
let currentScore = 0;
let currentLevel = 1;
let targetScore = 1000;

// 在页面加载完成后初始化DOM元素引用
document.addEventListener("DOMContentLoaded", function() {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");
    canvas.width = cols * size;
    canvas.height = rows * size;
    
    // 游戏结束界面元素
    gameOverModal = document.getElementById("gameOverModal");
    exitButton = document.getElementById("exitButton");
    playAgainButton = document.getElementById("playAgainButton");
    finalScoreElement = document.getElementById("finalScore");
    
    // 过关界面元素
    levelCompleteModal = document.getElementById("levelCompleteModal");
    nextLevelButton = document.getElementById("nextLevelButton");
    restartButton = document.getElementById("restartButton");
    levelScoreElement = document.getElementById("levelScore");
    levelTargetElement = document.getElementById("nextTargetScore");
    
    // 分数和关卡显示元素
    currentScoreElement = document.getElementById("currentScore");
    currentTargetScoreElement = document.getElementById("currentTargetScore");
    currentLevelElement = document.getElementById("currentLevel");
    
    // 更新界面显示
    updateScoreDisplay();
    
    // 事件监听器 - 游戏结束界面
    exitButton.addEventListener("click", function() {
        alert("感谢您的游玩！");
        hideGameOver();
    });

    playAgainButton.addEventListener("click", function() {
        hideGameOver();
        resetGame();
    });
    
    // 事件监听器 - 过关界面
    nextLevelButton.addEventListener("click", function() {
        hideLevelComplete();
        nextLevel();
    });
    
    restartButton.addEventListener("click", function() {
        hideLevelComplete();
        resetGame();
    });
    
    // 初始化游戏
    initGrid();
    
    // 添加点击事件监听器
    canvas.addEventListener("click", (e) => {
        const x = Math.floor(e.offsetX / size);
        const y = Math.floor(e.offsetY / size);
        if (y >= 0 && y < rows && x >= 0 && x < cols && grid[y][x]) {
            let visited = new Set();
            getNeighbors(y, x, grid[y][x], visited);
            if (visited.size > 1) removeBlocks(visited);
        }
    });
});

function initGrid() {
    grid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => colors[Math.floor(Math.random() * colors.length)]));
    drawGrid();
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c]) {
                ctx.fillStyle = grid[r][c];
                ctx.fillRect(c * size, r * size, size - 2, size - 2);
            }
        }
    }
}

function getNeighbors(r, c, color, visited) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || visited.has(`${r}-${c}`) || grid[r][c] !== color) return;
    visited.add(`${r}-${c}`);
    getNeighbors(r - 1, c, color, visited);
    getNeighbors(r + 1, c, color, visited);
    getNeighbors(r, c - 1, color, visited);
    getNeighbors(r, c + 1, color, visited);
}

function removeBlocks(visited) {
    // 计算得分：消除方块数量的平方 × 5
    const blocksRemoved = visited.size;
    const pointsEarned = blocksRemoved * blocksRemoved * 5;
    currentScore += pointsEarned;
    
    // 更新分数显示
    updateScoreDisplay();
    
    // 移除方块
    visited.forEach(pos => {
        let [r, c] = pos.split("-").map(Number);
        grid[r][c] = null;
    });
    
    applyGravity();
    drawGrid();
    
    // 检查是否还有可消除的方块
    if (!hasMovesLeft()) {
        explodeRemainingBlocks(); // 先触发爆炸效果
    }
}

function applyGravity() {
    // 纵向重力（方块下落）
    for (let c = 0; c < cols; c++) {
        let col = grid.map(row => row[c]).filter(Boolean);
        while (col.length < rows) col.unshift(null);
        for (let r = 0; r < rows; r++) grid[r][c] = col[r];
    }
    
    // 横向缩合（一次性移动）
    let newGrid = Array.from({ length: rows }, () => Array(cols).fill(null));
    let newCol = 0;
    for (let c = 0; c < cols; c++) {
        if (grid.some(row => row[c] !== null)) {
            for (let r = 0; r < rows; r++) {
                newGrid[r][newCol] = grid[r][c];
            }
            newCol++;
        }
    }
    grid = newGrid; // 更新网格
}

// 检查是否还有可消除的方块
function hasMovesLeft() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!grid[r][c]) continue;
            const color = grid[r][c];
            if (c + 1 < cols && grid[r][c + 1] === color) return true;
            if (r + 1 < rows && grid[r + 1][c] === color) return true;
        }
    }
    return false;
}

// 爆炸剩余方块，并在结束后判断过关
function explodeRemainingBlocks() {
    let remainingBlocks = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c]) {
                remainingBlocks.push({ r, c, size: size - 2, color: grid[r][c] });
                grid[r][c] = null; // 清空网格中的方块
            }
        }
    }

    // 计算剩余星星的奖励分数
    const bonusPoints = calculateBonusPoints(remainingBlocks.length);
    currentScore += bonusPoints;

    if (remainingBlocks.length === 0) {
        checkGameResult(); // 如果没有剩余方块，直接判断结果
        return;
    }

    let explosionInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 更新每个方块的大小并绘制
        remainingBlocks.forEach(block => {
            block.size -= 2; // 每次减小2像素
            if (block.size > 0) {
                ctx.fillStyle = block.color;
                ctx.fillRect(
                    block.c * size + (size - block.size) / 2,
                    block.r * size + (size - block.size) / 2,
                    block.size,
                    block.size
                );
            }
        });

        // 移除大小小于等于0的方块
        remainingBlocks = remainingBlocks.filter(block => block.size > 0);

        // 当所有方块爆炸完毕时，结束动画并判断结果
        if (remainingBlocks.length === 0) {
            clearInterval(explosionInterval);
            updateScoreDisplay(); // 更新分数显示
            checkGameResult();
        }
    }, 50); // 每50毫秒更新一次动画
}

// 根据剩余星星数量计算奖励分数
function calculateBonusPoints(remainingStars) {
    let bonus = 0;
    
    switch (remainingStars) {
        case 0:
            bonus = 2000; // 全清奖励
            break;
        case 1:
            bonus = 1000;
            break;
        case 2:
            bonus = 800;
            break;
        case 3:
            bonus = 500;
            break;
        case 4:
            bonus = 300;
            break;
        case 5:
            bonus = 200;
            break;
        case 6:
            bonus = 100;
            break;
        case 7:
            bonus = 50;
            break;
        case 8:
            bonus = 20;
            break;
        case 9:
            bonus = 10;
            break;
        default:
            bonus = 0; // 10颗及以上无奖励
    }
    
    if (bonus > 0) {
        showBonusMessage(remainingStars, bonus);
    }
    
    return bonus;
}

// 显示奖励信息
function showBonusMessage(remainingStars, bonus) {
    const bonusMessage = document.createElement("div");
    bonusMessage.className = "bonus-message";
    
    let message = "";
    let emoji = "";
    
    if (remainingStars === 0) {
        message = "全部消除！";
        emoji = "🎉🎉";
    } else if (remainingStars === 1) {
        message = "只剩1颗！";
        emoji = "🏆";
    } else {
        message = `剩余${remainingStars}颗星星`;
        if (remainingStars <= 5) emoji = "👍";
    }
    
    bonusMessage.innerHTML = `
        <p>${message} ${emoji}</p>
        <p>奖励分数: +${bonus}</p>
    `;
    
    document.body.appendChild(bonusMessage);
    
    setTimeout(() => {
        bonusMessage.classList.add("fade-out");
        setTimeout(() => {
            document.body.removeChild(bonusMessage);
        }, 500);
    }, 2000);
}

// 检查游戏结果
function checkGameResult() {
    if (currentScore >= targetScore) {
        showLevelComplete(); // 达到目标分数，过关
    } else {
        showGameOver(); // 未达到目标分数，游戏结束
    }
}

// 更新分数和关卡显示
function updateScoreDisplay() {
    currentScoreElement.textContent = currentScore;
    currentTargetScoreElement.textContent = targetScore;
    currentLevelElement.textContent = currentLevel;
}

// 显示游戏结束界面
function showGameOver() {
    finalScoreElement.textContent = currentScore;
    gameOverModal.style.display = "block";
}

// 隐藏游戏结束界面
function hideGameOver() {
    gameOverModal.style.display = "none";
}

// 显示过关界面
function showLevelComplete() {
    levelScoreElement.textContent = currentScore;
    levelTargetElement.textContent = targetScore + (currentLevel + 1) * 1000; // 修正：显示下一关的实际目标分数
    levelCompleteModal.style.display = "block";
}

// 隐藏过关界面
function hideLevelComplete() {
    levelCompleteModal.style.display = "none";
}

// 进入下一关
function nextLevel() {
    currentLevel++;
    targetScore += currentLevel * 1000; // 更新当前关的目标分数
    updateScoreDisplay();
    initGrid();
}

// 重置游戏
function resetGame() {
    currentScore = 0;
    currentLevel = 1;
    targetScore = 1000;
    updateScoreDisplay();
    initGrid();
}

// 重新开始游戏（给按钮使用）
function restartGame() {
    resetGame();
}