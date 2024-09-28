import { Light } from "../markings/light";
import { Point } from "../primitives/point";
import { MarkingEditor } from "./markingEditor";

export class LightEditor extends MarkingEditor<Light> {
  get targetSegments() {
    return this.world.laneGuides;
  }

  createMarking(center: Point, direction: Point): Light {
    return new Light(
      center,
      direction,
      this.world.roadWidth / 2,
      this.world.roadWidth / 2
    );
  }
}
