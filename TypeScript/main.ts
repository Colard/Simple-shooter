import { Player } from "./classes/player.js";
import { Playground } from "./classes/playground.js";
import { Container } from "./abstract_classes/elements.js";
Run();


function Run() {
  const playground = Playground.GetInstance();
  
  const canvas = <HTMLCanvasElement>document.getElementById("playground");

  if(!canvas) return;

  const context = playground.CreateContext(canvas);

  if(!context) return;

  const windowSize = playground.GetSize();

  if(!windowSize) return;
  
  const container = new Container(100, 100, 300, 300);

  const player = new Player(0, 0);

  container.SetBackground("black");

  container.AddElement(player);

  playground.AddElement(container);

  window.addEventListener("mousemove", (event) => {
    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;
    
    let playerCoordniate = player.GetAbsoluteCenter();

    let point = Math.atan2(y-playerCoordniate.y, x-playerCoordniate.x );

    player.SetAngle(point*180/Math.PI);
  });

  playground.Run();
  playground.OnFPSMeter();
};


