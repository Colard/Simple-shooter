import { IDraw, IContainer } from "../interfaces/drawing";
import { ISize, IPosition } from "../interfaces/object_view.js";

type Context = CanvasRenderingContext2D | null;

export class Playground {
  private frames : number = 0;
  private isFPSMeterOn = false;
  private fps = 0;

  private static instance : Playground;

  private context : CanvasRenderingContext2D | null = null;

  private elementList : IDraw[] = [];

  private width : number | null = null;

  private height : number | null = null;

  private constructor() {}

  public static GetInstance(): Playground {
    if (!Playground.instance) {
      Playground.instance = new Playground();
    }

    return Playground.instance;
  }

  public GetContext() : Context{
    return Playground.GetInstance().context;
  }

  public GetSize() : ISize | null {
    const instance = Playground.GetInstance();

    if(!instance.width || !instance.height) {
      return null;
    }

    return {
      width: instance.width,
      height: instance.height
    }
  }

  public CreateContext(canvas : HTMLCanvasElement) : Context {
    const instance = Playground.GetInstance();
    const context = instance.context = canvas.getContext("2d");
    
    instance.width = canvas.width = 1024;
    instance.height = canvas.height = 576;

    return context;
  }

  public AddElement(element : IDraw) {
    const instance = Playground.GetInstance();
    instance.elementList.push(element);
  }

  private Draw(context : CanvasRenderingContext2D) {
    const instance = Playground.GetInstance();

    if(!instance.width || !instance.height) return null;
    
    context.fillStyle = "white";
    context.fillRect(0, 0, instance.width, instance.height);
  }

  private Update(context : CanvasRenderingContext2D) {
    const instance = Playground.GetInstance();
    this.Draw(context);
    instance.elementList.forEach((value: IDraw) => value.Update(context));

    if(!this.isFPSMeterOn) return;

    context.fillStyle = "black";
    context.font = "bold 20px Arial";
    context.fillText(instance.fps + " FPS", 10, 20);
  }

  public Run() {
    const instance = Playground.GetInstance();
    const animateFunc = instance.Run;

    if(instance.isFPSMeterOn) instance.frames++;

    if(!instance.context) return;

    instance.Update(instance.context);
    window.requestAnimationFrame(animateFunc);
  }

  public OnFPSMeter() {
    const instance = Playground.GetInstance();
    const context = Playground.GetInstance().context;
    instance.isFPSMeterOn = true;
    const fps = 0;

    setInterval(() => {
      instance.fps = instance.frames;
      instance.frames = 0;
    }, 1000)

  }
}