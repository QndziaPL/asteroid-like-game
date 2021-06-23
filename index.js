import Player from "./models/Player.js";
import Projectile from "./models/Projectile.js";
import Enemy from "./models/Enemy.js";
import Particle from "./models/Particle.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreEl = document.querySelector("#score");
const projectileSpeedEl = document.querySelector("#projectile-speed");
const scoreSpeedMultiEl = document.querySelector("#score-speed-multiplier");
const ultimateChargesEl = document.querySelector("#ultimate-charges");
const ultimateBarEl = document.querySelector("#ultimate-bar");
const numericUltimateEl = document.querySelector("#numeric-ultimate");
const startButtonEl = document.querySelector("#start-button");
const gameOverModalEl = document.querySelector("#game-over-modal");
const gameOverScoreEl = document.querySelector("#game-over-score");
const highScoreEl = document.querySelector("#high-score");

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
let player = new Player(centerX, centerY, 15, "#006868");

let projectiles = [];
let enemies = [];
let particles = [];

const maxEnemiesHp = 5;
let projectileSize = 3;
let projectileSpeed = 1;
let attackSpeed = 1;
let score = 0;
let scoreSpeedModifier = 1;
let ultimateChargeBar = 0;

let spawnEnemiesIntervalId;

const init = () => {
  player = new Player(centerX, centerY, 15, "#006868");
  projectiles = [];
  enemies = [];
  particles = [];

  score = 0;
  projectileSize = 3;
  projectileSpeed = 1;
  attackSpeed = 1;
  ultimateChargeBar = 0;
  scoreSpeedModifier = 1;
};

console.log(enemies, "przeciwnicy");

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
  spawnEnemiesIntervalId = setInterval(() => {
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
      x: Math.cos(angle) * speedModifier * scoreSpeedModifier,
      y: Math.sin(angle) * speedModifier * scoreSpeedModifier,
    };
    const hp = Math.floor(Math.random() * maxEnemiesHp) + 1;
    enemies.push(new Enemy(c, x, y, radius, velocity, hp));
  }, 1500);
};

const endGame = () => {
  const highScore = localStorage.getItem("score");
  highScoreEl.style.display = "block";
  if (!highScore || score > highScore) {
    localStorage.setItem("score", score);
    highScoreEl.innerHTML = "New Highscore!";
  } else {
    highScoreEl.innerHTML = `Your highscore: ${highScore}`;
  }

  gameOverScoreEl.innerHTML = `${score} points`;
  clearInterval(spawnEnemiesIntervalId);
  cancelAnimationFrame(animationId);
  gameOverModalEl.style.display = "flex";
};

const createUltimateChargeBar = () => {
  let outputString = "";
  for (let i = 0; i < ultimateChargeBar; i++) {
    outputString += "-";
  }
  return outputString;
};

const showPointsAndInfo = () => {
  scoreEl.innerHTML = score;
  projectileSpeedEl.innerHTML = projectileSpeed.toFixed(1);
  scoreSpeedMultiEl.innerHTML = scoreSpeedModifier;
  ultimateChargesEl.innerHTML = player.ultimateCharges.toString();
  ultimateBarEl.innerHTML = createUltimateChargeBar();
  numericUltimateEl.innerHTML = `${ultimateChargeBar} / 10`;
};

let animationId;
const animate = () => {
  animationId = requestAnimationFrame(animate);
  c.fillStyle = "rgba(0,0,0,0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  showPointsAndInfo();
  player.draw(c);
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });
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
          createParticlesOnHit(projectile.x, projectile.y, enemy.radius);
        }, 0);
      }
    });
  });
};

const ultimateProjectileShot = () => {
  if (player.ultimateCharges > 0) {
    let numberOfProjectiles = Math.floor(score / 6);
    if (numberOfProjectiles < 5) {
      numberOfProjectiles = 5;
    }
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

const createParticlesOnHit = (x, y, enemyRadius) => {
  const colors = [
    "#ffffff",
    "#cbcbcb",
    "#6d6d6d",
    "#474747",
    "#72aaaa",
    "#900000",
    "#307265",
    "#86744a",
    "#007422",
  ];

  for (let i = 0; i < enemyRadius; i++) {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    particles.push(
      new Particle(c, x, y, randomColor, Math.random() * 3, {
        x: (Math.random() - 0.5) * Math.random() * 10,
        y: (Math.random() - 0.5) * Math.random() * 10,
      })
    );
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
    scoreSpeedModifier = Math.floor(score / 100) * 0.1 + 1;
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
    ultimateProjectileShot();
  }
};

window.addEventListener("mousedown", handleMouseEvents);
window.addEventListener("mouseup", handleMouseEvents);
window.addEventListener("keypress", handleKeyEvents);

startButtonEl.addEventListener("click", () => {
  init();
  animate();
  spawnEnemies();
  gameOverModalEl.style.display = "none";
});
