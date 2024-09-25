import { Marking } from "./marking";
import { angle } from "../math/utils";

export class Stop extends Marking {
  get borders() {
    return [this.poly.segments[2]];
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.borders[0].draw(ctx, { width: 5, color: "white" });
    ctx.save();
    ctx.translate(this.center.x, this.center.y);
    ctx.rotate(angle(this.direction) - Math.PI / 2);
    ctx.scale(1, 3);

    ctx.beginPath();
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = "bold " + this.height * 0.3 + "px Arial";
    ctx.fillText("STOP", 0, 1);

    ctx.restore();
  }
}
