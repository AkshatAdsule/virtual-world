import { Crossing } from "../markings/crossing";
import { Point } from "../primatives/point";

import { MarkingEditor } from "./markingEditor";

export class CrossingEditor extends MarkingEditor<Crossing> {
  protected get targetSegments() {
    return this.graph.segments;
  }

  createMarking(center: Point, direction: Point) {
    return new Crossing(
      center,
      direction,
      this.world.roadWidth,
      this.world.roadWidth / 2,
    );
  }
}
