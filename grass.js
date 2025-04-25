// grass.js
const purificationSteps = [
    { 
        image: 'grassland1.jpg',
        action: 'incinerate',
        effect: 'fire',
        color: '#ff4500'
    },
    {
        image: 'grassland2.jpg',
        action: 'blow',
        effect: 'wind',
        color: '#006400'
    },
    {
        image: 'grassland3.jpg', 
        action: 'activate',
        effect: 'earth',
        color: '#cd853f'
    },
    {
        image: 'grassland4.jpg',
        action: 'irrigate',
        effect: 'water',
        color: '#1b5e20'
    },
    {
        image: 'grassland5.jpg',
        action: 'return',
        color: '#ffffff'
    }
];

let currentStep = 0;
let isAnimating = false;

function updatePurificationUI() {
    const step = purificationSteps[currentStep];
    const img = document.getElementById('purificationImage');
    const btn = document.getElementById('purificationAction');
    
    img.src = step.image;
    btn.textContent = step.action;
    btn.style.backgroundColor = step.color;
    
    if(step.color === '#ffffff') {
        btn.classList.add('return-btn');
    } else {
        btn.classList.remove('return-btn');
    }
}

function playEffect(effectType) {
    const overlay = document.getElementById('effectOverlay');
    overlay.style.opacity = 1;
    document.getElementById('purificationModal').classList.add(`${effectType}-active`);
    
    setTimeout(() => {
        overlay.style.opacity = 0;
        document.getElementById('purificationModal').classList.remove(`${effectType}-active`);
        isAnimating = false;
    }, 3000);
}

function handlePurificationAction() {
    if(isAnimating) return;
    
    if(currentStep >= 4) {
        document.getElementById('purificationModal').style.display = 'none';
        document.getElementById('finalRitualBtn').style.display = 'block';
        return;
    }

    isAnimating = true;
    playEffect(purificationSteps[currentStep].effect);
    
    setTimeout(() => {
        currentStep++;
        updatePurificationUI();
    }, 3000);
}

window.initGrassPurification = function() {
    if(!checkAllEnergiesActive()) return;
    
    currentStep = 0;
    updatePurificationUI();
    document.getElementById('purificationModal').style.display = 'block';
    document.getElementById('purificationAction').onclick = handlePurificationAction;
}

