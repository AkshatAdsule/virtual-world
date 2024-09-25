import { Marking } from "./marking";

export class Target extends Marking {
  get borders() {
    return [];
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.center.draw(ctx, { color: "red", size: 30 });
    this.center.draw(ctx, { color: "white", size: 20 });
    this.center.draw(ctx, { color: "red", size: 10 });
  }
}
