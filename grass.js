// grass.js
let currentPurificationStep = 0;
const purificationSteps = [
    { 
        image: 'grassland1.jpg',
        button: { text: 'incinerate', color: '#ff4500' },
        effect: 'fire'
    },
    {
        image: 'grassland2.jpg',
        button: { text: 'blow', color: '#006400' },
        effect: 'wind'
    },
    {
        image: 'grassland3.jpg', 
        button: { text: 'activate', color: '#cd853f' },
        effect: 'earth'
    },
    {
        image: 'grassland4.jpg',
        button: { text: 'irrigate', color: '#1b5e20' },
        effect: 'water'
    },
    {
        image: 'grassland5.jpg',
        button: { text: 'return', color: '#ffffff' }
    }
];

function showPurificationInterface() {
    const container = document.createElement('div');
    container.className = 'purification-interface';
    
    // 创建界面元素
    const title = document.createElement('h4');
    title.textContent = 'Please purify the grassland with four clean energy sources';
    
    const imgContainer = document.createElement('div');
    imgContainer.style.position = 'relative';
    const image = document.createElement('img');
    image.className = 'grassland-image';
    
    const effectOverlay = document.createElement('div');
    effectOverlay.className = 'effect-overlay';
    
    const button = document.createElement('button');
    button.className = 'purification-button';
    
    // 初始化第一屏
    updatePurificationUI(container, imgContainer, image, effectOverlay, button);
    
    // 组装元素
    imgContainer.appendChild(image);
    imgContainer.appendChild(effectOverlay);
    container.appendChild(title);
    container.appendChild(imgContainer);
    container.appendChild(button);
    
    document.body.appendChild(container);
    
    // 按钮点击处理
    button.addEventListener('click', () => handlePurificationStep(container, imgContainer, image, effectOverlay, button));
}

function updatePurificationUI(container, imgContainer, image, effectOverlay, button) {
    const step = purificationSteps[currentPurificationStep];
    
    image.src = step.image;
    button.textContent = step.button.text;
    button.style.backgroundColor = step.button.color;
    
    if(step.button.color === '#ffffff') {
        button.style.color = '#000000';
        button.style.border = '1px solid #000';
    } else {
        button.style.color = '#ffffff';
    }
}

function handlePurificationStep(container, imgContainer, image, effectOverlay, button) {
    if(currentPurificationStep >= 4) {
        container.remove();
        document.getElementById('finalRitualBtn').style.display = 'block';
        return;
    }

    // 应用特效
    const effectClass = purificationSteps[currentPurificationStep].effect + '-effect';
    effectOverlay.classList.add(effectClass);
    
    // 特效结束后更新界面
    setTimeout(() => {
        effectOverlay.classList.remove(effectClass);
        currentPurificationStep++;
        
        if(currentPurificationStep < 5) {
            updatePurificationUI(container, imgContainer, image, effectOverlay, button);
        }
    }, 1500);
}

// 暴露接口给主程序
export function initGrassPurification() {
    if(checkAllEnergiesActive() && isInGrassArea()) {
        showPurificationInterface();
    }
}

function checkAllEnergiesActive() {
    const energyIcons = document.querySelectorAll('.energy-icon');
    return Array.from(energyIcons).every(icon => icon.classList.contains('active'));
}

function isInGrassArea() {
    // 实际实现需结合地理位置检测
    return true; // 测试用
}