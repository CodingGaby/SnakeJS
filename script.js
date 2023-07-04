// Initialize the game canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Score variables
let score = 0;
let speed = 100;

// Define the size of each grid cell
const gridSize = 20;
const gridWidth = canvas.width / gridSize;
const gridHeight = canvas.height / gridSize;

// Define the initial position and speed of the snake
let snake = [{ x: 10, y: 10 }];
let dx = 0;
let dy = 0;

let gamePaused = false;

function pauseGame() {
  if (gamePaused) {
    // Si el juego ya está en pausa, reanudarlo
    gamePaused = false;
  } else {
    // Si el juego está en ejecución, pausarlo
    gamePaused = true;
  }
}

// Define the position of the food
let food = { x: 0, y: 0 };

// Generate a random position for the food
function generateFood() {
  let isFoodOnSnake = true;
  let foodX, foodY;

  while (isFoodOnSnake) {
    foodX = Math.floor(Math.random() * (canvas.width / gridSize));
    foodY = Math.floor(Math.random() * (canvas.height / gridSize));

    // Verificar si la posición generada está ocupada por la serpiente
    isFoodOnSnake = snake.some(segment => segment.x === foodX && segment.y === foodY);
  }

  food = {
    x: foodX,
    y: foodY
  };
}

// Handle button click to restart the game
const restartButton = document.getElementById('restartButton');
restartButton.addEventListener('click', restartGame);

const pauseButton = document.getElementById('pauseButton');
pauseButton.addEventListener('click', pauseGame);


// Update the game state
function update() {
  if (gamePaused) {
    return; // Si el juego está en pausa, no se actualiza la serpiente
  }

  // Move the snake
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Wrap the snake around the canvas edges
  if (head.x < 0) {
    head.x = gridWidth - 1;
  } else if (head.x >= gridWidth) {
    head.x = 0;
  }

  if (head.y < 0) {
    head.y = gridHeight - 1;
  } else if (head.y >= gridHeight) {
    head.y = 0;
  }

  // Check if the snake hits itself
  if (isSnakeCollision(head)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  // Check if the snake has collided with the food
  if (head.x === food.x && head.y === food.y) {
    // Generate new food
    generateFood();
    score++; // Increase the score

    // Check if the score is a multiple of 7
    if (score % 7 === 0) {
      speed -= 5; // Decrease the speed
      if (speed < 40) {
        speed = 40; //
      }
    }
  } else {
    // Remove the tail segment
    snake.pop();
  }
}

// Check if the snake collides with itself
function isSnakeCollision(head) {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      return true;
    }
  }
  return false;
}

function restartGame() {
  // Reset snake position and direction
  snake = [{ x: 10, y: 10 }];
  dx = 0;
  dy = 0;

  //Reset speed
  speed = 100

  // Generate new food
  generateFood();

  // Restart the game loop
  clearInterval(gameLoop);
}

// Game over logic
function gameOver() {
  alert('Game over! Your score: ' + (snake.length - 1));
  snake = [{ x: 10, y: 10 }];
  dx = 0;
  dy = 0;
  generateFood();
  score = 0;
  speed = 100
}

// Draw food
function drawFood() {
  ctx.fillStyle = '#ad2e2a';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// Draw the game state on the canvas
function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snake.forEach(segment => {
    ctx.fillStyle = '#238636';
    ctx.beginPath();
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  });

  drawFood();

  /*Draw Speed
  ctx.fillStyle = '#cdd9e5';
  ctx.font = '20px -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"';
  const speedText = speed === 0 ? 'Speed: 0' : 'Speed: ' + speed;
  ctx.fillText(speedText, 20, 80);
  */
  
  //Draw Pause
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  const pausedText = gamePaused === true ? 'Pause' : '';
  const textWidth = ctx.measureText(pausedText).width;

  const x = (canvasWidth - textWidth) / 2 - 70;
  const y = canvasHeight / 2 + 20;

  ctx.fillStyle = '#cdd9e5';
  ctx.font = '70px -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"';
  ctx.fillText(pausedText, x, y);

  // Draw the score
  ctx.fillStyle = '#cdd9e5';
  ctx.font = '20px -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"';
  const scoreText = snake.length - 1 === 0 ? 'Score: 0' : 'Score: ' + (snake.length - 1);
  ctx.fillText(scoreText, 20, 30);
}

// Handle keyboard input
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp' && dy !== 1) {
    dx = 0;
    dy = -1;
  } else if (e.key === 'ArrowDown' && dy !== -1) {
    dx = 0;
    dy = 1;
  } else if (e.key === 'ArrowLeft' && dx !== 1) {
    dx = -1;
    dy = 0;
  } else if (e.key === 'ArrowRight' && dx !== -1) {
    dx = 1;
    dy = 0;
  } else if (e.key === 'Escape') {
    pauseGame();
  }
});

//Game Loop
function gameLoop() {
  update();
  draw();
  setTimeout(gameLoop, speed); // Adjust the speed
}

// Start the game
generateFood();
gameLoop(); 
