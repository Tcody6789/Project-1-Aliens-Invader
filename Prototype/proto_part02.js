//Shows create aliens and boss level and the bullets

let player;
let bullets = [];
let aliens = [];
let alienRows = 5;
let alienCols = 10;
let alienSpeed = 1;
let bulletSpeed = 5;
let alienWidth = 40;
let alienHeight = 30;
let playerSize = 30;
let score = 0;
let gameover = false;
let boss;
let bossHealth = 2000;
let bossBulletSpeed = 3;
let bossBullets = [];
let bossFireRate = 100; // Lower is faster

function setup() {
  createCanvas(750, 400);
  player = createVector(width / 2, height - 30);
  createAliens();
  boss = new Boss(width / 2, 50, bossHealth);
}

function draw() {
  background(0);
  
  if (!gameover) {
    movePlayer();
    handleBullets();
    handleAliens();
    handleBoss();
    handleCollisions();
    drawPlayer();
    drawAliens();
    drawBoss();
    drawBullets();
    drawScore();
  } else {
    showGameOver();
  }
}

//Keys that control the player's spaceship


function keyPressed() {
  if (key === ' ') {
    bullets.push(createVector(player.x, player.y - playerSize / 2));
  }
}

//Shows the Aliens


function createAliens() {
  for (let i = 0; i < alienRows; i++) {
    for (let j = 0; j < alienCols; j++) {
      aliens.push(createVector(j * (alienWidth + 10) + 30, i * (alienHeight + 10) + 30));
    }
  }
}

function handleBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y -= bulletSpeed;
    if (bullets[i].y < 0) {
      bullets.splice(i, 1);
    }
  }
  
  for (let i = bossBullets.length - 1; i >= 0; i--) {
    bossBullets[i].y += bossBulletSpeed;
    if (bossBullets[i].y > height) {
      bossBullets.splice(i, 1);
    }
  }
}

function handleAliens() {
  for (let alien of aliens) {
    alien.x += alienSpeed;
    if (alien.x + alienWidth > width || alien.x < 0) {
      alienSpeed *= -1;
      for (let a of aliens) {
        a.y += alienHeight / 2;
      }
    }
  }
  
  if (frameCount % bossFireRate === 0) {
    let target = random(aliens);
    if (target) {
      bossBullets.push(createVector(target.x, target.y));
    }
  }
}

function handleBoss() {
  if (frameCount % bossFireRate === 0) {
    boss.shoot();
  }
}

function movePlayer() {
  if (keyIsDown(LEFT_ARROW)) {
    player.x -= 5;
  } else if (keyIsDown(RIGHT_ARROW)) {
    player.x += 5;
  }
  player.x = constrain(player.x, playerSize / 2, width - playerSize / 2);
}

function handleCollisions() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let j = aliens.length - 1; j >= 0; j--) {
      let d = dist(bullets[i].x, bullets[i].y, aliens[j].x, aliens[j].y);
      if (d < alienWidth / 2) {
        bullets.splice(i, 1);
        aliens.splice(j, 1);
        score++;
        break;
      }
    }
  }
  
  for (let i = bossBullets.length - 1; i >= 0; i--) {
    let d = dist(bossBullets[i].x, bossBullets[i].y, player.x, player.y);
    if (d < playerSize / 2) {
      gameover = true;
      break;
    }
  }
  
  for (let i = bullets.length - 1; i >= 0; i--) {
    let d = dist(bullets[i].x, bullets[i].y, boss.x, boss.y);
    if (d < 50) { // Boss width
      bullets.splice(i, 1);
      boss.health -= 10;
      if (boss.health <= 0) {
        gameover = true;
      }
      break;
    }
  }
}

//shows the player who control the spaceship


function drawPlayer() {
  fill(0, 127, 199);
  push();
  translate(player.x, player.y)
  triangle(-playerSize/2, playerSize/2, 0, -playerSize/2, playerSize/2, playerSize/2);
  pop();
}

function drawAliens() {
  fill(199, 0, 21);
  for (let alien of aliens) {
    //rect(alien.x, alien.y, alienWidth, alienHeight);
    push();
    translate(alien.x, alien.y)
    triangle(-alienWidth/2, -alienHeight/2, 0, alienHeight/2, alienWidth/2, -alienHeight/2);
    pop();
  }
}

//Bullets that is drawn
function drawBullets() {
  fill(255, 0, 0);
  for (let bullet of bullets) {
    rect(bullet.x, bullet.y, 4, 10);
  }
  
  fill(0, 0, 255);
  for (let bullet of bossBullets) {
    rect(bullet.x, bullet.y, 4, 10);
  }
}

//Score drawn here
function drawScore() {
  textSize(16);
  fill(255);
  text("Score: " + score, 10, 20);
  text("Boss Health: " + boss.health, width - 130, 20);
}

//Boss drawn here rect mode 
function drawBoss() {
  fill(255, 0, 0);
  rectMode(CENTER);
  rect(boss.x, boss.y, 100, 50);
}

function showGameOver() {
  textSize(32);
  fill(255);
  textAlign(CENTER, CENTER);
  text("Game Over", width / 2, height / 2);
}

class Boss {
  constructor(x, y, health) {
    this.x = x;
    this.y = y;
    this.health = health;
  }
  
  shoot() {
    let target = player.y;
    bossBullets
  }
}