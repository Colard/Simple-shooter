interface IDraw  {
  Draw(context : CanvasRenderingContext2D) : void;
}

interface IContainer {
  AddElement(element : IDraw) : void;
}