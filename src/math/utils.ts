import { Point } from "../primatives/point";
import { Segment } from "../primatives/segment";

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

export function angleBetween(p1: Point, p2: Point) {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

export function translate(p: Point, angle: number, offset: number) {
  return new Point(
    p.x + offset * Math.cos(angle),
    p.y + offset * Math.sin(angle)
  );
}

interface Intersection {
  x: number;
  y: number;
  offset: number;
}

export function getIntersection(s1: Segment, s2: Segment): Intersection | null {
  const { p1: a, p2: b } = s1;
  const { p1: c, p2: d } = s2;
  const tTop = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x);
  const uTop = (c.y - a.y) * (a.x - b.x) - (c.x - a.x) * (a.y - b.y);
  const bottom = (d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(a.x, b.x, t),
        y: lerp(a.y, b.y, t),
        offset: t,
      };
    }
  }

  return null;
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function getRandomColor() {
  const hue = 290 + Math.random() * 260;
  return `hsl(${hue}, 100%, 50%)`;
}

export function average(p1: Point, p2: Point) {
  return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
}
