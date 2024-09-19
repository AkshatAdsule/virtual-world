import { add, subtract, scale } from "./math/utils";
import { Point } from "./primatives/point";

export class ViewPort {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  zoom = 1;
  center: Point;
  offset: Point;

  drag = {
    start: new Point(0, 0),
    end: new Point(0, 0),
    offset: new Point(0, 0),
    active: false,
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.center = new Point(canvas.width / 2, canvas.height / 2);
    this.offset = scale(this.center, -1);

    this.setUpEventListeners();
  }

  private setUpEventListeners() {
    // this.canvas.onwheel = this.handleWheel.bind(this);
    this.canvas.addEventListener("wheel", this.handleWheel.bind(this));
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
  }

  private handleWheel(event: WheelEvent) {
    const direction = Math.sign(event.deltaY);
    const step = 0.1;
    this.zoom += direction * step;
    this.zoom = Math.max(1, Math.min(5, this.zoom));
  }

  private handleMouseDown(event: MouseEvent) {
    if (
      event.button == 1 ||
      (event.button == 0 && (event.ctrlKey || event.altKey))
    ) {
      // middle click
      this.drag.active = true;
      this.drag.start = this.getMouse(event);
    }
  }

  private handleMouseUp() {
    if (this.drag.active) {
      this.offset = add(this.offset, this.drag.offset);

      this.drag = {
        start: new Point(0, 0),
        end: new Point(0, 0),
        offset: new Point(0, 0),
        active: false,
      };
    }
  }

  private handleMouseMove(event: MouseEvent) {
    if (this.drag.active) {
      this.drag.end = this.getMouse(event);
      this.drag.offset = subtract(this.drag.end, this.drag.start);
    }
  }

  getMouse(event: MouseEvent, subtractDragOffset = false): Point {
    const p =  new Point(
      (event.offsetX - this.center.x) * this.zoom - this.offset.x,
      (event.offsetY - this.center.y) * this.zoom - this.offset.y
    );

    return subtractDragOffset ? subtract(p, this.drag.offset) : p;
  }

  apply() {
    this.ctx.translate(this.center.x, this.center.y);
    this.ctx.scale(1 / this.zoom, 1 / this.zoom);
    const viewPortOffset = add(this.offset, this.drag.offset);
    this.ctx.translate(viewPortOffset.x, viewPortOffset.y);
  }

  reset() {
    this.ctx.restore();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.apply();
  }
}
