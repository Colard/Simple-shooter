import { ISize } from "../interfaces/object_view.js";
import { Container } from "../abstract_classes/elements.js";

type Context = CanvasRenderingContext2D | null;

export class Playground implements IContainer {
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

  public GetWindowSize() : ISize | null{
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

    instance.elementList.forEach((value: IDraw) => value.Draw(context));
  }

  public Run() {
    const instance = Playground.GetInstance();
    const animateFunc = instance.Run;

    if(!instance.context) return;

    instance.Draw(instance.context);
    window.requestAnimationFrame(animateFunc);
  }
}