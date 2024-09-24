import { Building } from "./items/building";
import { Item } from "./items/item";
import { Tree } from "./items/tree";
import { Graph } from "./math/graph";
import { Polygon } from "./math/polygon";
import { add, distance, lerp, scale } from "./math/utils";
import { Drawable } from "./primatives/drawable";
import { Envelope } from "./primatives/envelope";
import { Point } from "./primatives/point";
import { Segment } from "./primatives/segment";

export class World implements Drawable {
  graph: Graph;

  roadWidth: number;
  roadRoundness: number;

  buildingWidth: number;
  buildingMinLength: number;
  spacing: number;

  envelopes: Envelope[] = [];
  roadBorders: Segment[] = [];
  buildings: Building[] = [];

  trees: Tree[] = [];
  treeSize: number;

  constructor(
    graph: Graph,
    roadWith = 100,
    roadRoundness = 10,
    buildingWidth = 150,
    buildingMinLength = 150,
    spacing = 50,
    treeSize = 160
  ) {
    this.graph = graph;
    this.roadWidth = roadWith;
    this.roadRoundness = roadRoundness;

    this.buildingWidth = buildingWidth;
    this.buildingMinLength = buildingMinLength;
    this.spacing = spacing;

    this.treeSize = treeSize;
  }

  generate() {
    this.envelopes.length = 0;

    for (const segment of this.graph.segments) {
      this.envelopes.push(
        new Envelope(segment, this.roadWidth, this.roadRoundness)
      );
    }

    this.roadBorders = Polygon.union(this.envelopes.map((e) => e.polygon));

    this.buildings = this.generateBuildings();

    this.trees = this.generateTrees();
  }

  private generateBuildings(): Building[] {
    const tmpEvelopes = this.graph.segments.map(
      (s) =>
        new Envelope(
          s,
          this.roadWidth + this.buildingWidth + this.spacing * 2,
          this.roadRoundness
        )
    );

    let guides = Polygon.union(tmpEvelopes.map((e) => e.polygon)).filter(
      (g) => g.length() > this.buildingMinLength
    );

    const supports: Segment[] = [];
    for (const guide of guides) {
      const len = guide.length() + this.spacing;
      const buildingCount = Math.floor(
        len / (this.buildingMinLength + this.spacing)
      );
      const buildingLength = len / buildingCount - this.spacing;

      const direction = guide.direction();
      let q1 = guide.p1;
      let q2 = add(q1, scale(direction, buildingLength));

      supports.push(new Segment(q1, q2));

      for (let i = 2; i <= buildingCount; i++) {
        q1 = add(q2, scale(direction, this.spacing));
        q2 = add(q1, scale(direction, buildingLength));
        supports.push(new Segment(q1, q2));
      }
    }

    const bases = supports.map(
      (s) => new Envelope(s, this.buildingWidth).polygon
    );

    const eps = 0.001;
    for (let i = 0; i < bases.length - 1; i++) {
      for (let j = i + 1; j < bases.length; j++) {
        if (
          bases[i].intersectsPoly(bases[j]) ||
          bases[i].distanceToPoly(bases[j]) < this.spacing - eps
        ) {
          bases.splice(j, 1);
          j--;
        }
      }
    }

    return bases.map((b) => new Building(b));
  }

  private generateTrees(): Tree[] {
    const trees: Tree[] = [];
    // find building that has the least y value
    const points: Point[] = [
      ...this.roadBorders.map((s) => [s.p1, s.p2] as [Point, Point]).flat(),
      ...this.buildings.map((b) => b.base.points).flat(),
    ];

    const padding = 0;

    const top = Math.min(...points.map((p) => p.y)) * (1 - padding);
    const bottom = Math.max(...points.map((p) => p.y)) * (1 + padding);
    const left = Math.min(...points.map((p) => p.x)) * (1 - padding);
    const right = Math.max(...points.map((p) => p.x)) * (1 + padding);

    const tries = 100;
    let tryCount = 0;

    const illegalPolygons = [
      ...this.buildings.map((b) => b.base),
      ...this.envelopes.map((e) => e.polygon),
    ];

    while (tryCount++ < tries) {
      const p = new Point(
        lerp(left, right, Math.random()),
        lerp(top, bottom, Math.random())
      );

      let keep = true;
      for (const poly of illegalPolygons) {
        if (
          poly.containsPoint(p) ||
          poly.distanceToPoint(p) < this.treeSize / 2
        ) {
          keep = false;
          break;
        }
      }

      if (keep) {
        for (const tree of trees) {
          if (distance(tree.center, p) < this.treeSize) {
            keep = false;
            break;
          }
        }
      }

      if (keep) {
        let closeToSomething = false;
        for (const poly of illegalPolygons) {
          if (poly.distanceToPoint(p) < this.treeSize * 3) {
            closeToSomething = true;
            break;
          }
        }
        keep = closeToSomething;
      }

      if (keep) {
        tryCount = 0;
        trees.push(new Tree(p, this.treeSize));
      }
    }

    return trees;
  }

  draw(ctx: CanvasRenderingContext2D, viewpoint: Point) {
    for (const envelope of this.envelopes) {
      envelope.draw(ctx, { fill: "#bbb" });
    }

    for (const segment of this.graph.segments) {
      segment.draw(ctx, { color: "white", width: 4, dash: [10, 10] });
    }

    for (const border of this.roadBorders) {
      border.draw(ctx, { color: "white", width: 4 });
    }

    const items: Item[] = [...this.buildings, ...this.trees];
    items.sort(
      (a, b) =>
        b.base.distanceToPoint(viewpoint) - a.base.distanceToPoint(viewpoint)
    );

    for (const item of items) {
      item.draw(ctx, viewpoint);
    }
  }
}
