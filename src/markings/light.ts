import { perpendicular, add, scale, lerp2d } from "../math/utils";
import { Segment } from "../primitives/segment";
import { Marking } from "./marking";

export class Light extends Marking {
  state: "green" | "yellow" | "red" | "off" = "off";
  height = 18;

  get borders() {
    return [this.poly.segments[0]];
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const perp = perpendicular(this.direction);
    const line = new Segment(
      add(this.center, scale(perp, this.width / 2)),
      add(this.center, scale(perp, -this.width / 2))
    );

    const green = lerp2d(line.p1, line.p2, 0.2);
    const yellow = lerp2d(line.p1, line.p2, 0.5);
    const red = lerp2d(line.p1, line.p2, 0.8);

    new Segment(red, green).draw(ctx, {
      width: this.height,
      cap: "round",
    });

    green.draw(ctx, { size: this.height * 0.6, color: "#060" });
    yellow.draw(ctx, { size: this.height * 0.6, color: "#660" });
    red.draw(ctx, { size: this.height * 0.6, color: "#600" });

    switch (this.state) {
      case "green":
        green.draw(ctx, { size: this.height * 0.6, color: "#0F0" });
        break;
      case "yellow":
        yellow.draw(ctx, { size: this.height * 0.6, color: "#FF0" });
        break;
      case "red":
        red.draw(ctx, { size: this.height * 0.6, color: "#F00" });
        break;
    }
  }
}
