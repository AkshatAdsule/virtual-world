import { Stop } from "../markings/stop";
import { Point } from "../primitives/point";

import { MarkingEditor } from "./markingEditor";

export class StopEditor extends MarkingEditor<Stop> {
  protected get targetSegments() {
    return this.world.laneGuides;
  }

  createMarking(center: Point, direction: Point) {
    return new Stop(
      center,
      direction,
      this.world.roadWidth / 2,
      this.world.roadWidth / 2
    );
  }
}
