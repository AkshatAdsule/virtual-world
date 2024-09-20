import { Graph } from "./math/graph";
import { Polygon } from "./math/polygon";
import { Drawable } from "./primatives/drawable";
import { Envelope } from "./primatives/envelope";
import { Segment } from "./primatives/segment";

export class World implements Drawable {
  graph: Graph;

  roadWidth: number;
  roadRoundness: number;

  private envelopes: Envelope[] = [];
  private roadBorders: Segment[] = [];

  constructor(graph: Graph, roadWith = 100, roadRoundness = 10) {
    this.graph = graph;
    this.roadWidth = roadWith;
    this.roadRoundness = roadRoundness;
  }
  generate() {
    this.envelopes.length = 0;

    for (const segment of this.graph.segments) {
      this.envelopes.push(
        new Envelope(segment, this.roadWidth, this.roadRoundness)
      );
    }

    // Polygon.break(this.envelopes[0].polygon, this.envelopes[1].polygon);
    this.roadBorders = Polygon.union(this.envelopes.map((e) => e.polygon));
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const envelope of this.envelopes) {
      envelope.draw(ctx, { fill: "#bbb" });
    }

    for (const segment of this.graph.segments) {
      segment.draw(ctx, { color: "white", width: 4, dash: [10, 10] });
    }

    for (const border of this.roadBorders) {
      border.draw(ctx, { color: "white", width: 4 });
    }
  }
}
