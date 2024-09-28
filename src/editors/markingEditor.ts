import { Marking } from "../markings/marking";
import { getNearestSegment } from "../math/utils";
import { Drawable } from "../primitives/drawable";
import { Point } from "../primitives/point";
import { Segment } from "../primitives/segment";
import { ViewPort } from "../viewport";
import { World } from "../world";

export abstract class MarkingEditor<M extends Marking> implements Drawable {
  viewport: ViewPort;
  world: World;

  private ctx: CanvasRenderingContext2D;

  private mouse: Point | null = null;
  private intent: M | null = null;

  // event listener handles
  private mouseDownHandler: (event: MouseEvent) => void = () => {};
  private mouseMoveHandler: (event: MouseEvent) => void = () => {};

  protected get markings() {
    return this.world.markings;
  }

  protected get graph() {
    return this.world.graph;
  }

  protected abstract get targetSegments(): Segment[];

  abstract createMarking(center: Point, direction: Point): M;

  constructor(viewport: ViewPort, world: World) {
    this.viewport = viewport;
    this.world = world;
    this.ctx = viewport.ctx;
  }

  addEventListeners() {
    this.mouseDownHandler = this.onMouseDown.bind(this);
    this.mouseMoveHandler = this.onMouseMove.bind(this);
    this.viewport.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.viewport.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }

  removeEventListeners() {
    this.viewport.canvas.removeEventListener(
      "mousedown",
      this.mouseDownHandler
    );
    this.viewport.canvas.removeEventListener(
      "mousemove",
      this.mouseMoveHandler
    );
  }

  enable() {
    this.addEventListeners();
  }

  disable() {
    this.removeEventListeners();
  }

  onMouseDown(event: MouseEvent) {
    if (event.button == 0 && this.intent) {
      this.markings.push(this.intent);
    }

    if (event.button == 2) {
      for (let i = 0; i < this.markings.length; ++i) {
        const marking = this.markings[i];
        if (marking.poly.containsPoint(this.mouse!)) {
          this.markings.splice(i, 1);
          break;
        }
      }
    }
  }

  onMouseMove(event: MouseEvent) {
    if (this.world.laneGuides.length == 0) {
      return;
    }
    this.mouse = this.viewport.getMouse(event, true);
    const seg = getNearestSegment(
      this.mouse,
      this.targetSegments,
      10 * this.viewport.zoom
    );

    if (seg) {
      const proj = seg.projectPoint(this.mouse);
      if (proj.offset >= 0 && proj.offset <= 1) {
        this.intent = this.createMarking(proj.point, seg.direction());
      }
    } else {
      this.intent = null;
    }
  }

  draw() {
    if (this.intent) {
      this.intent.draw(this.ctx);
    }
  }
}
