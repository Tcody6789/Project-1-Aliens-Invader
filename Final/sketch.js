// Alien Invaders Game with Larger Power-Ups and Collision Detection, Labeled Functions



let player;
let aliens = [];
let bullets = [];
let stars = [];
let playerSize = 35;
let alienSize = 45;
let bulletSize = 10; // Increased bullet size
let playerSpeed = 5;
let bulletSpeed = 9;
let alienSpeed = 0.7;
let alienFireRate = 0.1;
let score = 0;
let lives = 3;
let level = 1;
let gameOver = false;
let powerUp;
let powerUpActive = false;
let powerUpDuration = 5000; // Power-up duration in milliseconds
let powerUpStartTime;

function setup() {
  createCanvas(800, 800);
  player = new Player(width / 2, height - 50);
  createStars(100);
  createAliens();
}

function draw() {
  background(0);
  drawStars();
  player.move();
  player.display();
  moveAliens();
  moveBullets();
  handleCollisions();
  handleAlienShooting();
  handlePlayerShooting();
  handlePowerUp();
  drawEntities();
  drawUI();
  if (gameOver) {
    showGameOver();
    noLoop();
  } else if (aliens.length === 0) {
    showYouWin(); // Show "You Win" message if all aliens are destroyed
    noLoop();
  }
}

function createStars(numStars) {
  for (let i = 0; i < numStars; i++) {
    stars.push(createVector(random(width), random(height)));
  }
}

function drawStars() {
  fill(255);
  noStroke();
  for (let star of stars) {
    ellipse(star.x, star.y, 2, 2);
  }
}

function createAliens() {
  let rows = 4;
  let cols = 10;
  let spacing = 70;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let x = 50 + j * spacing;
      let y = 50 + i * spacing;
      aliens.push(new Alien(x, y));
    }
  }
}

function moveAliens() {
  for (let alien of aliens) {
    alien.move();
  }
}

function moveBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].move();
    if (bullets[i].y < 0 || bullets[i].y > height) {
      bullets.splice(i, 1);
    }
  }
}

function handleCollisions() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    let bullet = bullets[i];
    if (bullet.direction === -1) {
      for (let j = aliens.length - 1; j >= 0; j--) {
        let alien = aliens[j];
        if (dist(bullet.x, bullet.y, alien.x, alien.y) < alienSize / 2) {
          bullets.splice(i, 1);
          aliens.splice(j, 1);
          score++;
          break;
        }
      }
    }
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    let bullet = bullets[i];
    if (bullet.direction === 1) {
      if (dist(bullet.x, bullet.y, player.x, player.y) < playerSize / 2) {
        bullets.splice(i, 1);
        lives--;
        if (lives <= 0) {
          gameOver = true;
        }
      }
    }
  }

  if (powerUpActive && dist(powerUp.x, powerUp.y, player.x, player.y) < 20) {
    powerUpActive = false;
    powerUpStartTime = millis();
    bulletSize = 12; // Increase bullet size temporarily
  }
}

function handleAlienShooting() {
  if (frameCount % (75 * alienFireRate) === 0) {
    let randomAlien = random(aliens);
    bullets.push(new Bullet(randomAlien.x, randomAlien.y + alienSize / 2, 1));
  }
}

function handlePlayerShooting() {
  if (keyIsDown(32) && millis() - player.lastFireTime > 200) {
    bullets.push(new Bullet(player.x, player.y - playerSize / 2, -1));
    player.lastFireTime = millis();
  }
}

function handlePowerUp() {
  if (!powerUpActive && random(1000) < 5) { // 1 in 1000 chance of spawning power-up
    let y = player.y;
    powerUp = createVector(random(width), y); // Set power-up y-coordinate to player's y-coordinate
    powerUpActive = true;
  }

  if (powerUpActive && millis() - powerUpStartTime > powerUpDuration) {
    bulletSize = 35; // Reset bullet size when power-up expires
  }
}

function drawEntities() {
  fill(255, 0, 0); // Alien color (red)
  for (let alien of aliens) {
    alien.display();
  }

  fill(9, 202, 222); // Player color (blue)
  triangle(player.x, player.y - playerSize / 2, player.x - playerSize / 2, player.y + playerSize / 2, player.x + playerSize / 2, player.y + playerSize / 2);

  fill(255, 0, 0); // Bullets color (red)
  for (let bullet of bullets) {
    bullet.display();
  }

  if (powerUpActive) {
    fill(0, 255, 0); // Power-up color (green)
    ellipse(powerUp.x, powerUp.y, 30, 30); // Larger power-up
  }
}

function drawUI() {
  textSize(20);
  fill(255);
  text("Score: " + score, 20, 30);
  text("Lives: " + lives, width - 100, 30);
}

function showGameOver() {
  textSize(50);
  textAlign(CENTER, CENTER);
  fill(255);
  text("Game Over", width / 2, height / 2);
}

function showYouWin() {
  textSize(50);
  textAlign(CENTER, CENTER);
  fill(255);
  text("You Win!", width / 2, height / 2);
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    resetGame();
  }
}

function resetGame() {
  player = new Player(width / 2, height - 50);
  bullets = [];
  stars = [];
  score = 0;
  lives = 3;
  gameOver = false;
  createStars(100);
  createAliens();
  loop(); // Restart the game loop
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.lastFireTime = 0;
  }

  move() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= playerSpeed;
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.x += playerSpeed;
    }
    this.x = constrain(this.x, playerSize / 2, width - playerSize / 2);
  }

  display() {
    fill(0, 0, 255); // Player color (blue)
    triangle(this.x, this.y - playerSize / 2, this.x - playerSize / 2, this.y + playerSize / 2, this.x + playerSize / 2, this.y + playerSize / 2);
  }
}

class Alien {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  move() {
    this.y += alienSpeed;
    if (this.y > height) {
      this.y = random(-height, 0);
    }
  }

  display() {
    fill(255, 0, 0); // Alien color (red)
    triangle(this.x, this.y + alienSize / 2, this.x - alienSize / 2, this.y - alienSize / 2, this.x + alienSize / 2, this.y - alienSize / 2);
  }
}

class Bullet {
  constructor(x, y, direction) {
    this.x = x;
    this.y = y;
    this.direction = direction; // 1 for alien, -1 for player
  }

  move() {
    this.y += bulletSpeed * this.direction;
  }

  display() {
    if (this.direction === -1) {
      fill(9, 202, 222); // Player bullets color (blue)
    } else {
      fill(255, 255, 0); // Alien bullets color (yellow)
    }
    ellipse(this.x, this.y, bulletSize, bulletSize);
  }
}
