// calculator.js
// This is a simple calculator implementation in JavaScript.
let displayValue = '0';
const historyItems = [];
let isAdvancedMode = false;

function toggleMode() {
    isAdvancedMode = document.getElementById('mode-toggle').checked;
    const calculator = document.getElementById('calculator');
    
    if (isAdvancedMode) {
        calculator.classList.add('advanced');
    } else {
        calculator.classList.remove('advanced');
    }
}

function updateDisplay() {
    // 处理显示值，将Math函数转换为更易读的形式
    let displayText = displayValue;
    displayText = displayText.replace(/Math\.(PI|E)/g, (match) => {
        if (match === 'Math.PI') return 'π';
        if (match === 'Math.E') return 'e';
        return match;
    });
    
    displayText = displayText.replace(/Math\.(sin|cos|tan|log|log10|sqrt|abs|exp|round)\(/g, (match) => {
        const func = match.substring(5, match.length - 1);
        return func + '(';
    });
    
    document.getElementById('display').textContent = displayText;
}

function appendToDisplay(value) {
    if (displayValue === '0' && value !== '.') {
        displayValue = value;
    } else {
        displayValue += value;
    }
    updateDisplay();
}

function clearDisplay() {
    displayValue = '0';
    updateDisplay();
}

function backspace() {
    if (displayValue.length > 1) {
        displayValue = displayValue.slice(0, -1);
    } else {
        displayValue = '0';
    }
    updateDisplay();
}

function calculateFunction(func) {
    try {
        // 保存当前表达式以显示在历史记录中
        const currentDisplay = displayValue;
        
        // 如果显示值已经是一个完整的表达式（如包含运算符），就用括号包裹它
        if (/[-+*/]/.test(displayValue)) {
            displayValue = `${func}(${displayValue})`;
        } else {
            displayValue = `${func}(${displayValue})`;
        }
        
        // 记录在历史记录中
        const expression = displayValue;
        const result = eval(displayValue);
        historyItems.push(`${expression.replace(/Math\./g, '')} = ${result}`);
        updateHistory();
        
        displayValue = result.toString();
        updateDisplay();
    } catch (error) {
        displayValue = 'Error';
        updateDisplay();
        setTimeout(clearDisplay, 1500);
    }
}

function powerFunction() {
    try {
        displayValue += '**';
        updateDisplay();
    } catch (error) {
        displayValue = 'Error';
        updateDisplay();
        setTimeout(clearDisplay, 1500);
    }
}

function calculateFactorial() {
    try {
        // 保存当前表达式以显示在历史记录中
        const currentValue = eval(displayValue);
        
        // 计算阶乘
        let result = 1;
        for(let i = 2; i <= currentValue; i++) {
            result *= i;
        }
        
        // 记录在历史记录中
        historyItems.push(`${currentValue}! = ${result}`);
        updateHistory();
        
        displayValue = result.toString();
        updateDisplay();
    } catch (error) {
        displayValue = 'Error';
        updateDisplay();
        setTimeout(clearDisplay, 1500);
    }
}

function calculatePercentage() {
    try {
        const currentValue = eval(displayValue);
        const result = currentValue / 100;
        
        // 记录在历史记录中
        historyItems.push(`${currentValue}% = ${result}`);
        updateHistory();
        
        displayValue = result.toString();
        updateDisplay();
    } catch (error) {
        displayValue = 'Error';
        updateDisplay();
        setTimeout(clearDisplay, 1500);
    }
}

function calculateRandom() {
    const result = Math.random();
    displayValue = result.toString();
    
    // 记录在历史记录中
    historyItems.push(`random() = ${result}`);
    updateHistory();
    
    updateDisplay();
}

function calculate() {
    try {
        // 保存当前表达式以显示在历史记录中
        const expression = displayValue;
        
        // 计算表达式的结果
        const result = eval(displayValue);
        
        // 添加到历史记录
        historyItems.push(`${expression.replace(/Math\./g, '')} = ${result}`);
        updateHistory();
        
        displayValue = result.toString();
        updateDisplay();
    } catch (error) {
        displayValue = 'Error';
        updateDisplay();
        setTimeout(clearDisplay, 1500);
    }
}

function updateHistory() {
    const historyElement = document.getElementById('history-items');
    historyElement.innerHTML = '';
    
    // 显示最近的10条历史记录
    const recentHistory = historyItems.slice(-10);
    
    recentHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.textContent = item;
        historyElement.appendChild(historyItem);
    });
}

function clearHistory() {
    // 清空历史记录数组
    historyItems.length = 0;
    // 更新显示
    updateHistory();
}

// 初始化显示
updateDisplay();