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

export type point = { x: number; y: number };

export function distance(p1: Point, p2: Point) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

export function average(p1: Point, p2: Point) {
  return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
}

export function dot(p1: Point, p2: Point) {
  return p1.x * p2.x + p1.y * p2.y;
}

export function add(p1: Point, p2: Point | point) {
  return new Point(p1.x + p2.x, p1.y + p2.y);
}

export function subtract(p1: Point, p2: Point) {
  return new Point(p1.x - p2.x, p1.y - p2.y);
}

export function scale(p: Point, scaler: number) {
  return new Point(p.x * scaler, p.y * scaler);
}

export function normalize(p: Point) {
  return scale(p, 1 / magnitude(p));
}

export function magnitude(p: Point) {
  return Math.hypot(p.x, p.y);
}

export function translate(loc: Point, angle: number, offset: number) {
  return new Point(
    loc.x + Math.cos(angle) * offset,
    loc.y + Math.sin(angle) * offset
  );
}

export function angle(p: Point) {
  return Math.atan2(p.y, p.x);
}

export function getIntersection(s1: Segment, p2: Segment) {
  const { p1: a, p2: b } = s1;
  const { p1: c, p2: d } = p2;

  const tTop = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x);
  const uTop = (c.y - a.y) * (a.x - b.x) - (c.x - a.x) * (a.y - b.y);
  const bottom = (d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y);

  const eps = 0.001;
  if (Math.abs(bottom) > eps) {
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

export function lerp2d(a: Point, b: Point, t: number) {
  return new Point(lerp(a.x, b.x, t), lerp(a.y, b.y, t));
}

export function getRandomColor() {
  const hue = 290 + Math.random() * 260;
  return "hsl(" + hue + ", 100%, 60%)";
}

export function getFake3dPoint(point: Point, viewPoint: Point, height: number) {
  const dir = normalize(subtract(point, viewPoint));
  const dist = distance(point, viewPoint);
  const scaler = Math.atan(dist / 300) / (Math.PI / 2);
  return add(point, scale(dir, height * scaler));
}
