import { MarkingEditor } from "../editors/markingEditor";
import { Start } from "../markings/start";
import { Point } from "../primitives/point";

export class StartEditor extends MarkingEditor<Start> {
  get targetSegments() {
    return this.world.laneGuides;
  }

  createMarking(center: Point, direction: Point): Start {
    return new Start(
      center,
      direction,
      this.world.roadWidth / 2,
      this.world.roadWidth / 2
    );
  }
}
