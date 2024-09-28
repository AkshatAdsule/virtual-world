import { Drawable } from "./drawable";

export class Point implements Drawable {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    { size = 18, color = "black", outline = false, fill = false } = {}
  ) {
    const radius = size / 2;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
    ctx.fill();
    if (outline) {
      ctx.beginPath();
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = 2;
      ctx.arc(this.x, this.y, radius * 0.6, 0, 2 * Math.PI);
      ctx.stroke();
    }

    if (fill) {
      ctx.beginPath();
      ctx.fillStyle = "yellow";
      ctx.arc(this.x, this.y, radius * 0.4, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  equals(point: Point): boolean {
    // within a floating point error
    return (
      Math.abs(this.x - point.x) < 1e-6 && Math.abs(this.y - point.y) < 1e-6
    );
  }
}
