import { IDraw, IContainer, IRotatable} from "../interfaces/drawing";
import { ISize, IPosition} from "../interfaces/object_view.js";

export abstract class ViewObject implements IDraw {

  protected relativeX : number;

  protected relativeY : number;

  protected width : number;

  protected height : number;

  protected container : IContainer | null = null; 

  constructor (x : number  = 0, y: number  = 0, w: number = 0, h: number = 0) {
    this.relativeX = x;
    this.relativeY = y;
    this.width = w;
    this.height = h;
  }

  public Update(context : CanvasRenderingContext2D)  {
    this.Draw(context);
   }

  public Draw(context : CanvasRenderingContext2D)  { }


  public SetContainer(container : IContainer) {
    this.container = container;
  }

  public GetSize() : ISize {
    return {
      width: this.width,
      height: this.height
    }
  }

  public GetAbsolutePosition() : IPosition {
    let container = this.container;
    
    if(!container) {
      return {
        x: this.relativeX, 
        y: this.relativeY
      }
    } 
    
    const containerPosition = container.GetAbsolutePosition();

    return {
      x: this.relativeX + containerPosition.x,
      y: this.relativeY + containerPosition.y
    }
  }

  public GetAbsoluteCenter() : IPosition {
    let absolute = this.GetAbsolutePosition();
    return {
      x: absolute.x + this.width/2,
      y: absolute.y + this.height/2
    }
  }

  public GetRelativeCenter() : IPosition {
    return {
      x: this.width/2,
      y: this.height/2
    }
  }

  public GetRelativePosition() : IPosition {
    return {
      x: this.relativeX,
      y: this.relativeY
    }
  }

}

export class PolygonObject extends ViewObject {
  protected polygonFormCoordinates : IPosition[];
  protected polygonCoordinates : IPosition[];

  constructor(x : number = 0, y : number = 0, polygonFormCoordinates : [number, number][]) {
    super(x, y);

    this.polygonFormCoordinates = [];
    this.transformPolygonCoordinatesFromArray(polygonFormCoordinates);

    this.polygonCoordinates = [];

    this.reculcPolygon();
  }

  protected reculcPolygon() {
    const pointCount = this.polygonFormCoordinates.length;
    let maxX = -Infinity;
    let maxY = -Infinity;

    if(pointCount < 1)  return; 
    
    this.polygonCoordinates = [];

    for(let i = 0; i < pointCount; i++) {
      maxX = (maxX < this.polygonFormCoordinates[i].x) ? this.polygonFormCoordinates[i].x : maxX;
      maxY = (maxY < this.polygonFormCoordinates[i].y) ? this.polygonFormCoordinates[i].y : maxY;

      this.polygonCoordinates[i] = {
        x: this.relativeX + this.polygonFormCoordinates[i].x,
        y: this.relativeY + this.polygonFormCoordinates[i].y
      } 
    }
    
    this.width = maxX - this.relativeX;
    this.height = maxY - this.relativeY;
  }

  public GetPolygonForm() {
    return this.polygonFormCoordinates;
  }

  protected transformPolygonCoordinatesFromArray(arr : [number, number][]) {
    this.polygonFormCoordinates = arr.map((value) => {
      return {x: value[0], y: value[1] } as IPosition
    })

    this.normilizePolygonForm();
  }

  protected normilizePolygonForm() {
    let polygonForm = this.polygonFormCoordinates;

    if(polygonForm.length == 0) return;

    const height = Math.max(...polygonForm.map(el => el.y));
    
    this.polygonFormCoordinates = polygonForm.map(el => {
      return {
        x: el.x, 
        y: height - el.y
      } as IPosition});
  }
}

export class RotatablePolygon extends PolygonObject implements IRotatable{
  protected angle : number = 0;
  protected polygonRotatedFormCoordinates : IPosition[];

  constructor(x : number = 0, y : number = 0, polygonFormCoordinates : [number, number][]) {
    super(x, y, polygonFormCoordinates);
    this.polygonRotatedFormCoordinates = this.polygonFormCoordinates.slice(0);
  }

  public GetAngle(): number {
    return this.angle;
  }

  public SetAngle(angle : number): void {
    this.angle = angle;
    this.rotatePolygon();
  }

  public GetPolygonForm() {
    return this.polygonRotatedFormCoordinates;
  }

  public Draw(context: CanvasRenderingContext2D): void {
    super.Draw(context);
  }
  
  protected rotatePolygon() : IPosition[] {
    const angleInRadians = ((this.angle+90) * Math.PI) / 180;
    const polygonCenter = this.GetRelativeCenter();

    const rotatedPolygon = this.polygonFormCoordinates.map(point => {
        const x = polygonCenter.x + (point.x - polygonCenter.x) * Math.cos(angleInRadians) - (point.y - polygonCenter.y) * Math.sin(angleInRadians);
        const y = polygonCenter.y + (point.x - polygonCenter.x) * Math.sin(angleInRadians) + (point.y - polygonCenter.y) * Math.cos(angleInRadians);
        return {x: x, y: y} as IPosition;
    });

    this.polygonRotatedFormCoordinates = rotatedPolygon;
    
    return rotatedPolygon;
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

    let position = this.GetAbsolutePosition();
    context.fillRect(position.x, position.y, this.width, this.height);
  }
}