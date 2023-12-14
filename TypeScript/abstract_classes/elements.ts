export abstract class ViewObject implements IDraw {

  protected x : number = 0;

  protected y : number = 0;

  protected rotation : number = 0;

  protected width : number | null = null;

  protected height : number | null = null;

  protected container : IContainer | null = null; 

  public Draw(context : CanvasRenderingContext2D)  {
    if(!this.width || !this.height) return;
  }

  public SetContainer(container : IContainer) {
    this.container = container;
  }
}

export abstract class Container extends ViewObject implements IContainer {
  
  protected elementList : IDraw[] = [];

  constructor () {
    super();
  }

  public AddElement(element : ViewObject) {
    this.elementList.push(element);
    element.SetContainer(this);
  }

  public Draw(context : CanvasRenderingContext2D) {
    this.elementList.forEach((value: IDraw) => value.Draw(context));

    super.Draw(context);
  }
}