import { RotatablePolygon } from "../abstract_classes/elements.js";
import { IContainer } from "../interfaces/drawing.js";
import { AlignRotateDirection } from "../canvas_instruments.js";
import { PolygonHandler } from "../logic_classes/PolygonArray.js";

export class Player extends RotatablePolygon {
  step = 10;

  constructor(x: number, y: number) {
      super(x, y, []);

      this.createForm();
      this.polygonFormCoordinates = PolygonHandler.PolygonDecomp(this.polygonFormCoordinates)[0];
      this.reculcPolygon();
  }

  public Draw(context : CanvasRenderingContext2D) {
    super.Draw(context);

    context.fillStyle = "red";
    PolygonHandler.DrawFilledPolygon(context, this);
  }

  public Update(context: CanvasRenderingContext2D): void {
    this.moveEvent();

    this.Draw(context);
  }
  
  public SetContainer(container : IContainer) {
    super.SetContainer(container);

    const containerSize = container.GetSize();
    
    this.relativeX = (containerSize.width -  this.width)/2;
    this.relativeY = (containerSize.height -  this.height)/2;
  }

  public MoveUp() {
    this.relativeY -= this.step;
  }

  public MoveDown() {
    this.relativeY += this.step;
  }

  public MoveRight() {
    this.relativeX -= this.step;
  }

  public MoveLeft() {
    this.relativeX += this.step;
  }

  public moveEvent : () => void = () => {};

  private createForm() {
    this.transformPolygonCoordinatesFromArray([
      [0,0], 
      [15,70],
      [40,70],
      [40,100],
      [60,100],
      [60,70],
      [85,70],
      [100,0],    
    ]);    
  }
}