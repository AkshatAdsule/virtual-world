import { Graph } from "../math/graph";
import { Polygon } from "../math/polygon";
import { angle, subtract, translate } from "../math/utils";
import { Drawable } from "./drawable";
import { Segment } from "./segment";

export class Envelope implements Drawable {
  skeleton: Segment;
  width: number;
  roundness: number;

  polygon: Polygon;

  constructor(skeleton: Segment, width: number, roundness = 1) {
    this.skeleton = skeleton;
    this.width = width;
    this.roundness = roundness;
    this.polygon = this.generatePolygon(width);
  }

  static decode(data: any, graph: Graph): Envelope {
    const { skeleton, width, roundness } = data;
    return new Envelope(Segment.decode(skeleton, graph), width, roundness);
  }

  get serialized(): object {
    return {
      skeleton: this.skeleton.serialized,
      width: this.width,
      roundness: this.roundness,
    };
  }

  draw(ctx: CanvasRenderingContext2D, { fill = "rgba(0,0,255,0.2)" } = {}) {
    this.polygon.draw(ctx, { fill, stroke: fill });
  }

  private generatePolygon(width: number) {
    const { p1, p2 } = this.skeleton;

    const radius = width / 2;
    const alpha = angle(subtract(p1, p2));
    const alpha_cw = alpha + Math.PI / 2;
    const alpha_ccw = alpha - Math.PI / 2;

    const points = [];
    let step = Math.PI / Math.max(1, this.roundness);
    const eps = step / 2;
    for (let i = alpha_ccw; i <= alpha_cw + eps; i += step) {
      points.push(translate(p1, i, radius));
    }
    for (let i = alpha_ccw; i <= alpha_cw + eps; i += step) {
      points.push(translate(p2, Math.PI + i, radius));
    }

    return new Polygon(points);
  }
}
