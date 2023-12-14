export class Playground {
    constructor() {
        this.context = null;
        this.elementList = [];
        this.width = null;
        this.height = null;
    }
    static GetInstance() {
        if (!Playground.instance) {
            Playground.instance = new Playground();
        }
        return Playground.instance;
    }
    GetContext() {
        return Playground.GetInstance().context;
    }
    GetWindowSize() {
        const instance = Playground.GetInstance();
        if (!instance.width || !instance.height) {
            return null;
        }
        return {
            width: instance.width,
            height: instance.height
        };
    }
    CreateContext(canvas) {
        const instance = Playground.GetInstance();
        const context = instance.context = canvas.getContext("2d");
        instance.width = canvas.width = 1024;
        instance.height = canvas.height = 576;
        return context;
    }
    AddElement(element) {
        const instance = Playground.GetInstance();
        instance.elementList.push(element);
    }
    Draw(context) {
        const instance = Playground.GetInstance();
        if (!instance.width || !instance.height)
            return null;
        context.fillStyle = "white";
        context.fillRect(0, 0, instance.width, instance.height);
        instance.elementList.forEach((value) => value.Draw(context));
    }
    Run() {
        const instance = Playground.GetInstance();
        const animateFunc = instance.Run;
        if (!instance.context)
            return;
        instance.Draw(instance.context);
        window.requestAnimationFrame(animateFunc);
    }
}
