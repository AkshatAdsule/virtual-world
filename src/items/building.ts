import { Polygon } from "../math/polygon";
import { average, getFake3dPoint } from "../math/utils";
import { Point } from "../primitives/point";
import { Item } from "./item";

export class Building implements Item {
  base: Polygon;
  height: number;

  constructor(base: Polygon, height = 200) {
    this.base = base;
    this.height = height;
  }

  draw(ctx: CanvasRenderingContext2D, viewpoint: Point) {
    const topPoints = this.base.points.map((p) =>
      getFake3dPoint(p, viewpoint, this.height * 0.6)
    );

    const ceiling = new Polygon(topPoints);

    const sides = [];
    for (let i = 0; i < this.base.points.length; i++) {
      const nextI = (i + 1) % this.base.points.length;
      const poly = new Polygon([
        this.base.points[i],
        this.base.points[nextI],
        topPoints[nextI],
        topPoints[i],
      ]);
      sides.push(poly);
    }

    sides.sort(
      (a, b) => b.distanceToPoint(viewpoint) - a.distanceToPoint(viewpoint)
    );

    const baseMidpoints = [
      average(this.base.points[0], this.base.points[1]),
      average(this.base.points[2], this.base.points[3]),
    ];

    const topMidpoints = baseMidpoints.map((p) =>
      getFake3dPoint(p, viewpoint, this.height)
    );

    const roofPolys = [
      new Polygon([
        ceiling.points[0],
        ceiling.points[3],
        topMidpoints[1],
        topMidpoints[0],
      ]),
      new Polygon([
        ceiling.points[2],
        ceiling.points[1],
        topMidpoints[0],
        topMidpoints[1],
      ]),
    ];
    roofPolys.sort(
      (a, b) => b.distanceToPoint(viewpoint) - a.distanceToPoint(viewpoint)
    );

    this.base.draw(ctx, {
      fill: "white",
      stroke: "#aaa",
    });

    for (const side of sides) {
      side.draw(ctx, {
        fill: "white",
        stroke: "#aaa",
      });
    }

    ceiling.draw(ctx, {
      fill: "white",
      stroke: "#aaa",
    });

    for (const poly of roofPolys) {
      poly.draw(ctx, {
        fill: "#D44",
        stroke: "#C44",
        lineWidth: 8,
        join: "round",
      });
    }
  }
}
