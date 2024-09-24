import { Polygon } from "../math/polygon";
import { getFake3dPoint, lerp, lerp2d, translate } from "../math/utils";
import { Point } from "../primatives/point";
import { Item } from "./item";

export class Tree implements Item {
  center: Point;
  size: number;
  height: number;
  base: Polygon;

  constructor(center: Point, size: number, height = 200) {
    this.center = center;
    this.size = size;
    this.height = height;
    this.base = new Polygon([]);
  }

  draw(ctx: CanvasRenderingContext2D, viewpoint: Point) {
    const top = getFake3dPoint(this.center, viewpoint, this.height);

    const levelCount = 7;
    for (let i = 0; i < levelCount; i++) {
      const t = i / (levelCount - 1);
      const centerPoint = lerp2d(this.center, top, t);
      const color = `rgb(30, ${lerp(50, 200, t)}, 70)`;
      const size = lerp(this.size, 40, t);
      const polygon = this.generateLevel(centerPoint, size);
      if (i == 0) {
        this.base = polygon;
      }
      polygon.draw(ctx, { fill: color, stroke: "rgba(0,0,0,0)" });
    }
  }

  private generateLevel(center: Point, size: number): Polygon {
    const points = [];
    const rad = size / 2;

    for (let a = 0; a < Math.PI * 2; a += Math.PI / 16) {
      const kindOfRandom = Math.cos(((a + this.center.x) * size) % 17) ** 2;
      const noiseRad = rad * lerp(0.5, 1, kindOfRandom);
      points.push(translate(center, a, noiseRad));
    }

    return new Polygon(points);
  }
}
