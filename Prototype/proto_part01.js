let player;
let bullets = [];
let aliens = [];
let alienRows = 5;
let alienCols = 10;
let alienSpeed = 1;
let bulletSpeed = 5;
let alienWidth = 40;
let alienHeight = 30;
let playerWidth = 60;
let playerHeight = 20;
let score = 0;
let gameover = false;

function setup() {
  createCanvas(600, 400);
  player = new Player();
  for (let i = 0; i < alienRows; i++) {
    for (let j = 0; j < alienCols; j++) {
      aliens.push(new Alien(j * (alienWidth + 10) + 30, i * (alienHeight + 10) + 30));
    }
  }
}

//Functions show the scoreboard and the text and other functions of the Alien and Player.

function draw() {
  background(0);
  
  if (!gameover) {
    player.show();
    player.move();
    
    for (let bullet of bullets) {
      bullet.show();
      bullet.move();
      for (let alien of aliens) {
        if (bullet.hits(alien)) {
          bullets.splice(bullets.indexOf(bullet), 1);
          aliens.splice(aliens.indexOf(alien), 1);
          score++;
        }
      }
    }
    
    for (let alien of aliens) {
      alien.show();
      alien.move();
      if (alien.y + alienHeight >= height) {
        gameover = true;
      }
    }
    
    if (random(1) < 0.01) {
      let alien = random(aliens);
      let bullet = new Bullet(alien.x + alienWidth / 2, alien.y + alienHeight, 1);
      bullets.push(bullet);
    }
    
    textSize(16);
    fill(255);
    text("Score: " + score, 10, 20);
  } else {
    textSize(32);
    fill(255);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2);
  }
}

//Keys that control the player's spaceship

function keyPressed() {
  if (key === ' ') {
    let bullet = new Bullet(player.x + playerWidth / 2, player.y, -1);
    bullets.push(bullet);
  }
}

//shows the player who control the spaceship

class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 30;
  }
  
  show() {
    fill(0, 127, 199);
    rectMode(CENTER);
    rect(this.x, this.y, playerWidth, playerHeight);
  }
  
  move() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= 5;
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.x += 5;
    }
    this.x = constrain(this.x, 0, width - playerWidth);
  }
}

//Shows the Aliens

class Alien {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  
  show() {
    fill(199, 0, 21);
    rectMode(CENTER);
    rect(this.x, this.y, alienWidth, alienHeight);
  }
  
  move() {
    this.x += alienSpeed;
    if (this.x + alienWidth > width || this.x < 0) {
      alienSpeed *= -1;
      for (let alien of aliens) {
        alien.y += alienHeight / 2;
      }
    }
  }
}

//Shows the movement of the Bullets

class Bullet {
  constructor(x, y, dir) {
    this.x = x;
    this.y = y;
    this.dir = dir;
  }
  
  show() {
    fill(255, 0, 0);
    ellipse(this.x, this.y, 8, 8);
  }
  
  move() {
    this.y += this.dir * bulletSpeed;
  }
  
  hits(alien) {
    let d = dist(this.x, this.y, alien.x + alienWidth / 2, alien.y + alienHeight / 2);
    if (d < alienWidth / 2) {
      return true;
    } else {
      return false;
    }
  }
}
