// grass.js
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

class PurificationProcess {
    constructor() {
        this.currentStep = 0;
        this.container = null;
    }

    init() {
        this.createInterface();
        document.body.appendChild(this.container);
    }

    createInterface() {
        this.container = document.createElement('div');
        this.container.className = 'purification-interface';
        
        const title = document.createElement('h4');
        title.textContent = 'Please purify the grassland with four clean energy sources';
        
        this.imgContainer = document.createElement('div');
        this.imgContainer.style.position = 'relative';
        
        this.image = document.createElement('img');
        this.image.className = 'grassland-image';
        
        this.effectOverlay = document.createElement('div');
        this.effectOverlay.className = 'effect-overlay';
        
        this.button = document.createElement('button');
        this.button.className = 'purification-button';
        
        this.updateUI();
        
        this.imgContainer.append(this.image, this.effectOverlay);
        this.container.append(title, this.imgContainer, this.button);
        
        this.button.addEventListener('click', () => this.handleStep());
    }

    updateUI() {
        const step = purificationSteps[this.currentStep];
        this.image.src = step.image;
        this.button.textContent = step.button.text;
        this.button.style.backgroundColor = step.button.color;
        
        if(step.button.color === '#ffffff') {
            this.button.classList.add('return-btn');
        } else {
            this.button.classList.remove('return-btn');
        }
    }

    handleStep() {
        if(this.currentStep >= 4) {
            this.container.remove();
            document.getElementById('finalRitualBtn').style.display = 'block';
            return;
        }

        const effectClass = purificationSteps[this.currentStep].effect + '-effect';
        this.effectOverlay.classList.add(effectClass);
        
        setTimeout(() => {
            this.effectOverlay.classList.remove(effectClass);
            this.currentStep++;
            this.updateUI();
        }, 1500);
    }
}

export function initGrassPurification() {
    new PurificationProcess().init();
}
