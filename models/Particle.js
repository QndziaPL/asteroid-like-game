const friction = 0.99;
export default class Particle {
  constructor(context, x, y, color, radius, velocity) {
    this.color = color;
    this.context = context;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.velocity = velocity;
    this.alpha = 1;
  }

  draw() {
    this.context.save();
    this.context.globalAlpha = this.alpha;
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.context.fillStyle = this.color;
    this.context.fill();
    this.context.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01;
  }

  loseHp() {
    this.hp -= 1;
  }
}
