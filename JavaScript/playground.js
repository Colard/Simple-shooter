export class Playground {
    constructor() { }
    static getInstance() {
        if (!Playground.instance) {
            Playground.instance = new Playground();
        }
        return Playground.instance;
    }
    Create(canvas) {
        Playground.context = canvas.getContext("2d");
        if (!Playground.context)
            return;
        canvas.width = 1024;
        canvas.height = 576;
        Playground.context.fillStyle = "white";
        Playground.context.fillRect(0, 0, canvas.width, canvas.height);
    }
}
