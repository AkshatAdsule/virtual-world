import { Drawable } from "../primatives/drawable";
import { Point } from "../primatives/point";
import { Segment } from "../primatives/segment";
import { average, getIntersection } from "./utils";

export class Polygon implements Drawable {
  distanceToPoly(poly: Polygon) {
    return Math.min(...this.points.map((p) => poly.distanceToPoint(p)));
  }
  points: Point[];
  segments: Segment[];

  static union(polygons: Polygon[]) {
    Polygon.multibreak(polygons);

    const keptSegments = [];
    for (let i = 0; i < polygons.length; i++) {
      for (const segment of polygons[i].segments) {
        let keep = true;
        for (let j = 0; j < polygons.length; j++) {
          if (i === j) continue;

          if (polygons[j].containsSegment(segment)) {
            keep = false;
            break;
          }
        }

        if (keep) {
          keptSegments.push(segment);
        }
      }
    }
    return keptSegments;
  }

  static multibreak(polygons: Polygon[]) {
    for (let i = 0; i < polygons.length; i++) {
      for (let j = i + 1; j < polygons.length; j++) {
        Polygon.break(polygons[i], polygons[j]);
      }
    }
  }

  static break(polygon1: Polygon, polygon2: Polygon) {
    const segments1 = polygon1.segments;
    const segments2 = polygon2.segments;

    const intersections = [];
    for (let i = 0; i < segments1.length; i++) {
      for (let j = 0; j < segments2.length; j++) {
        const s1 = segments1[i];
        const s2 = segments2[j];
        const intersection = getIntersection(s1, s2);
        if (
          intersection &&
          intersection.offset != 1 &&
          intersection.offset != 0
        ) {
          const point = new Point(intersection.x, intersection.y);
          intersections.push(point);
          let aux = s1.p2;
          s1.p2 = point;
          segments1.splice(i + 1, 0, new Segment(point, aux));

          aux = s2.p2;
          s2.p2 = point;
          segments2.splice(j + 1, 0, new Segment(point, aux));
        }
      }
    }
  }

  constructor(points: Point[]) {
    this.points = points;

    this.segments = [];
    for (let i = 0; i < points.length; i++) {
      this.segments.push(
        new Segment(points[i], points[(i + 1) % points.length])
      );
    }
  }

  containsSegment(segment: Segment): boolean {
    const midpoint = average(segment.p1, segment.p2);
    return this.containsPoint(midpoint);
  }

  containsPoint(point: Point): boolean {
    const outerPoint = new Point(-1000, -1000);
    let intersections = 0;

    for (const segment of this.segments) {
      const intersection = getIntersection(
        segment,
        new Segment(point, outerPoint)
      );
      if (intersection) {
        intersections++;
      }
    }

    return intersections % 2 === 1;
  }

  intersectsPoly(polygon: Polygon): boolean {
    for (const s1 of this.segments) {
      for (const s2 of polygon.segments) {
        if (getIntersection(s1, s2)) {
          return true;
        }
      }
    }
    return false;
  }

  distanceToPoint(point: Point): number {
    return Math.min(...this.segments.map((s) => s.distanceToPoint(point)));
  }

  draw(
    ctx: CanvasRenderingContext2D,
    {
      stroke = "blue",
      lineWidth = 2,
      fill = "rgba(0,0,255, 0.3)",
      join = "miter",
    }: {
      stroke?: string;
      lineWidth?: number;
      fill?: string;
      join?: CanvasLineJoin;
    } = {}
  ) {
    ctx.beginPath();
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = join;
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}
