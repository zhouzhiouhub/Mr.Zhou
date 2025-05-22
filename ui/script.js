// 初始化设备信息
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const device = urlParams.get('device');

    // 如果没有选择设备，提示返回首页
    if (!device) {
        alert('请先选择设备！');
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('com-port').textContent = device.split(' ')[0];
    document.getElementById('device').textContent = device.split('(')[1].replace(')', '');
    updateDirection(); // 初始化灯光方向
    updateSpeed(); // 初始化速度
    updateAdvancedSettings(); // 初始化高阶模式设置
});

// 返回设备选择页面
function returnToDeviceSelection() {
    window.location.href = 'index.html';
}

// 切换模式
function showMode(mode) {
    document.querySelectorAll('.mode-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(mode).classList.add('active');
    document.querySelector(`button[onclick="showMode('${mode}')"]`).classList.add('active');

    updateCurrentMode(mode);
    updateDirection(); // 切换模式时更新灯光方向
    updateSpeed(); // 切换模式时更新速度
    toggleAdvancedMode(); // 切换模式时更新高阶模式
}

// 选择子模式
function selectSubMode(subMode) {
    const currentMode = document.querySelector('.mode-content.active h2').textContent;
    document.getElementById('current-mode').textContent = `${currentMode} - ${subMode}`;
    document.getElementById('device').textContent = subMode; // 模拟设备更新
    updateStatus();
}

// AI 场景应用
function applyAIScene(scene) {
    alert(`应用 AI 场景: ${scene}`);
    document.getElementById('current-mode').textContent = `AI 控制 - ${scene}`;
    updateStatus();
}

// 更新当前模式显示
function updateCurrentMode(mode) {
    const modeNames = {
        'screen-sync': '同屏模式',
        'music': '音乐模式',
        'fantasy': '幻彩模式',
        'single-color': '单色模式',
        'marquee': '跑马灯模式',
        'ai-control': 'AI 控制'
    };
    document.getElementById('current-mode').textContent = `${modeNames[mode]} - 默认`;
    updateStatus();
}

// 更新控制方式
function updateControlMode(mode) {
    const modeNames = {
        'all': '控制所有设备',
        'current': '控制当前设备'
    };
    document.getElementById('control-mode-display').textContent = modeNames[mode];
    console.log(`控制方式更新为: ${modeNames[mode]}`);
    updateStatus();
}

// 更新灯光方向（仅在同屏模式下生效）
function updateDirection() {
    const activeMode = document.querySelector('.mode-content.active');
    if (!activeMode) return;

    // 仅在同屏模式下更新灯光方向
    if (activeMode.id !== 'screen-sync') {
        document.getElementById('direction-display').textContent = '无';
        return;
    }

    const direction1 = activeMode.querySelector('.direction-1').value;
    const direction2 = activeMode.querySelector('.direction-2').value;

    const directionNames = {
        'left-to-right': '从左到右',
        'right-to-left': '从右到左',
        'top-to-bottom': '从上到下',
        'bottom-to-top': '从下到上'
    };

    document.getElementById('direction-display').textContent = `${directionNames[direction1]}, ${directionNames[direction2]}`;
    console.log(`安装方式更新为: ${directionNames[direction1]}, ${directionNames[direction2]}`);
    updateStatus();
}

// 更新灯珠移动速度（仅在幻彩模式和跑马灯模式下生效）
function updateSpeed() {
    const activeMode = document.querySelector('.mode-content.active');
    if (!activeMode) return;

    // 仅在幻彩模式和跑马灯模式下更新速度
    if (activeMode.id !== 'fantasy' && activeMode.id !== 'marquee') {
        document.getElementById('speed-display').textContent = '无';
        return;
    }

    const speed = activeMode.querySelector('.speed-slider').value;
    document.getElementById('speed-display').textContent = speed;
    console.log(`灯珠移动速度更新为: ${speed}`);
    updateStatus();
}

// 切换高阶模式（仅在同屏模式下生效）
function toggleAdvancedMode() {
    const activeMode = document.querySelector('.mode-content.active');
    if (!activeMode || activeMode.id !== 'screen-sync') {
        document.getElementById('range-display').textContent = '无';
        document.getElementById('saturation-display').textContent = '无';
        return;
    }

    const advancedMode = document.getElementById('advanced-mode').checked;
    const advancedSettings = document.getElementById('advanced-settings');
    advancedSettings.style.display = advancedMode ? 'block' : 'none';

    if (!advancedMode) {
        document.getElementById('range-display').textContent = '无';
        document.getElementById('saturation-display').textContent = '无';
    } else {
        updateAdvancedSettings();
    }
    updateStatus();
}

// 更新高阶模式设置（取色范围和颜色饱和度）
function updateAdvancedSettings() {
    const activeMode = document.querySelector('.mode-content.active');
    if (!activeMode || activeMode.id !== 'screen-sync') return;

    const advancedMode = document.getElementById('advanced-mode').checked;
    if (!advancedMode) return;

    const colorRange = activeMode.querySelector('.color-range').value;
    const colorSaturation = activeMode.querySelector('.color-saturation').value;

    document.getElementById('range-display').textContent = colorRange;
    document.getElementById('saturation-display').textContent = colorSaturation;

    console.log(`取色范围更新为: ${colorRange}`);
    console.log(`颜色饱和度更新为: ${colorSaturation}`);
    updateStatus();
}

// 更新状态栏
function updateStatus() {
    const mode = document.getElementById('current-mode').textContent;
    const controlMode = document.getElementById('control-mode-display').textContent;
    const direction = document.getElementById('direction-display').textContent;
    const speed = document.getElementById('speed-display').textContent;
    const range = document.getElementById('range-display').textContent;
    const saturation = document.getElementById('saturation-display').textContent;

    let status = `当前模式: ${mode} | 控制方式: ${controlMode}`;
    if (mode.startsWith('同屏模式')) {
        status += ` | 安装方式: ${direction}`;
        status += ` | 取色范围: ${range} | 颜色饱和度: ${saturation}`;
    }
    if (mode.startsWith('幻彩模式') || mode.startsWith('跑马灯模式')) {
        status += ` | 灯珠移动速度: ${speed}`;
    }
    document.querySelector('.footer p').textContent = status;
}

// 亮度调节
document.getElementById('brightness').addEventListener('input', (e) => {
    console.log(`亮度调整为: ${e.target.value}`);
});

// 开灯/关灯
document.getElementById('power-switch').addEventListener('change', (e) => {
    console.log(`设备${e.target.checked ? '开灯' : '关灯'}`);
});

// 颜色选择
document.getElementById('color-picker').addEventListener('change', (e) => {
    console.log(`颜色选择: ${e.target.value}`);
});