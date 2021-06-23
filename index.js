import Player from "./models/Player.js";
import Projectile from "./models/Projectile.js";
import Enemy from "./models/Enemy.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

console.log(canvas);

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const player = new Player(centerX, centerY, 15, "white");

const projectiles = [];
const enemies = [];

let projectileSize = 3;
let projectileSpeed = 1;
let attackSpeed = 1;
let score = 0;
let scoreSpeedModifier = () => Math.floor(score / 100) * 0.1 + 1;
let ultimateChargeBar = 0;

const shootProjectile = (event) => {
  const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
  const velocity = {
    x: Math.cos(angle) * projectileSpeed,
    y: Math.sin(angle) * projectileSpeed,
  };
  projectiles.push(
    new Projectile(c, centerX, centerY, projectileSize, "gold", velocity)
  );
};

const spawnEnemies = () => {
  setInterval(() => {
    const radius = Math.random() * 26 + 4;
    const speedModifier = Math.random() * 3;
    let x, y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }

    const angle = Math.atan2(centerY - y, centerX - x);
    const velocity = {
      x: Math.cos(angle) * speedModifier * scoreSpeedModifier(),
      y: Math.sin(angle) * speedModifier * scoreSpeedModifier(),
    };
    const hp = Math.floor(Math.random() * 3) + 1;
    enemies.push(new Enemy(c, x, y, radius, velocity, hp));
  }, 1000);
};

const endGame = () => {
  cancelAnimationFrame(animationId);
};

const showPointsAndInfo = () => {
  c.font = "30px Verdana";
  c.fillStyle = "white";
  c.textAlign = "start";
  c.textBaseline = "top";
  c.fillText(`Attack speed: ${projectileSpeed.toFixed(1)}`, 20, 30);
  c.fillText(`Score: ${score}`, 20, 60);
  c.fillText(`ScoreSpeedMultiplier: ${scoreSpeedModifier()}`, 20, 90);
  c.fillText(`Ultimate Shots: ${player.ultimateCharges}`, 20, 120);
  c.fillStyle = "white";
  c.fillRect(20, 155, 5, 25);
  c.fillStyle = "white";
  c.fillRect(225, 155, 5, 25);
  c.fillStyle = "red";
  c.fillRect(30, 165, (200 * ultimateChargeBar) / 10, 5);
};

let animationId;
const animate = () => {
  animationId = requestAnimationFrame(animate);
  c.fillStyle = "rgba(0,0,0,0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  showPointsAndInfo();
  player.draw(c);
  projectiles.forEach((projectile, index) => {
    projectile.update();
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    }
  });
  enemies.forEach((enemy, index) => {
    enemy.update();
    const playerDist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (playerDist - enemy.radius - player.radius < 1) {
      endGame();
    }
    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      if (dist - enemy.radius - projectile.radius < 1) {
        setTimeout(() => {
          onEnemyHit(enemy, index, projectileIndex);
        }, 0);
      }
    });
  });
};

const ultimateProjectileShot = (numberOfProjectiles) => {
  if (player.ultimateCharges > 0) {
    for (let i = 0; i < numberOfProjectiles; i++) {
      const oneTick = 6.28 / numberOfProjectiles;
      const angle = oneTick * (i + 1);
      const velocity = {
        x: Math.cos(angle) * projectileSpeed,
        y: Math.sin(angle) * projectileSpeed,
      };
      projectiles.push(
        new Projectile(c, centerX, centerY, projectileSize, "gold", velocity)
      );
    }
    player.useUltimateCharge();
  }
};

const onEnemyHit = (enemy, enemyIndex, projectileIndex) => {
  projectiles.splice(projectileIndex, 1);
  if (enemy.hp > 1) {
    enemy.loseHp();
  } else {
    enemies.splice(enemyIndex, 1);

    projectileSpeed += 0.1;
    score += 10;
    projectileSize = Math.floor(score / 100) + 3;
    updateUltimateChargeBar();
  }
};

const updateUltimateChargeBar = () => {
  if (ultimateChargeBar < 9) {
    ultimateChargeBar += 1;
  } else {
    player.getUltimateCharge();
    ultimateChargeBar = 0;
  }
};

const BASE_SHOOT_TIMEOUT = 300;
let shootIntervalId;

const handleMouseEvents = (event) => {
  if (event.type === "mousedown") {
    shootProjectile(event);
    shootIntervalId = setInterval(() => {
      shootProjectile(event);
    }, BASE_SHOOT_TIMEOUT / attackSpeed);
  } else {
    clearInterval(shootIntervalId);
  }
};

const handleKeyEvents = (event) => {
  if (event.keyCode === 32) {
    let projectiles = Math.floor(score / 6);
    if (projectiles < 5) {
      projectiles = 5;
    }
    ultimateProjectileShot(projectiles);
  }
};

window.addEventListener("mousedown", handleMouseEvents);
window.addEventListener("mouseup", handleMouseEvents);
window.addEventListener("keypress", handleKeyEvents);
// window.addEventListener("click", shootProjectile);

animate();
spawnEnemies();
