import { Building } from "./items/building";
import { Item } from "./items/item";
import { Tree } from "./items/tree";
import { decodeMarking } from "./markings/helper";
import { Light } from "./markings/light";
import { Marking } from "./markings/marking";
import { Graph } from "./math/graph";
import { Polygon } from "./math/polygon";
import { add, distance, getNearestPoint, lerp, scale } from "./math/utils";
import { Drawable } from "./primitives/drawable";
import { Envelope } from "./primitives/envelope";
import { Point } from "./primitives/point";
import { Segment } from "./primitives/segment";

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

  laneGuides: Segment[] = [];

  markings: Marking[] = [];

  frameCount = 0;

  constructor(
    graph: Graph,
    roadWith = 100,
    roadRoundness = 10,
    buildingWidth = 150,
    buildingMinLength = 150,
    spacing = 50,
    treeSize = 160,
    generate = true
  ) {
    this.graph = graph;
    this.roadWidth = roadWith;
    this.roadRoundness = roadRoundness;

    this.buildingWidth = buildingWidth;
    this.buildingMinLength = buildingMinLength;
    this.spacing = spacing;

    this.treeSize = treeSize;

    if (generate) {
      this.generate();
    }
  }

  static decode(data: any): World {
    const graph = Graph.decode(data.graph);
    const world = new World(graph, 0, 0, 0, 0, 0, 0, false);

    // primitives
    world.roadWidth = data.roadWidth;
    world.roadRoundness = data.roadRoundness;

    world.buildingWidth = data.buildingWidth;
    world.buildingMinLength = data.buildingMinLength;
    world.spacing = data.spacing;

    // items
    world.envelopes = data.envelopes.map((e: any) => Envelope.decode(e, graph));
    world.roadBorders = data.roadBorders.map((s: any) => Segment.decode(s));
    world.buildings = data.buildings.map((b: any) => Building.decode(b));

    world.trees = data.trees.map((t: any) => Tree.decode(t));
    world.treeSize = data.treeSize;

    world.laneGuides = data.laneGuides.map((s: any) => Segment.decode(s));

    world.markings = data.markings.map((m: any) => decodeMarking(m));

    return world;
  }

  get serialized(): object {
    this.markings.map((m) => m.serialized);
    return {
      graph: this.graph,

      // primitives
      roadWidth: this.roadWidth,
      roadRoundness: this.roadRoundness,

      buildingWidth: this.buildingWidth,
      buildingMinLength: this.buildingMinLength,
      spacing: this.spacing,

      envelopes: this.envelopes.map((e) => e.serialized),
      roadBorders: this.roadBorders.map((s) => s.serialized),
      buildings: this.buildings.map((b) => b.serialized),

      trees: this.trees.map((t) => t.serialized),
      treeSize: this.treeSize,

      laneGuides: this.laneGuides.map((s) => s.serialized),

      markings: this.markings.map((m) => m.serialized),
    };
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

    this.laneGuides.length = 0;
    this.laneGuides.push(...this.generateLaneGuides());
  }

  private generateBuildings(): Building[] {
    const tmpEnvelopes = this.graph.segments.map(
      (s) =>
        new Envelope(
          s,
          this.roadWidth + this.buildingWidth + this.spacing * 2,
          this.roadRoundness
        )
    );

    const guides = Polygon.union(tmpEnvelopes.map((e) => e.polygon)).filter(
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

  private generateLaneGuides(): Segment[] {
    const tmpEnvelopes = this.graph.segments.map(
      (s) => new Envelope(s, this.roadWidth / 2, this.roadRoundness)
    );

    const segments = Polygon.union(tmpEnvelopes.map((env) => env.polygon));

    return segments;
  }

  private getIntersections() {
    const subset = [];
    for (const point of this.graph.points) {
      let degree = 0;
      for (const seg of this.graph.segments) {
        if (seg.includes(point)) {
          degree++;
        }
      }

      if (degree > 2) {
        subset.push(point);
      }
    }
    return subset;
  }

  private updateLights() {
    const lights = this.markings.filter((m) => m instanceof Light);
    const controlCenters: ControlCenter[] = [];
    for (const light of lights) {
      const point = getNearestPoint(light.center, this.getIntersections())!;
      let controlCenter = controlCenters.find((c) => c.equals(point));
      if (!controlCenter) {
        controlCenter = new ControlCenter(point.x, point.y);
        controlCenter.lights = [light];
        controlCenters.push(controlCenter);
      } else {
        controlCenter.lights.push(light);
      }
    }
    const greenDuration = 2,
      yellowDuration = 1;
    for (const center of controlCenters) {
      center.ticks = center.lights.length * (greenDuration + yellowDuration);
    }
    const tick = Math.floor(this.frameCount / 60);
    for (const center of controlCenters) {
      const cTick = tick % center.ticks;
      const greenYellowIndex = Math.floor(
        cTick / (greenDuration + yellowDuration)
      );
      const greenYellowState =
        cTick % (greenDuration + yellowDuration) < greenDuration
          ? "green"
          : "yellow";
      for (let i = 0; i < center.lights.length; i++) {
        if (i == greenYellowIndex) {
          center.lights[i].state = greenYellowState;
        } else {
          center.lights[i].state = "red";
        }
      }
    }
    this.frameCount++;
  }

  dispose() {
    this.envelopes.length = 0;
    this.roadBorders.length = 0;
    this.buildings.length = 0;
    this.trees.length = 0;
    this.laneGuides.length = 0;
    this.markings.length = 0;
  }

  draw(ctx: CanvasRenderingContext2D, viewpoint: Point) {
    this.updateLights();

    for (const envelope of this.envelopes) {
      envelope.draw(ctx, { fill: "#bbb" });
    }

    for (const segment of this.graph.segments) {
      segment.draw(ctx, { color: "white", width: 4, dash: [10, 10] });
    }

    for (const border of this.roadBorders) {
      border.draw(ctx, { color: "white", width: 4 });
    }

    for (const marking of this.markings) {
      marking.draw(ctx);
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

class ControlCenter extends Point {
  lights: Light[] = [];
  ticks: number = 0;
}
