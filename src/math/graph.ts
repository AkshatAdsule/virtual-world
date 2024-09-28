import { Drawable } from "../primitives/drawable";
import { Point } from "../primitives/point";
import { Segment } from "../primitives/segment";

export class Graph implements Drawable {
  points: Point[];
  segments: Segment[];

  static fromJSON(json: unknown): Graph {
    const { points: pointsData, segments: segmentsData } = json as Graph;

    const points = pointsData.map((p) => new Point(p.x, p.y));
    const segments = segmentsData.map(
      (s) =>
        new Segment(
          points.find((p) => p.equals(s.p1))!,
          points.find((p) => p.equals(s.p2))!
        )
    );

    return new Graph(points, segments);
  }

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

  hash(): string {
    return JSON.stringify(this);
  }

  dispose() {
    this.points = [];
    this.segments = [];
  }
}
