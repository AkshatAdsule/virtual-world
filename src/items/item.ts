import { Polygon } from "../math/polygon";
import { Drawable } from "../primatives/drawable";
import { Point } from "../primatives/point";

export interface Item extends Drawable {
  get base(): Polygon;
  draw(ctx: CanvasRenderingContext2D, viewpoint: Point): void;
}
