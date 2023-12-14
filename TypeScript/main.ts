import { Player } from "./classes/player.js";
import { Playground } from "./classes/playground.js";

Run();


function Run() {
  const playground = Playground.GetInstance();
  
  const canvas = <HTMLCanvasElement>document.getElementById("playground");

  if(!canvas) return;

  const context = playground.CreateContext(canvas);

  if(!context) return;

  const windowSize = playground.GetWindowSize();

  if(!windowSize) return;

  const player = new Player(windowSize);
  playground.AddElement(player);

  playground.Run();
};

