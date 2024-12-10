let level = 1;
let score = 0;
let correctButton;
let colors = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#FFD700', '#4B0082', '#00FF00', '#FF1493',
    '#FF8C00', '#008000', '#800080', '#808000', '#000080', '#808080', '#008080', '#800000',
    '#00FFFF', '#00FF00', '#FFFF00', '#FFA500', '#FF0000', '#800000', '#0000FF', '#C0C0C0'
];
let currentTargetColor;
let npcDialog = [
    "法师：欢迎，勇敢的冒险者！你已准备好迎接挑战吗？",
    "法师：这一关的颜色之间变得更加相似，注意仔细观察。",
    "法师：这关的挑战更大了！你必须反应更快，才能成功！",
    "法师：太棒了！你已经走得很远，但真正的挑战还在前方！"
];

// 颜色值标准化：将 RGB 或 rgba 转为 Hex 格式，便于比较
function normalizeColor(color) {
    if (color.startsWith('#')) {
        return color;
    } else {
        let tempElement = document.createElement("div");
        tempElement.style.color = color;
        document.body.appendChild(tempElement);
        let normalizedColor = window.getComputedStyle(tempElement).color;
        document.body.removeChild(tempElement);
        
        // rgba格式转为hex
        if (normalizedColor.includes('rgba') || normalizedColor.includes('rgb')) {
            let rgba = normalizedColor.match(/\d+/g).map(Number);
            return `#${((1 << 24) + (rgba[0] << 16) + (rgba[1] << 8) + rgba[2]).toString(16).slice(1).toUpperCase()}`;
        }
        return color;
    }
}

// RGB转Hex
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase();
}

// 生成同一色系的相近颜色
function generateSameHueColors(targetColor, count) {
    let hue = parseInt(targetColor.slice(1, 3), 16);
    let saturation = parseInt(targetColor.slice(3, 5), 16);
    let brightness = parseInt(targetColor.slice(5, 7), 16);
    let sameHueColors = [];
    for (let i = 0; i < count; i++) {
        let diff = Math.floor(Math.random() * 32) - 16; // 产生一个-16到+16之间的差值
        let newBrightness = Math.max(0, Math.min(255, brightness + diff));
        sameHueColors.push(rgbToHex(hue, saturation, newBrightness));
    }
    return sameHueColors;
}

// 添加动画效果
function animateElement(element, animation) {
    let anim = element.animate(animation, 500);
    anim.onfinish = () => {
        anim.cancel();
    };
}

// 抖动动画
function shakeElement(element) {
    animateElement(element, [
        { transform: 'translateX(-5px)' },
        { transform: 'translateX(5px)' },
        { transform: 'translateX(-3px)' },
        { transform: 'translateX(3px)' },
        { transform: 'translateX(0)' }
    ]);
}

// 放大缩小动画
function zoomElement(element) {
    animateElement(element, [
        { transform: 'scale(1)' },
        { transform: 'scale(1.1)' },
        { transform: 'scale(1)' }
    ]);
}

// 游戏介绍页
function startGame() {
    document.querySelector('.intro-container').style.display = 'none'; // 隐藏游戏介绍
    document.querySelector('.game-container').style.display = 'block'; // 显示游戏界面
    level = 1;
    score = 0;
    updateGameInfo();
    showNextLevel();
}

// 更新游戏信息
function updateGameInfo() {
    document.getElementById('level').textContent = '关卡：' + level;
    document.getElementById('score').textContent = '分数：' + score;
}

// 显示下一关
function showNextLevel() {
    let dialog = npcDialog[level - 1] || npcDialog[npcDialog.length - 1];
    document.getElementById('npc-dialog').textContent = dialog;

    // 随机选择目标颜色
    currentTargetColor = colors[Math.floor(Math.random() * colors.length)];
    document.getElementById('color-display').style.backgroundColor = currentTargetColor;

    // 生成两个同一色系的相近颜色
    let sameHueColors = generateSameHueColors(currentTargetColor, 2);
    let options = [currentTargetColor, ...sameHueColors];

    // 随机排序选项，确保目标颜色不总是第一个
    options.sort(() => Math.random() - 0.5);

    let buttons = Array.from(document.getElementsByClassName('color-button'));
    for (let i = 0; i < 3; i++) {
        buttons[i].style.backgroundColor = options[i];
        buttons[i].onclick = () => handleColorClick(buttons[i], options[i]);
        buttons[i].style.display = 'inline-block'; // 确保只显示三个按钮
    }
    for (let i = 3; i < buttons.length; i++) {
        buttons[i].style.display = 'none'; // 隐藏多余的按钮
    }
}

function handleColorClick(button, clickedColor) {
    // 标准化颜色值进行比较
    clickedColor = normalizeColor(clickedColor);
    currentTargetColor = normalizeColor(currentTargetColor);

    // 判断是否选择了正确的颜色
    if (clickedColor === currentTargetColor) {
        score += 10;  // 正确答案
        if (score % 50 === 0) level++;  // 每50分增加一个关卡
        updateGameInfo();
        zoomElement(document.getElementById('color-display')); // 放大缩小动画
        showNextLevel();
    } else {
        document.getElementById('npc-dialog').textContent = "法师：错了，再试一次！";
        shakeElement(button); // 抖动动画
    }
}

// 页面加载完成后不自动执行startGame，以确保引导页可以显示
window.onload = function() {
    // 确保引导页显示
};