import { Playground } from "./playground.js";
const playground = Playground.getInstance();
let canvas = document.getElementById("playground");
if (canvas) {
    playground.Create(canvas);
}
