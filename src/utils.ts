import { Point } from "./primatives/point";

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
