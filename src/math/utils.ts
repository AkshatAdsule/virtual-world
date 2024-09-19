import { Point } from "../primatives/point";

export function getNearestPoint(
  point: Point,
  points: Point[],
  treshold = Number.MAX_SAFE_INTEGER
): Point | null {
  let minDist = Number.MAX_SAFE_INTEGER;
  let nearestPoint = null;

  for (const p of points) {
    const dist = Math.hypot(p.x - point.x, p.y - point.y);
    if (dist < minDist && dist < treshold) {
      minDist = dist;
      nearestPoint = p;
    }
  }

  return nearestPoint!;
}

export function distance(p1: Point, p2: Point) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

export function add(p1: Point, p2: Point) {
  return new Point(p1.x + p2.x, p1.y + p2.y);
}

export function subtract(p1: Point, p2: Point) {
  return new Point(p1.x - p2.x, p1.y - p2.y);
}

export function scale(p: Point, factor: number) {
  return new Point(p.x * factor, p.y * factor);
}
