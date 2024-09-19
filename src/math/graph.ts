import { Drawable } from "../primatives/drawable";
import { Point } from "../primatives/point";
import { Segment } from "../primatives/segment";

export class Graph implements Drawable {
  points: Point[];
  segments: Segment[];

  constructor(points: Point[] = [], segments: Segment[] = []) {
    this.points = points;
    this.segments = segments;
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const segment of this.segments) {
      segment.draw(ctx);
    }

    for (const point of this.points) {
      point.draw(ctx);
    }
  }

  tryAddPoint(point: Point): boolean {
    if (this.containsPoint(point)) return false;
    this.points.push(point);
    return true;
  }

  removePoint(point: Point) {
    this.segments = this.segments.filter((s) => !s.includes(point));
    this.points = this.points.filter((p) => p !== point);
  }

  containsPoint(point: Point) {
    return this.points.some((p) => p.equals(point));
  }

  containsSegment(segment: Segment) {
    return this.segments.some((s) => s.equals(segment));
  }

  tryAddSegment(segment: Segment): boolean {
    if (this.containsSegment(segment)) return false;
    if (segment.p1.equals(segment.p2)) return false;
    this.segments.push(segment);
    return true;
  }

  removeSegment(segment: Segment) {
    this.points = this.points.filter((p) => !segment.includes(p));
    this.segments = this.segments.filter((s) => s !== segment);
  }

  getSegmentsWithPoint(point: Point): Segment[] {
    return this.segments.filter((s) => s.includes(point));
  }

  dispose() {
    this.points = [];
    this.segments = [];
  }
}
