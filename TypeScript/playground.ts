export class Playground {
  private static instance : Playground;

  private constructor() { 
  }

  public static getInstance(): Playground {
    if (!Playground.instance) {
      Playground.instance = new Playground();
    }

    return Playground.instance;
  }

  public Create(canvas : HTMLCanvasElement){
    const c = canvas.getContext("2d");

    canvas.width = 1024;
    canvas.height = 576;

    if(c) {
      c.fillStyle = "white";
      c.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

}