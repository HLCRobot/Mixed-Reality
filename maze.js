const MAZE_CONFIG = {
    maze: [
        [1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,0,1],
        [1,1,1,0,1,0,1,1,0,1],
        [1,0,0,0,0,0,0,1,0,1],
        [1,0,1,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,0,1,0,1],
        [1,1,1,1,1,0,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1]
    ],
    cellSize: 30,
    player: { x: 1.5, y: 1.5, size: 12 },
    lastUpdate: 0
};

function initMaze() {
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');
    
    // 绘制迷宫
    ctx.fillStyle = '#30475e';
    MAZE_CONFIG.maze.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === 1) {
                ctx.fillRect(x * MAZE_CONFIG.cellSize, y * MAZE_CONFIG.cellSize, MAZE_CONFIG.cellSize, MAZE_CONFIG.cellSize);
            }
        });
    });

    // 绘制出口
    ctx.fillStyle = '#8ac6d1';
    ctx.fillRect(1 * MAZE_CONFIG.cellSize, 8 * MAZE_CONFIG.cellSize, MAZE_CONFIG.cellSize, MAZE_CONFIG.cellSize);
}

function updatePosition(beta, gamma) {
    const now = Date.now();
    if (now - MAZE_CONFIG.lastUpdate < 30) return;
    
    const dx = gamma * 0.03;
    const dy = beta * 0.03;

    const newX = MAZE_CONFIG.player.x + dx;
    const newY = MAZE_CONFIG.player.y + dy;

    if (!checkCollision(newX, newY)) {
        MAZE_CONFIG.player.x = Math.max(1.2, Math.min(8.8, newX));
        MAZE_CONFIG.player.y = Math.max(1.2, Math.min(8.8, newY));
    }

    drawPlayer();
    checkExit();
    MAZE_CONFIG.lastUpdate = now;
}

function checkCollision(x, y) {
    const radius = MAZE_CONFIG.player.size / 2;
    const checkPoints = [
        [x - radius/MAZE_CONFIG.cellSize, y],
        [x + radius/MAZE_CONFIG.cellSize, y],
        [x, y - radius/MAZE_CONFIG.cellSize],
        [x, y + radius/MAZE_CONFIG.cellSize]
    ];

    return checkPoints.some(([px, py]) => {
        const cellX = Math.floor(px);
        const cellY = Math.floor(py);
        return MAZE_CONFIG.maze[cellY][cellX] === 1;
    });
}

function drawPlayer() {
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initMaze();
    
    ctx.beginPath();
    ctx.arc(
        MAZE_CONFIG.player.x * MAZE_CONFIG.cellSize,
        MAZE_CONFIG.player.y * MAZE_CONFIG.cellSize,
        MAZE_CONFIG.player.size, 0, Math.PI * 2
    );
    ctx.fillStyle = 'rgba(173, 216, 230, 0.8)';
    ctx.fill();
}

function checkExit() {
    const exitX = 1;
    const exitY = 8;
    if (MAZE_CONFIG.player.x >= exitX + 0.2 && MAZE_CONFIG.player.x <= exitX + 0.8 &&
        MAZE_CONFIG.player.y >= exitY + 0.2 && MAZE_CONFIG.player.y <= exitY + 0.8) {
        document.getElementById('gameResult').textContent = "Successfully obtain water energy!";
        setTimeout(() => {
            document.getElementById('mazeGame').style.display = 'none';
            unlockWaterEnergy();
            window.removeEventListener('deviceorientation', updatePosition);
        }, 500);
    }
}

function unlockWaterEnergy() {
    document.querySelector('.water-btn').disabled = true;
    document.querySelector('.water-icon').classList.add('active');
    document.getElementById('clue2').style.display = 'block';
}

// 事件监听
document.querySelector('.water-btn').addEventListener('click', () => {
    document.getElementById('mazeGame').style.display = 'block';
    MAZE_CONFIG.player = { x: 1.5, y: 1.5, size: 12 };
    initMaze();
    drawPlayer();

    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(permission => {
                if (permission === 'granted') {
                    window.addEventListener('deviceorientation', (e) => {
                        updatePosition(e.beta, e.gamma);
                    });
                }
            });
    } else {
        window.addEventListener('deviceorientation', (e) => {
            updatePosition(e.beta, e.gamma);
        });
    }
});