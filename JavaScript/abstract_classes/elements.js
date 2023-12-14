export class ViewObject {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.rotation = 0;
        this.width = null;
        this.height = null;
        this.container = null;
    }
    Draw(context) {
        if (!this.width || !this.height)
            return;
    }
    SetContainer(container) {
        this.container = container;
    }
}
export class Container extends ViewObject {
    constructor() {
        super();
        this.elementList = [];
    }
    AddElement(element) {
        this.elementList.push(element);
        element.SetContainer(this);
    }
    Draw(context) {
        this.elementList.forEach((value) => value.Draw(context));
        super.Draw(context);
    }
}
