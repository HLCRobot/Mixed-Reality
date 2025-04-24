class WindGame {
    constructor() {
        this.progress = 0;
        this.audioContext = null;
        this.mic = null;
        this.analyser = null;
        this.isBlowing = false;
        this.animationFrame = null;
        
        this.initElements();
        this.bindEvents();
    }

    initElements() {
        this.windModal = document.createElement('div');
        this.windModal.className = 'wind-modal';
        this.windModal.innerHTML = `
            <div class="wind-content">
                <h3>Blow to Gather Wind Particles!</h3>
                <div class="wind-progress-container">
                    <div id="windProgress"></div>
                    ${Array.from({length: 15}, () => `<div class="wind-particle" style="left:${Math.random()*95}%"></div>`).join('')}
                </div>
                <button class="blow-btn">Blow!</button>
                <div class="success-message">Successfully obtain wind energy!</div>
            </div>
        `;
        document.body.appendChild(this.windModal);

        this.progressBar = document.querySelector('#windProgress');
        this.successMessage = document.querySelector('.success-message');
    }

    bindEvents() {
        document.querySelector('.wind-btn').addEventListener('click', () => this.showGame());
        document.querySelector('.blow-btn').addEventListener('click', () => this.addProgress(5));
        document.querySelector('.blow-btn').addEventListener('mousedown', () => this.startAutoProgress());
        document.querySelector('.blow-btn').addEventListener('mouseup', () => this.stopAutoProgress());
    }

    showGame() {
        this.windModal.style.display = 'block';
        this.initAudioAnalysis();
    }

    closeGame() {
        this.windModal.style.display = 'none';
        this.cleanup();
    }

    initAudioAnalysis() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.mic = this.audioContext.createMediaStreamSource(stream);
                this.analyser = this.audioContext.createAnalyser();
                
                this.mic.connect(this.analyser);
                this.analyser.fftSize = 32;
                this.startVolumeDetection();
            })
            .catch(err => console.log('Microphone access denied:', err));
    }

    startVolumeDetection() {
        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        
        const detectVolume = () => {
            this.analyser.getByteFrequencyData(dataArray);
            const avg = dataArray.reduce((a,b) => a + b) / dataArray.length;
            
            if(avg > 10) {
                this.addProgress(avg / 50);
            }
            
            this.animationFrame = requestAnimationFrame(detectVolume);
        };
        
        detectVolume();
    }

    addProgress(amount) {
        if(this.progress >= 100) return;
        
        this.progress = Math.min(this.progress + amount, 100);
        this.progressBar.style.width = `${this.progress}%`;
        
        if(this.progress >= 100) {
            this.onComplete();
        }
    }

    startAutoProgress() {
        this.isBlowing = true;
        this.autoProgress();
    }

    stopAutoProgress() {
        this.isBlowing = false;
    }

    autoProgress() {
        if(this.isBlowing && this.progress < 100) {
            this.addProgress(1);
            setTimeout(() => this.autoProgress(), 100);
        }
    }

    onComplete() {
        this.successMessage.style.display = 'block';
        setTimeout(() => {
            this.closeGame();
            document.querySelector('.wind-btn').disabled = true;
            document.querySelector('.wind-icon').classList.add('active');
            document.getElementById('clue5').style.display = 'block';
        }, 1500);
    }

    cleanup() {
        if(this.animationFrame) cancelAnimationFrame(this.animationFrame);
        if(this.mic) this.mic.disconnect();
        this.progress = 0;
        this.progressBar.style.width = '0%';
        this.successMessage.style.display = 'none';
    }
}

// 初始化风系游戏
document.addEventListener('DOMContentLoaded', () => new WindGame());