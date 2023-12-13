import { Playground } from "./playground.js";

const playground = Playground.getInstance();
let canvas = <HTMLCanvasElement>document.getElementById("playground");

if(canvas) {
  playground.Create(canvas);
}
