import { ViewObject } from "../abstract_classes/elements.js";
export class Player extends ViewObject {
    constructor(playgroundSize) {
        super();
        this.width = this.height = 100;
        this.x = (playgroundSize.width - this.width) / 2;
        this.y = (playgroundSize.height - this.height) / 2;
    }
    Draw(context) {
        context.fillStyle = "red";
        if (!this.width || !this.height)
            return;
        context.fillRect(this.x, this.y, this.width, this.height);
        this.y += 3;
        super.Draw(context);
    }
}
