import { add, scale, perpendicular } from "../math/utils";
import { Segment } from "../primitives/segment";
import { Marking } from "./marking";

export class Crossing extends Marking {
  get borders() {
    return [this.poly.segments[2], this.poly.segments[0]];
  }

  draw(ctx: CanvasRenderingContext2D) {
    const perp = perpendicular(this.direction);
    const line = new Segment(
      add(this.center, scale(perp, this.width / 2)),
      add(this.center, scale(perp, -this.width / 2))
    );

    line.draw(ctx, { width: this.height, color: "white", dash: [11, 11] });
  }
}
