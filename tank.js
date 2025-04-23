const TankGame = (() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let isMobile = /Mobi|Android/i.test(navigator.userAgent);
    let gameWidth = 800, gameHeight = 600;
    let playerTank, enemyTanks = [], bullets = [], obstacles = [];
    let energyReleased = false;

    // 初始化游戏
    function init() {
        canvas.id = 'tankCanvas';
        canvas.width = gameWidth;
        canvas.height = gameHeight;
        
        // 创建游戏对象
        createObstacles();
        playerTank = new Tank(gameWidth-100, gameHeight-100, 'yellow', true);
        createEnemies();
        
        // 添加控制
        if(isMobile) createMobileControls();
        else document.addEventListener('keydown', handleKeyDown);

        gameLoop();
    }

    // 创建障碍物
    function createObstacles() {
        // 可破坏的树木
        for(let i=0; i<15; i++) {
            obstacles.push(new Obstacle(
                Math.random()*(gameWidth-200)+100,
                Math.random()*(gameHeight-200)+100,
                'tree'
            ));
        }
        
        // 不可破坏的墙
        for(let i=0; i<10; i++) {
            obstacles.push(new Obstacle(
                Math.random()*(gameWidth-100),
                Math.random()*(gameHeight-100),
                'wall'
            ));
        }

        // 铁栅栏包围能源
        const centerX = gameWidth/2-50, centerY = gameHeight/2-50;
        for(let i=0; i<4; i++) {
            obstacles.push(new Obstacle(centerX-30 + i*30, centerY-30, 'fence'));
            obstacles.push(new Obstacle(centerX-30 + i*30, centerY+30, 'fence'));
            obstacles.push(new Obstacle(centerX-30, centerY-30 + i*30, 'fence'));
            obstacles.push(new Obstacle(centerX+30, centerY-30 + i*30, 'fence'));
        }
    }

    // 创建敌方坦克
    function createEnemies() {
        for(let i=0; i<3; i++) {
            enemyTanks.push(new Tank(
                50 + i*100, 
                50 + i*80, 
                'black', 
                false
            ));
        }
    }

    // 游戏对象类
    class Tank {
        constructor(x, y, color, isPlayer) {
            this.x = x;
            this.y = y;
            this.width = 40;
            this.height = 40;
            this.color = color;
            this.direction = 'up';
            this.speed = 3;
            this.isPlayer = isPlayer;
            this.lastShot = 0;
        }

        move() {
            let prevX = this.x, prevY = this.y;
            
            switch(this.direction) {
                case 'up': this.y -= this.speed; break;
                case 'down': this.y += this.speed; break;
                case 'left': this.x -= this.speed; break;
                case 'right': this.x += this.speed; break;
            }

            if(this.checkCollision()) {
                this.x = prevX;
                this.y = prevY;
            }

            if(!this.isPlayer && Math.random() < 0.02) {
                this.direction = ['up','down','left','right'][Math.floor(Math.random()*4)];
            }
        }

        checkCollision() {
            if(this.x < 0 || this.x + this.width > gameWidth ||
               this.y < 0 || this.y + this.height > gameHeight) return true;

            return obstacles.some(obs => {
                if(obs.type === 'fence' && energyReleased) return false;
                return (this.x < obs.x + 40 && this.x + this.width > obs.x &&
                        this.y < obs.y + 40 && this.y + this.height > obs.y) &&
                        obs.type !== 'tree';
            });
        }

        shoot() {
            const now = Date.now();
            if(now - this.lastShot > (this.isPlayer ? 500 : 1000)) {
                bullets.push(new Bullet(
                    this.x + this.width/2 -5,
                    this.y + this.height/2 -5,
                    this.direction,
                    this.color
                ));
                this.lastShot = now;
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    class Bullet {
        constructor(x, y, direction, color) {
            this.x = x;
            this.y = y;
            this.size = 10;
            this.direction = direction;
            this.color = color;
            this.speed = 7;
        }

        update() {
            switch(this.direction) {
                case 'up': this.y -= this.speed; break;
                case 'down': this.y += this.speed; break;
                case 'left': this.x -= this.speed; break;
                case 'right': this.x += this.speed; break;
            }
        }
    }

    class Obstacle {
        constructor(x, y, type) {
            this.x = x;
            this.y = y;
            this.type = type;
            this.destructible = type === 'tree';
        }
    }

    // 游戏循环
    function gameLoop() {
        ctx.clearRect(0, 0, gameWidth, gameHeight);

        // 绘制障碍物
        obstacles.forEach(obs => {
            if(obs.type === 'fence' && energyReleased) return;
            ctx.fillStyle = obs.type === 'tree' ? '#2E8B57' : 
                          obs.type === 'wall' ? '#666' : '#C0C0C0';
            ctx.fillRect(obs.x, obs.y, 40, 40);
        });

        // 更新玩家
        playerTank.move();
        playerTank.shoot();
        playerTank.draw();

        // 更新敌方
        enemyTanks.forEach(tank => {
            tank.move();
            tank.shoot();
            tank.draw();
        });

        // 更新子弹
        bullets.forEach((bullet, idx) => {
            bullet.update();
            ctx.fillStyle = bullet.color;
            ctx.fillRect(bullet.x, bullet.y, 10, 10);

            // 碰撞检测
            if(bullet.x < 0 || bullet.x > gameWidth || 
               bullet.y < 0 || bullet.y > gameHeight) {
                bullets.splice(idx, 1);
                return;
            }

            obstacles.forEach((obs, oIdx) => {
                if(bullet.x > obs.x && bullet.x < obs.x+40 &&
                   bullet.y > obs.y && bullet.y < obs.y+40) {
                    if(obs.destructible) {
                        obstacles.splice(oIdx, 1);
                        bullets.splice(idx, 1);
                    } else if(obs.type !== 'fence') {
                        bullets.splice(idx, 1);
                    }
                }
            });

            // 坦克被击中
            const targetTanks = bullet.color === 'yellow' ? enemyTanks : [playerTank];
            targetTanks.forEach((tank, tIdx) => {
                if(bullet.x > tank.x && bullet.x < tank.x+40 &&
                   bullet.y > tank.y && bullet.y < tank.y+40) {
                    if(!tank.isPlayer) enemyTanks.splice(tIdx, 1);
                    bullets.splice(idx, 1);
                }
            });
        });

        // 绘制清洁能源
        if(enemyTanks.length === 0) {
            energyReleased = true;
            ctx.beginPath();
            ctx.arc(gameWidth/2, gameHeight/2, 30, 0, Math.PI*2);
            ctx.fillStyle = 'gold';
            ctx.strokeStyle = 'darkgoldenrod';
            ctx.lineWidth = 3;
            ctx.fill();
            ctx.stroke();

            // 检测接触
            if(Math.abs(playerTank.x - gameWidth/2) < 50 && 
               Math.abs(playerTank.y - gameHeight/2) < 50) {
                document.getElementById('tankGame').style.display = 'none';
                document.querySelector('.earth-btn').disabled = true;
                document.querySelector('.earth-icon').classList.add('active');
                document.getElementById('clue4').style.display = 'block';
                
                if(typeof window.onEarthEnergyObtained === 'function') {
                    window.onEarthEnergyObtained();
                }
            }
        }

        requestAnimationFrame(gameLoop);
    }

    // 控制处理
    function handleKeyDown(e) {
        const dirMap = {37:'left',38:'up',39:'right',40:'down'};
        if(dirMap[e.keyCode]) {
            playerTank.direction = dirMap[e.keyCode];
        }
    }

    function createMobileControls() {
        const controls = document.createElement('div');
        controls.className = 'mobile-controls';
        ['up','left','down','right'].forEach(dir => {
            const btn = document.createElement('button');
            btn.className = 'controlBtn';
            btn.textContent = {up:'↑',down:'↓',left:'←',right:'→'}[dir];
            btn.dataset.direction = dir;
            btn.addEventListener('touchstart', (e) => {
                playerTank.direction = dir;
                e.preventDefault();
            });
            controls.appendChild(btn);
        });
        document.getElementById('tankContainer').appendChild(controls);
        controls.style.display = 'block';
    }

    return { init };
})();

// 暴露接口
function startTankGame() {
    document.getElementById('tankGame').style.display = 'block';
    TankGame.init();
}

window.onEarthEnergyObtained = function() {
    alert('Successfully obtain earth energy!');
};