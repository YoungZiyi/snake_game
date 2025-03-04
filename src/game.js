const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverDiv = document.getElementById('gameOver');
const finalScoreSpan = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');

// Game configuration
const GRID_SIZE = 20;
const GAME_SPEED = 150;

// Set canvas size
canvas.width = 400;
canvas.height = 400;

let snake = [
    { x: 200, y: 200 },
];
let food = generateFood();
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let gameLoop;

function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / GRID_SIZE)) * GRID_SIZE,
        y: Math.floor(Math.random() * (canvas.height / GRID_SIZE)) * GRID_SIZE
    };
}

function update() {
    direction = nextDirection;
    const head = { ...snake[0] };

    switch (direction) {
        case 'up': head.y -= GRID_SIZE; break;
        case 'down': head.y += GRID_SIZE; break;
        case 'left': head.x -= GRID_SIZE; break;
        case 'right': head.x += GRID_SIZE; break;
    }

    // Check collisions
    if (snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        snake.push({});
        food = generateFood();
    } else {
        snake.pop();
    }

    // Wrap snake position at edges
    if (head.x >= canvas.width) head.x = 0;
    if (head.x < 0) head.x = canvas.width - GRID_SIZE;
    if (head.y >= canvas.height) head.y = 0;
    if (head.y < 0) head.y = canvas.height - GRID_SIZE;
    draw();
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#34495e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = '#2ecc71';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, GRID_SIZE - 2, GRID_SIZE - 2);
    });

    // Draw food
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(food.x, food.y, GRID_SIZE - 2, GRID_SIZE - 2);
}

function gameOver() {
    clearInterval(gameLoop);
    gameOverDiv.classList.remove('hidden');
    finalScoreSpan.textContent = score;
}

function startGame() {
    const playerName = document.getElementById('playerName').textContent;
    if (!playerName) return;
    
    snake = [{ x: 200, y: 200 }];
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    food = generateFood();
    gameOverDiv.classList.add('hidden');
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(update, GAME_SPEED);
}

// Remove auto-start
// startGame();
// Event listeners
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction !== 'down') nextDirection = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') nextDirection = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') nextDirection = 'right';
            break;
    }
});

document.getElementById('playerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const playerName = document.getElementById('playerNameInput').value;
    document.getElementById('nameForm').classList.add('hidden');
    document.getElementById('playerName').textContent = `Player: ${playerName}`;
    document.getElementById('playerName').classList.remove('hidden');
    startGame();
    canvas.focus();
});

restartButton.addEventListener('click', startGame);

// In restart handler
restartButton.addEventListener('click', () => {
    document.getElementById('gameOver').classList.add('hidden');
    startGame();
    canvas.focus();
});

// Start the game
// startGame();