import { Player } from "./classes/player.js";
import { Playground } from "./classes/playground.js";
import { Container } from "./abstract_classes/elements.js";
Run();
function Run() {
    const playground = Playground.GetInstance();
    const canvas = document.getElementById("playground");
    if (!canvas)
        return;
    const context = playground.CreateContext(canvas);
    if (!context)
        return;
    const windowSize = playground.GetSize();
    if (!windowSize)
        return;
    const container = new Container(100, 100, 300, 300);
    const player = new Player(0, 0);
    container.SetBackground("black");
    container.AddElement(player);
    playground.AddElement(container);
    let curs_x = 0;
    let curs_y = 0;
    window.addEventListener("mousemove", (event) => {
        curs_x = event.clientX - canvas.offsetLeft;
        curs_y = event.clientY - canvas.offsetTop;
    });
    setInterval(() => {
        let playerCoordniate = player.GetAbsoluteCenter();
        let point = Math.atan2(curs_y - playerCoordniate.y, curs_x - playerCoordniate.x);
        player.SetAngle(point * 180 / Math.PI);
    }, 10);
    let keysPressed = {};
    window.addEventListener('keydown', (event) => {
        keysPressed[event.code] = true;
    }, false);
    window.addEventListener('keyup', (event) => {
        keysPressed[event.code] = false;
    }, false);
    function handleKeys() {
        if (keysPressed["KeyW"]) {
            player.MoveUp();
        }
        if (keysPressed["KeyS"]) {
            player.MoveDown();
        }
        if (keysPressed["KeyD"]) {
            player.MoveLeft();
        }
        if (keysPressed["KeyA"]) {
            player.MoveRight();
        }
    }
    player.moveEvent = handleKeys;
    playground.Run();
    playground.OnFPSMeter();
}
;
