// Overflowing Palette.js
let selectedColor = null;
let stepsLeft = 5;
let grid = [];
const COLOR_MAP = {
    blue: '#2196F3',
    red: '#F44336',
    yellow: '#FFEB3B', 
    green: '#4CAF50'
};

function initOverflowingPalette() {
    document.getElementById('finalRitualBtn').addEventListener('click', () => {
        document.getElementById('overflowingPaletteModal').style.display = 'block';
        createGrid();
        updateSteps();
    });

    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            selectedColor = this.dataset.color;
        });
    });

    document.getElementById('instructionsBtn').addEventListener('click', () => {
        const text = document.getElementById('gameplayText');
        text.style.display = text.style.display === 'none' ? 'block' : 'none';
    });

    document.getElementById('resetBtn').addEventListener('click', resetGame);
}

function createGrid() {
    const container = document.querySelector('.grid-container');
    container.innerHTML = '';
    grid = [];
    stepsLeft = 5;
    
    for(let i = 0; i < 36; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        const colors = Object.values(COLOR_MAP);
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        cell.style.backgroundColor = randomColor;
        cell.dataset.color = randomColor;
        cell.addEventListener('click', () => handleCellClick(i));
        container.appendChild(cell);
        grid.push(randomColor);
    }
}

function handleCellClick(index) {
    if (!selectedColor || stepsLeft <= 0) return;
    
    const targetColor = grid[index];
    if (targetColor === COLOR_MAP[selectedColor]) return;

    const cells = document.querySelectorAll('.grid-cell');
    const visited = new Set();
    const queue = [index];
    const originalColor = grid[index];
    
    while (queue.length > 0) {
        const current = queue.shift();
        if (visited.has(current) || grid[current] !== originalColor) continue;
        
        visited.add(current);
        grid[current] = COLOR_MAP[selectedColor];
        cells[current].style.backgroundColor = COLOR_MAP[selectedColor];
        
        // Add adjacent cells
        const row = Math.floor(current / 6);
        const col = current % 6;
        if (row > 0) queue.push((row-1)*6 + col);
        if (row < 5) queue.push((row+1)*6 + col);
        if (col > 0) queue.push(row*6 + (col-1));
        if (col < 5) queue.push(row*6 + (col+1));
    }
    
    stepsLeft--;
    updateSteps();
    checkWinCondition();
}

function updateSteps() {
    document.getElementById('stepCounter').textContent = `Steps left: ${stepsLeft}`;
}

function checkWinCondition() {
    const target = COLOR_MAP.green;
    if (grid.every(color => color === target)) {
        setTimeout(() => {
            document.querySelectorAll('.grid-cell').forEach(cell => {
                cell.style.backgroundColor = '#2e7d32';
            });
            alert('Purification Complete!');
            document.getElementById('overflowingPaletteModal').style.display = 'none';
        }, 500);
    }
}

function resetGame() {
    createGrid();
    selectedColor = null;
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
}

document.addEventListener('DOMContentLoaded', initOverflowingPalette);