import { Marking } from "./marking";
import { Crossing } from "./crossing";
import { Light } from "./light";
import { Start } from "./start";
import { Stop } from "./stop";
import { Target } from "./target";

export function decodeMarking(data: any): Marking {
  const { type, ...rest } = data;
  switch (type) {
    case "Crossing":
      return new Crossing(rest.center, rest.direction, rest.width, rest.height);
    case "Start":
      return new Start(rest.center, rest.direction, rest.width, rest.height);
    case "Stop":
      return new Stop(rest.center, rest.direction, rest.width, rest.height);
    case "Light":
      return new Light(rest.center, rest.direction, rest.width, rest.height);
    case "Target":
      return new Target(rest.center, rest.direction, rest.width, rest.height);
    default:
      throw new Error(`Unknown marking type: ${type}`);
  }
}
