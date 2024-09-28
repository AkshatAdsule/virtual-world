import { Polygon } from "../math/polygon";
import { Drawable } from "../primitives/drawable";
import { Point } from "../primitives/point";

export interface Item extends Drawable {
  get base(): Polygon;
  draw(ctx: CanvasRenderingContext2D, viewpoint: Point): void;
}
