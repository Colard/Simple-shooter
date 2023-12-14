export class ViewObject {
    constructor(x = 0, y = 0, w = 0, h = 0) {
        this.container = null;
        this.absoluteX = this.relativeX = x;
        this.absoluteY = this.relativeY = y;
        this.width = w;
        this.height = h;
    }
    Update(context) {
        this.Draw(context);
    }
    Draw(context) { }
    SetContainer(container) {
        this.container = container;
        const containerPosition = this.container.GetAbsolutePosition();
        this.absoluteX = this.relativeX + containerPosition.x;
        this.absoluteY = this.relativeY + containerPosition.y;
    }
    GetSize() {
        return {
            width: this.width,
            height: this.height
        };
    }
    GetAbsolutePosition() {
        return {
            x: this.absoluteX,
            y: this.absoluteY
        };
    }
    GetAbsoluteCenter() {
        return {
            x: this.absoluteX + this.width / 2,
            y: this.absoluteY + this.height / 2
        };
    }
    GetRelativePosition() {
        return {
            x: this.relativeX,
            y: this.relativeY
        };
    }
}
export class RotatableObject extends ViewObject {
    constructor() {
        super(...arguments);
        this.angle = 0;
    }
    GetAngle() {
        return this.angle;
    }
    SetAngle(angle) {
        this.angle = angle;
    }
}
export class Container extends ViewObject {
    constructor(x = 0, y = 0, w = 0, h = 0) {
        super(x, y, w, h);
        this.elementList = [];
        this.background = null;
    }
    AddElement(element) {
        this.elementList.push(element);
        element.SetContainer(this);
    }
    Update(context) {
        this.Draw(context);
        this.elementList.forEach((value) => value.Update(context));
    }
    Draw(context) {
        super.Draw(context);
        this.drawBackground(context);
    }
    SetBackground(color) {
        this.background = color;
    }
    drawBackground(context) {
        if (!this.background || !this.width || !this.height)
            return;
        context.fillStyle = this.background;
        context.fillRect(this.absoluteX, this.absoluteY, this.width, this.height);
    }
}
