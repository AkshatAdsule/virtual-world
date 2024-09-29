import { Graph } from "../math/graph";
import {
  add,
  distance,
  dot,
  magnitude,
  normalize,
  scale,
  subtract,
} from "../math/utils";
import { Drawable } from "./drawable";
import { Point } from "./point";

export class Segment implements Drawable {
  p1: Point;
  p2: Point;

  constructor(p1: Point, p2: Point) {
    this.p1 = p1;
    this.p2 = p2;
  }

  static decode(data: any, graph?: Graph): Segment {
    if (graph) {
      return new Segment(
        graph.getPointById(data.p1)!,
        graph.getPointById(data.p2)!
      );
    }
    return new Segment(
      new Point(data.p1.x, data.p1.y),
      new Point(data.p2.x, data.p2.y)
    );
  }

  get serialized(): object {
    return {
      p1: this.p1.id,
      p2: this.p2.id,
    };
  }

  draw(
    ctx: CanvasRenderingContext2D,
    {
      width = 2,
      color = "black",
      dash = [],
      cap = "butt",
    }: {
      width?: number;
      color?: string;
      dash?: number[];
      cap?: CanvasLineCap;
    } = {}
  ) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.lineCap = cap;
    ctx.setLineDash(dash);
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  distanceToPoint(point: Point) {
    const proj = this.projectPoint(point);
    if (proj.offset > 0 && proj.offset < 1) {
      return distance(point, proj.point);
    }
    const distToP1 = distance(point, this.p1);
    const distToP2 = distance(point, this.p2);
    return Math.min(distToP1, distToP2);
  }

  projectPoint(point: Point) {
    const a = subtract(point, this.p1);
    const b = subtract(this.p2, this.p1);
    const normB = normalize(b);
    const scaler = dot(a, normB);
    const proj = {
      point: add(this.p1, scale(normB, scaler)),
      offset: scaler / magnitude(b),
    };
    return proj;
  }

  equals(segment: Segment): boolean {
    return (
      (this.p1.equals(segment.p1) && this.p2.equals(segment.p2)) ||
      (this.p1.equals(segment.p2) && this.p2.equals(segment.p1))
    );
  }

  length(): number {
    return Math.hypot(this.p1.x - this.p2.x, this.p1.y - this.p2.y);
  }

  includes(point: Point): boolean {
    return this.p1.equals(point) || this.p2.equals(point);
  }

  direction(): Point {
    return normalize(subtract(this.p2, this.p1));
  }
}
