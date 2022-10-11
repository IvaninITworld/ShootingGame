// canvas 셋팅
let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");

canvas.width = 1500;
canvas.height = 700;

document.body.appendChild(canvas);

let backgroundImage,
  spaceshipImage,
  bulletImage,
  enemyImage,
  gameOverImage,
  collisionImage;
let gameOver = false;

function loadImage() {
  backgroundImage = new Image();
  spaceshipImage = new Image();
  bulletImage = new Image();
  enemyImage = new Image();
  gameOverImage = new Image();
  collisionImage = new Image();

  backgroundImage.src = "images/space.jpg";
  collisionImage.src = "images/collision16.png";
  spaceshipImage.src = "images/basicAircraftHorizon.png";
  enemyImage.src = "images/enemy4.png";
  bulletImage.src = "images/bulletHorizon.png";
  gameOverImage.src = "images/gameOver3.png";
}

let score = 0;
let spaceshipX = 0;
let spaceshipY = canvas.height / 2 - 24;

let keysDown = {};
let bulletList = [];

// function deadBullet(i) {
//   delete bulletList[i];
// }

function Bullet() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.x = spaceshipX;
    this.y = spaceshipY;
    this.alive = true;
    bulletList.push(this);
  };

  this.update = function () {
    this.x += 7;
  };

  this.checkHit = function () {
    for (let i = 0; i < enemyList.length; i++) {
      if (
        this.x >= enemyList[i].x - 10 &&
        this.y >= enemyList[i].y - 20 &&
        this.y <= enemyList[i].y + 35
      ) {
        score += 100;
        this.alive = false;
        enemyList.splice(i, 1);
      }
      if (this.x >= 1475) this.alive = false;
    }
  };
}

function setupKeyboardListener() {
  document.addEventListener("keydown", function (event) {
    console.log(event);
    keysDown[event.key] = true;
  });
  document.addEventListener("keyup", function (event) {
    console.log(event);
    delete keysDown[event.key];

    if (event.key == " ") {
      createBullet();
    }
  });
}

function generateRandomValue(min, max) {
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNum;
}

let enemyList = [];

function Enemy() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.x = 1500;
    this.y = generateRandomValue(0, canvas.height - 60);
    enemyList.push(this);
  };
  this.update = function () {
    this.x -= 3;
    if (this.x <= 0) {
      gameOver = true;
      console.log("game Over");
    }
  };
}

function createEnemy() {
  const interval = setInterval(function () {
    let e = new Enemy();
    e.init();
  }, 400);
  console.log("적군생성");
}

function createBullet() {
  let b = new Bullet();
  b.init();
  console.log("Bullet created");
}

function update() {
  if ("ArrowDown" in keysDown) {
    spaceshipY += 4;
  } // move to right side
  if ("ArrowUp" in keysDown) {
    spaceshipY -= 4;
  } // move to left side

  // 우주선의 이동 범위를 제한해서 update
  if (spaceshipY <= 0) {
    spaceshipY = 0;
  }
  if (spaceshipY >= canvas.height - 48) {
    spaceshipY = canvas.height - 48;
  }
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      bulletList[i].update();
      bulletList[i].checkHit();
      console.log("hit !");
    }
    // if (bulletList[i].y <= 0) {
    //   deadBullet(i);
    //   console.log("bullet disappeared");
    // }
  }

  for (let i = 0; i < enemyList.length; i++) {
    enemyList[i].update();
  }
}

function render() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
  ctx.fillText(`Score: ${score}`, 1100, 20);
  ctx.fillStyle = "white";

  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      ctx.drawImage(bulletImage, bulletList[i].x + 48, bulletList[i].y + 12);
    }
  }

  for (let i = 0; i < enemyList.length; i++) {
    ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
  }
}

function main() {
  if (!gameOver) {
    update();
    render();
    requestAnimationFrame(main);
  } else {
    ctx.drawImage(gameOverImage, 400, 200, 600, 300);
  }
}

loadImage();
setupKeyboardListener();
createEnemy();
main();
