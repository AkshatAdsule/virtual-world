import { Graph } from "./math/graph";
import { Point } from "./primatives/point";
import { Segment } from "./primatives/segment";
import "./style.css";

// Setup canvas
const canvas = document.getElementById("canvas")! as HTMLCanvasElement;
canvas.width = 600;
canvas.height = 600;

// Setup buttons
const addRandPointButton = document.getElementById("addRandPoint")!;

addRandPointButton.onclick = () => {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const p = new Point(x, y);
  graph.tryAddPoint(p);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  graph.draw(ctx);
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

const graph = new Graph([p1, p2, p3, p4], [s1, s2, s3, s4]);
graph.draw(ctx);
