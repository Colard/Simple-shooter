export class Playground {
    constructor() {
        this.frames = 0;
        this.isFPSMeterOn = false;
        this.fps = 0;
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
    GetSize() {
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
    }
    Update(context) {
        const instance = Playground.GetInstance();
        this.Draw(context);
        instance.elementList.forEach((value) => value.Update(context));
        if (!this.isFPSMeterOn)
            return;
        context.fillStyle = "black";
        context.font = "bold 20px Arial";
        context.fillText(instance.fps + " FPS", 10, 20);
    }
    Run() {
        const instance = Playground.GetInstance();
        const animateFunc = instance.Run;
        if (instance.isFPSMeterOn)
            instance.frames++;
        if (!instance.context)
            return;
        instance.Update(instance.context);
        window.requestAnimationFrame(animateFunc);
    }
    OnFPSMeter() {
        const instance = Playground.GetInstance();
        const context = Playground.GetInstance().context;
        instance.isFPSMeterOn = true;
        const fps = 0;
        setInterval(() => {
            instance.fps = instance.frames;
            instance.frames = 0;
        }, 1000);
    }
}
