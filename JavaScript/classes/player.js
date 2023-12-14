import { RotatableObject } from "../abstract_classes/elements.js";
import { AlignRotateDirection } from "../canvas_instruments.js";
export class Player extends RotatableObject {
    constructor(x, y) {
        super(x, y);
        this.width = this.height = 100;
    }
    Draw(context) {
        super.Draw(context);
        context.fillStyle = "red";
        context.fillRect(this.absoluteX, this.absoluteY, this.width, this.height);
        context.fillStyle = "orange";
        context.fillRect(this.absoluteX + this.width / 2, this.absoluteY, 10, 40);
    }
    Update(context) {
        const BindedDraw = this.Draw.bind(this);
        AlignRotateDirection(BindedDraw, this, context);
    }
    SetContainer(container) {
        const containerSize = container.GetSize();
        const containerPosition = container.GetAbsolutePosition();
        this.absoluteX = containerPosition.x + (containerSize.width - this.width) / 2;
        this.absoluteY = containerPosition.y + (containerSize.height - this.height) / 2;
    }
}
