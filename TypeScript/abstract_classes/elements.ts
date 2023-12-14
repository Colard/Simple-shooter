import { IDraw, IContainer, IRotatable} from "../interfaces/drawing";
import { ISize, IPosition} from "../interfaces/object_view.js";

export abstract class ViewObject implements IDraw {

  protected relativeX : number;

  protected relativeY : number;

  protected absoluteX : number;

  protected absoluteY : number;

  protected width : number;

  protected height : number;

  protected container : IContainer | null = null; 

  constructor (x : number  = 0, y: number  = 0, w: number = 0, h: number = 0) {
    this.absoluteX = this.relativeX = x;
    this.absoluteY = this.relativeY = y;
    this.width = w;
    this.height = h;
  }

  public Update(context : CanvasRenderingContext2D)  {
    this.Draw(context);
   }

  public Draw(context : CanvasRenderingContext2D)  { }


  public SetContainer(container : IContainer) {
    this.container = container;
    const containerPosition = this.container.GetAbsolutePosition();

    this.absoluteX = this.relativeX + containerPosition.x;
    this.absoluteY = this.relativeY + containerPosition.y;
  }

  public GetSize() : ISize {
    return {
      width: this.width,
      height: this.height
    }
  }

  public GetAbsolutePosition() : IPosition {
    return {
      x: this.absoluteX,
      y: this.absoluteY
    }
  }

  public GetAbsoluteCenter() : IPosition {
    return {
      x: this.absoluteX + this.width/2,
      y: this.absoluteY + this.height/2
    }
  }


  public GetRelativePosition() : IPosition {
    return {
      x: this.relativeX,
      y: this.relativeY
    }
  }

}

export class RotatableObject extends ViewObject implements IRotatable{
  protected angle : number = 0;

  GetAngle(): number {
    return this.angle;
  }

  SetAngle(angle : number): void {
    this.angle = angle;
  }
}

export class Container extends ViewObject implements IContainer {
  
  protected elementList : IDraw[] = [];

  protected background : string | null = null;

  constructor (x : number = 0, y: number = 0, w: number = 0, h: number = 0) {
    super(x, y, w, h);
  }

  public AddElement(element : ViewObject) {
    this.elementList.push(element);
    element.SetContainer(this);
  }

  public Update(context: CanvasRenderingContext2D): void { 
    this.Draw(context)
    this.elementList.forEach((value: IDraw) => value.Update(context));
  }

  public Draw(context : CanvasRenderingContext2D) {
    super.Draw(context);

    this.drawBackground(context);
  }

  public SetBackground(color : string) {
    this.background = color;
  }

  private drawBackground(context : CanvasRenderingContext2D) {
    if(!this.background || !this.width || !this.height) return;

    context.fillStyle = this.background;
    context.fillRect(this.absoluteX, this.absoluteY, this.width, this.height);
  }
}