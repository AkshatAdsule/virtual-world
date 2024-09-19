import { GraphEditor } from "./graphEditor";
import { Graph } from "./math/graph";
import { Point } from "./primatives/point";
import { Segment } from "./primatives/segment";
import "./style.css";
import { ViewPort } from "./viewport";

// Setup canvas
const canvas = document.getElementById("canvas")! as HTMLCanvasElement;
canvas.width = 600;
canvas.height = 600;

// Setup buttons
const disposeButton = document.getElementById("dispose")! as HTMLButtonElement;
disposeButton.onclick = () => {
  graphEditor.dispose();
};
const saveButton = document.getElementById("save")! as HTMLButtonElement;
saveButton.onclick = () => {
  window.localStorage.setItem("graph", JSON.stringify(graph));
};

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

graph.draw(ctx);

const viewPort = new ViewPort(canvas);
const graphEditor = new GraphEditor(graph, viewPort);

(function animate() {
  viewPort.reset();
  graphEditor.display();
  requestAnimationFrame(animate);
})();
