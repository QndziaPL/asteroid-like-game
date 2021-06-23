export default class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
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
}
