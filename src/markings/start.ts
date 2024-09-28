import { angle } from "../math/utils";
import { Point } from "../primitives/point";
import { Segment } from "../primitives/segment";
import { Marking } from "./marking";

export class Start extends Marking {
  static image = new Image();
  static {
    this.image.src = import.meta.env.BASE_URL + "/car.png";
  }

  constructor(center: Point, direction: Point, width: number, length: number) {
    super(center, direction, width, length);
  }

  get borders(): Segment[] {
    return [];
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.center.x, this.center.y);
    ctx.rotate(angle(this.direction) - Math.PI / 2);

    ctx.drawImage(Start.image, -Start.image.width / 2, -Start.image.height / 2);

    ctx.restore();
  }
}
