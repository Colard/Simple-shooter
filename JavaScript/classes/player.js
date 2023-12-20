import { RotatablePolygon } from "../abstract_classes/elements.js";
import { PolygonHandler } from "../logic_classes/PolygonArray.js";
export class Player extends RotatablePolygon {
    constructor(x, y) {
        super(x, y, []);
        this.step = 10;
        this.moveEvent = () => { };
        this.createForm();
        this.reculcPolygon();
    }
    Draw(context) {
        super.Draw(context);
        context.fillStyle = "red";
        PolygonHandler.DrawFilledPolygon(context, this);
    }
    Update(context) {
        this.moveEvent();
        this.Draw(context);
    }
    SetContainer(container) {
        super.SetContainer(container);
        const containerSize = container.GetSize();
        this.relativeX = (containerSize.width - this.width) / 2;
        this.relativeY = (containerSize.height - this.height) / 2;
    }
    MoveUp() {
        this.relativeY -= this.step;
    }
    MoveDown() {
        this.relativeY += this.step;
    }
    MoveRight() {
        this.relativeX -= this.step;
    }
    MoveLeft() {
        this.relativeX += this.step;
    }
    createForm() {
        this.transformPolygonCoordinatesFromArray([
            [0, 0],
            [15, 70],
            [40, 70],
            [40, 100],
            [60, 100],
            [60, 70],
            [85, 70],
            [100, 0],
        ]);
    }
}
