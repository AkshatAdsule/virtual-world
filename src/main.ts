import { GraphEditor } from "./editors/graphEditor";
import { StopEditor } from "./editors/stopEditor";
import { Graph } from "./math/graph";
import { scale } from "./math/utils";
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
  window.localStorage.setItem("world", JSON.stringify(world.serialized));
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

let world = new World(new Graph());
if (window.localStorage.getItem("world")) {
  world = World.decode(JSON.parse(window.localStorage.getItem("world")!));
}
const graph = world.graph;

const ctx = canvas.getContext("2d")!;

const viewPort = new ViewPort(canvas);

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
