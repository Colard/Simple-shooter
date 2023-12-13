export class Playground {
    constructor() {
    }
    static getInstance() {
        if (!Playground.instance) {
            Playground.instance = new Playground();
        }
        return Playground.instance;
    }
    Create(canvas) {
        console.log("canvas");
        const c = canvas.getContext("2d");
        canvas.width = 1024;
        canvas.height = 576;
        if (c) {
            c.fillStyle = "white";
            c.fillRect(0, 0, canvas.width, canvas.height);
        }
    }
}
