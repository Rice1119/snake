const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreDisplay = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');

const grid = 20;
let snake = [{ x: 10 * grid, y: 10 * grid }];
let food = { x: Math.floor(Math.random() * (canvas.width / grid)) * grid, y: Math.floor(Math.random() * (canvas.height / grid)) * grid };
let dx = grid;
let dy = 0;
let score = 0;
let gameInterval;
const gameSpeed = 150; // 毫秒
let gameRunning = false;

function update() {
    if (!gameRunning) return;

    // 移動蛇
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // 吃掉食物
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = `分數: ${score}`;
        food = { x: Math.floor(Math.random() * (canvas.width / grid)) * grid, y: Math.floor(Math.random() * (canvas.height / grid)) * grid };
    } else {
        snake.pop(); // 移除尾巴
    }

    // 檢查碰撞
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || checkCollision()) {
        gameOver();
        return;
    }

    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    drawSnake();
}

function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? 'green' : 'lime';
        ctx.fillRect(segment.x, segment.y, grid, grid);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(segment.x, segment.y, grid, grid);
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, grid, grid);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(food.x, food.y, grid, grid);
}

function checkCollision() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
}

function changeDirection(e) {
    if (!gameRunning) return;
    if (e.key === 'ArrowUp' && dy === 0) {
        dx = 0;
        dy = -grid;
    } else if (e.key === 'ArrowDown' && dy === 0) {
        dx = 0;
        dy = grid;
    } else if (e.key === 'ArrowLeft' && dx === 0) {
        dx = -grid;
        dy = 0;
    } else if (e.key === 'ArrowRight' && dx === 0) {
        dx = grid;
        dy = 0;
    }
}

function gameOver() {
    gameRunning = false;
    clearInterval(gameInterval);
    finalScoreDisplay.textContent = `你的分數是: ${score}`;
    gameOverScreen.classList.remove('hidden');
}

function resetGame() {
    snake = [{ x: 10 * grid, y: 10 * grid }];
    food = { x: Math.floor(Math.random() * (canvas.width / grid)) * grid, y: Math.floor(Math.random() * (canvas.height / grid)) * grid };
    dx = grid;
    dy = 0;
    score = 0;
    scoreDisplay.textContent = `分數: ${score}`;
    gameOverScreen.classList.add('hidden');
    startGame();
}

function startGame() {
    gameRunning = true;
    clearInterval(gameInterval);
    gameInterval = setInterval(update, gameSpeed);
}

document.addEventListener('keydown', changeDirection);
restartButton.addEventListener('click', resetGame);

// 遊戲開始
startGame();