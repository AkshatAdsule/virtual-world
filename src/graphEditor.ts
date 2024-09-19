import { Graph } from "./math/graph";
import { Point } from "./primatives/point";
import { Segment } from "./primatives/segment";
import { getNearestPoint } from "./math/utils";
import { ViewPort } from "./viewport";

export class GraphEditor {
  graph: Graph;
  canvas: HTMLCanvasElement;
  viewPort: ViewPort;
  ctx: CanvasRenderingContext2D;

  selectedPoint: Point | null = null;
  hoveredPoint: Point | null = null;
  mouse = new Point(0, 0);

  dragging = false;

  private setupEventListeners() {
    this.canvas.onmousedown = this.onMouseDown.bind(this);

    this.canvas.onmouseup = this.onMouseUp.bind(this);

    this.canvas.onmousemove = this.onMouseMove.bind(this);

    // Disable right click context menu
    this.canvas.oncontextmenu = (event) => {
      event.preventDefault();
    };
  }

  constructor(graph: Graph, viewPort: ViewPort) {
    this.viewPort = viewPort;
    this.canvas = viewPort.canvas;
    this.ctx = viewPort.ctx;
    this.graph = graph;

    this.setupEventListeners();
  }

  display() {
    this.graph.draw(this.ctx);
    if (this.selectedPoint) {
      const intent = this.hoveredPoint ? this.hoveredPoint : this.mouse;
      new Segment(this.selectedPoint, intent).draw(this.ctx, { dash: [3, 3] });
      this.selectedPoint.draw(this.ctx, { outline: true });
    }
    if (this.hoveredPoint) {
      this.hoveredPoint.draw(this.ctx, { fill: true });
    }
    if (this.hoveredPoint == this.selectedPoint && this.hoveredPoint) {
      this.hoveredPoint.draw(this.ctx, { outline: true, fill: true });
    }
  }

  dispose() {
    this.graph.dispose();
    this.hoveredPoint = null;
    this.selectedPoint = null;
    this.dragging = false;
  }

  // Mouse event handlers
  private onMouseDown(event: MouseEvent) {
    if (event.button == 2) {
      // right click
      if (this.selectedPoint) {
        this.selectedPoint = null;
      } else if (this.hoveredPoint) {
        this.removePoint();
      }
    } else if (event.button == 0 && !(event.ctrlKey || event.altKey)) {
      if (this.hoveredPoint) {
        this.addSegment(this.hoveredPoint);
        this.selectedPoint = this.hoveredPoint;
        this.dragging = true;
        return;
      }
      this.graph.tryAddPoint(this.mouse);
      this.addSegment(this.mouse);
      this.selectedPoint = this.mouse;
      this.hoveredPoint = this.mouse;
    }
  }

  private onMouseUp() {
    this.dragging = false;
  }

  private onMouseMove(event: MouseEvent) {
    this.mouse = this.viewPort.getMouse(event, true);
    if (this.dragging && this.selectedPoint) {
      this.selectedPoint.x = this.mouse.x;
      this.selectedPoint.y = this.mouse.y;
    }
    this.hoveredPoint = getNearestPoint(
      this.mouse,
      this.graph.points,
      15 * this.viewPort.zoom
    );
  }

  private removePoint() {
    this.graph.removePoint(this.hoveredPoint!);
    if (this.selectedPoint && this.selectedPoint == this.hoveredPoint) {
      this.selectedPoint = null;
    }
    this.hoveredPoint = null;
  }

  private addSegment(point: Point) {
    if (this.selectedPoint) {
      this.graph.tryAddSegment(new Segment(this.selectedPoint, point));
    }
  }
}
