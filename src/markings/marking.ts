import { Polygon } from "../math/polygon";
import { angle, translate } from "../math/utils";
import { Drawable } from "../primitives/drawable";
import { Envelope } from "../primitives/envelope";
import { Point } from "../primitives/point";
import { Segment } from "../primitives/segment";

export abstract class Marking implements Drawable {
  center: Point;
  direction: any;
  width: number;
  height: number;

  abstract get borders(): Segment[];

  support: Segment;
  poly: Polygon;

  constructor(center: Point, direction: any, width: number, height: number) {
    this.center = center;
    this.direction = direction;
    this.width = width;
    this.height = height;

    this.support = new Segment(
      translate(center, angle(direction), height / 2),
      translate(center, angle(direction), -height / 2)
    );

    this.poly = new Envelope(this.support, width, 0).polygon;
  }

  draw(ctx: CanvasRenderingContext2D) {
    console.warn("draw not implemented");
    this.poly.draw(ctx);
  }
}
