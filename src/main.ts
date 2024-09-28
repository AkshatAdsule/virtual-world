import { GraphEditor } from "./editors/graphEditor";
import { StopEditor } from "./editors/stopEditor";
import { Graph } from "./math/graph";
import { scale } from "./math/utils";
import { Point } from "./primitives/point";
import { Segment } from "./primitives/segment";
import { ViewPort } from "./viewport";
import { World } from "./world";

import "./style.css";
import { CrossingEditor } from "./editors/crossingEditor";
import { MarkingEditor } from "./editors/markingEditor";
import { StartEditor } from "./editors/startEditor";
import { TargetEditor } from "./editors/targetEditor";
import { LightEditor } from "./editors/lightEditor";

type ToolType =
  | "graph"
  | "stop"
  | "crossing"
  | "startStop"
  | "target"
  | "light";

interface Tool {
  button: HTMLButtonElement;
  editor: MarkingEditor<any> | GraphEditor;
}

// Setup canvas
const canvas = document.getElementById("canvas")! as HTMLCanvasElement;
canvas.width = window.innerWidth * 0.975;
canvas.height = window.innerHeight * 0.85;

// Setup buttons
const disposeButton = document.getElementById("dispose")! as HTMLButtonElement;
disposeButton.onclick = () => {
  graphEditor.dispose();
  world.dispose();
};
const saveButton = document.getElementById("save")! as HTMLButtonElement;
saveButton.onclick = () => {
  window.localStorage.setItem("graph", JSON.stringify(graph));
};

const graphButton = document.getElementById("graphBtn")! as HTMLButtonElement;
graphButton.onclick = () => {
  setMode("graph");
};

const stopButton = document.getElementById("stopBtn")! as HTMLButtonElement;
stopButton.onclick = () => {
  setMode("stop");
};

const crossingButton = document.getElementById(
  "crossingBtn"
)! as HTMLButtonElement;
crossingButton.onclick = () => {
  setMode("crossing");
};

const targetBtn = document.getElementById("targetBtn")! as HTMLButtonElement;
targetBtn.onclick = () => {
  setMode("target");
};

const startStopButton = document.getElementById(
  "startBtn"
)! as HTMLButtonElement;
startStopButton.onclick = () => {
  setMode("startStop");
};

const lightButton = document.getElementById("lightBtn")! as HTMLButtonElement;
lightButton.onclick = () => {
  setMode("light");
};

function setMode(mode: ToolType) {
  disableEditors();
  tools.get(mode)!.editor.enable();
  tools.get(mode)!.button.style.backgroundColor = "white";
  tools.get(mode)!.button.style.filter = "";
}

function disableEditors() {
  for (const tool of tools) {
    const { button, editor } = tool[1];
    button.style.backgroundColor = "gray";
    button.style.filter = "grayscale(100%)";
    editor.disable();
  }
}

const ctx = canvas.getContext("2d")!;

const p1 = new Point(200, 200);
const p2 = new Point(500, 200);
const p3 = new Point(400, 400);
const p4 = new Point(100, 300);

const s1 = new Segment(p1, p2);
const s2 = new Segment(p1, p3);
const s3 = new Segment(p1, p4);
const s4 = new Segment(p2, p3);

let graph = new Graph([p1, p2, p3, p4], [s1, s2, s3, s4]);
if (window.localStorage.getItem("graph")) {
  const data = JSON.parse(window.localStorage.getItem("graph")!);
  graph = Graph.fromJSON(data);
}

const viewPort = new ViewPort(canvas);
const world = new World(graph);

const graphEditor = new GraphEditor(graph, viewPort);
const stopEditor = new StopEditor(viewPort, world);
const crossingEditor = new CrossingEditor(viewPort, world);
const startStopEditor = new StartEditor(viewPort, world);
const targetEditor = new TargetEditor(viewPort, world);
const lightEditor = new LightEditor(viewPort, world);

const tools: Map<ToolType, Tool> = new Map([
  ["graph", { button: graphButton, editor: graphEditor }],
  ["stop", { button: stopButton, editor: stopEditor }],
  ["crossing", { button: crossingButton, editor: crossingEditor }],
  ["startStop", { button: startStopButton, editor: startStopEditor }],
  ["target", { button: targetBtn, editor: targetEditor }],
  ["light", { button: lightButton, editor: lightEditor }],
]);

let oldGraphHash = "";
setMode("graph");

// Disable right click context menu
canvas.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

(function animate() {
  viewPort.reset();
  if (oldGraphHash !== graph.hash()) {
    world.generate();
    oldGraphHash = graph.hash();
  }
  const viewPoint = scale(viewPort.getOffset(), -1);
  world.draw(ctx, viewPoint);
  ctx.globalAlpha = 0.3;
  for (const tool of tools) {
    tool[1].editor.draw(ctx);
  }
  requestAnimationFrame(animate);
})();
