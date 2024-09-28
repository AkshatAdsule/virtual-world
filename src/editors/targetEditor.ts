import { Target } from "../markings/target";
import { Point } from "../primitives/point";
import { MarkingEditor } from "./markingEditor";

export class TargetEditor extends MarkingEditor<Target> {
  get targetSegments() {
    return this.world.laneGuides;
  }

  createMarking(center: Point, direction: Point): Target {
    return new Target(
      center,
      direction,
      this.world.roadWidth / 2,
      this.world.roadWidth / 2
    );
  }
}
