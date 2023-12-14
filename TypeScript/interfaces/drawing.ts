import { ISize, IPosition } from "../interfaces/object_view.js";

export interface IDraw  {
  Draw(context : CanvasRenderingContext2D) : void;
  Update(context : CanvasRenderingContext2D) : void;
  GetSize() : ISize;
  GetAbsolutePosition() : IPosition;
  GetRelativePosition() : IPosition;
  SetContainer(container : IContainer) : void;
}


export interface IRotatable {
  GetAngle() : number;
  SetAngle(angle : number) : void;
}

export interface IContainer extends IDraw{
  AddElement(element : IDraw) : void;
}