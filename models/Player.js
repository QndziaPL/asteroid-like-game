export default class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.critChance = 0.0;
    this.bonuses = {
      shield: 0,
    };
  }

  ultimateCharges = 1;

  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();
  }

  useUltimateCharge() {
    this.ultimateCharges -= 1;
  }

  getUltimateCharge() {
    this.ultimateCharges += 1;
  }

  increaseCriticalChance() {
    if (this.critChance < 1) {
      this.critChance += 0.04;
    }
  }

  getShield() {
    this.bonuses.shield += 1;
  }

  resetCriticalChance() {
    this.critChance = 0;
  }

  halveCriticalChance() {
    const c = this.critChance;
    if (c >= 0.9) {
      this.critChance = 0.5;
    } else if (c >= 0.8) {
      this.critChance = 0.4;
    } else if (c >= 0.7) {
      this.critChance = 0.35;
    } else if (c >= 0.6) {
      this.critChance = 0.3;
    } else if (c >= 0.5) {
      this.critChance = 0.25;
    } else if (c >= 0.4) {
      this.critChance = 0.2;
    } else if (c >= 0.3) {
      this.critChance = 0.15;
    } else if (c >= 0.2) {
      this.critChance = 0.1;
    } else {
      this.critChance = 0.0;
    }
  }
}
