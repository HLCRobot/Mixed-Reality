// grass.js
const purificationSteps = [
    { 
        image: 'grassland1.jpg',
        action: 'incinerate',
        color: '#ff4500'
    },
    {
        image: 'grassland2.jpg',
        action: 'blow',
        color: '#006400'
    },
    {
        image: 'grassland3.jpg', 
        action: 'activate',
        color: '#cd853f'
    },
    {
        image: 'grassland4.jpg',
        action: 'irrigate',
        color: '#1b5e20'
    },
    {
        image: 'grassland5.jpg',
        action: 'return',
        color: '#ffffff'
    }
];

let currentStep = 0;

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

function handlePurificationAction() {
    if(currentStep >= 4) {
        document.getElementById('purificationModal').style.display = 'none';
        document.getElementById('finalRitualBtn').style.display = 'block';
        currentStep = 0;
        return;
    }

    currentStep++;
    updatePurificationUI();
}

window.initGrassPurification = function() {
    if(!checkAllEnergiesActive()) return;
    
    currentStep = 0;
    updatePurificationUI();
    document.getElementById('purificationModal').style.display = 'block';
    document.getElementById('purificationAction').onclick = handlePurificationAction;
}
