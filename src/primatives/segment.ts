import { Drawable } from "./drawable";
import { Point } from "./point";

export class Segment implements Drawable {
  p1: Point;
  p2: Point;

  constructor(p1: Point, p2: Point) {
    this.p1 = p1;
    this.p2 = p2;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    {
      width = 2,
      color = "black",
      dash = [],
    }: { width?: number; color?: string; dash?: number[] } = {}
  ) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.setLineDash(dash);
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  equals(segment: Segment): boolean {
    return (
      (this.p1.equals(segment.p1) && this.p2.equals(segment.p2)) ||
      (this.p1.equals(segment.p2) && this.p2.equals(segment.p1))
    );
  }

  includes(point: Point): boolean {
    return this.p1.equals(point) || this.p2.equals(point);
  }
}
