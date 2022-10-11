// canvas 셋팅
let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");

canvas.width = 400;
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
  backgroundImage.src = "images/space2.gif";

  spaceshipImage = new Image();
  bulletImage = new Image();
  enemyImage = new Image();
  gameOverImage = new Image();
  collisionImage = new Image();

  collisionImage.src = "images/collision16.png";
  spaceshipImage.src = "images/basicAircraft.png";
  enemyImage.src = "images/enemy4.png";
  bulletImage.src = "images/bullet.png";
  gameOverImage.src = "images/gameOver2.png";
}

let score = 0;
let spaceshipX = canvas.width / 2 - 32;
let spaceshipY = canvas.height - 64;

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
    this.y -= 7;
  };

  this.checkHit = function () {
    for (let i = 0; i < enemyList.length; i++) {
      if (
        this.y <= enemyList[i].y + 10 &&
        this.x >= enemyList[i].x - 25 &&
        this.x <= enemyList[i].x + 25
      ) {
        score += 100;
        this.alive = false;
        enemyList.splice(i, 1);
      }
      if (this.y <= 0) this.alive = false;
    }
  };
}
function setupKeyboardListener() {
  document.addEventListener("keydown", function (event) {
    keysDown[event.key] = true;
  });
  document.addEventListener("keyup", function (event) {
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
    this.x = generateRandomValue(0, canvas.width - 60);
    this.y = 0;
    enemyList.push(this);
  };
  this.update = function () {
    this.y += 3;
    if (this.y >= canvas.height - 60) {
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
  if ("ArrowRight" in keysDown) {
    spaceshipX += 4;
  } // move to right side
  if ("ArrowLeft" in keysDown) {
    spaceshipX -= 4;
  } // move to left side

  // 우주선의 이동 범위를 제한해서 update
  if (spaceshipX <= 0) {
    spaceshipX = 0;
  }
  if (spaceshipX >= canvas.width - 48) {
    spaceshipX = canvas.width - 48;
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
  ctx.fillText(`Score: ${score}`, 20, 20);
  ctx.fillStyle = "white";

  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      ctx.drawImage(bulletImage, bulletList[i].x + 12, bulletList[i].y - 30);
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
    ctx.drawImage(gameOverImage, 300, 200, 100, 100);
  }
}

loadImage();
setupKeyboardListener();
createEnemy();
main();
