export default class Enemy {
  constructor(context, x, y, radius, velocity, hp) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.velocity = velocity;
    this.hp = hp;
  }

  color = () => {
    switch (this.hp) {
      case 1:
        return "#3991a3";
      case 2:
        return "#005771";
      case 3:
        return "#072e92";
      case 4:
        return "#4b0089";
      case 5:
        return "#ff0000";
      case 6:
        return "#ff00fa";
      default:
        return "#2a2a2a";
    }
  };

  draw() {
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.context.fillStyle = this.color();
    this.context.fill();
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.font = `${this.radius}px Verdana`;
    this.context.fillStyle = "white";
    this.context.fillText(this.hp, this.x, this.y);
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  loseHp() {
    this.hp -= 1;
  }
}
