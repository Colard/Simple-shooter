export class ViewObject {
    constructor(x = 0, y = 0, w = 0, h = 0) {
        this.container = null;
        this.relativeX = x;
        this.relativeY = y;
        this.width = w;
        this.height = h;
    }
    Update(context) {
        this.Draw(context);
    }
    Draw(context) { }
    SetContainer(container) {
        this.container = container;
    }
    GetSize() {
        return {
            width: this.width,
            height: this.height
        };
    }
    GetAbsolutePosition() {
        let container = this.container;
        if (!container) {
            return {
                x: this.relativeX,
                y: this.relativeY
            };
        }
        const containerPosition = container.GetAbsolutePosition();
        return {
            x: this.relativeX + containerPosition.x,
            y: this.relativeY + containerPosition.y
        };
    }
    GetAbsoluteCenter() {
        let absolute = this.GetAbsolutePosition();
        return {
            x: absolute.x + this.width / 2,
            y: absolute.y + this.height / 2
        };
    }
    GetRelativeCenter() {
        return {
            x: this.width / 2,
            y: this.height / 2
        };
    }
    GetRelativePosition() {
        return {
            x: this.relativeX,
            y: this.relativeY
        };
    }
}
export class PolygonObject extends ViewObject {
    constructor(x = 0, y = 0, polygonFormCoordinates) {
        super(x, y);
        this.polygonFormCoordinates = [];
        this.transformPolygonCoordinatesFromArray(polygonFormCoordinates);
        this.polygonCoordinates = [];
        this.reculcPolygon();
    }
    reculcPolygon() {
        const pointCount = this.polygonFormCoordinates.length;
        let maxX = -Infinity;
        let maxY = -Infinity;
        if (pointCount < 1)
            return;
        this.polygonCoordinates = [];
        for (let i = 0; i < pointCount; i++) {
            maxX = (maxX < this.polygonFormCoordinates[i].x) ? this.polygonFormCoordinates[i].x : maxX;
            maxY = (maxY < this.polygonFormCoordinates[i].y) ? this.polygonFormCoordinates[i].y : maxY;
            this.polygonCoordinates[i] = {
                x: this.relativeX + this.polygonFormCoordinates[i].x,
                y: this.relativeY + this.polygonFormCoordinates[i].y
            };
        }
        this.width = maxX - this.relativeX;
        this.height = maxY - this.relativeY;
    }
    GetPolygonForm() {
        return this.polygonFormCoordinates;
    }
    GetAbsolutePolygonForm() {
        let absolutePosition = this.GetAbsolutePosition();
        return this.polygonFormCoordinates.map((el) => {
            let absoluteX = absolutePosition.x + el.x;
            let absoluteY = absolutePosition.y + el.y;
            return {
                x: absoluteX,
                y: absoluteY
            };
        });
    }
    GetPolygonAbsoluteCoordinates() {
        return this.polygonFormCoordinates;
    }
    transformPolygonCoordinatesFromArray(arr) {
        this.polygonFormCoordinates = arr.map((value) => {
            return { x: value[0], y: value[1] };
        });
        this.normilizePolygonForm();
    }
    normilizePolygonForm() {
        let polygonForm = this.polygonFormCoordinates;
        if (polygonForm.length == 0)
            return;
        const height = Math.max(...polygonForm.map(el => el.y));
        this.polygonFormCoordinates = polygonForm.map(el => {
            return {
                x: el.x,
                y: height - el.y
            };
        });
    }
}
export class RotatablePolygon extends PolygonObject {
    constructor(x = 0, y = 0, polygonFormCoordinates) {
        super(x, y, polygonFormCoordinates);
        this.angle = 0;
        this.polygonRotatedFormCoordinates = this.polygonFormCoordinates.slice(0);
    }
    GetAngle() {
        return this.angle;
    }
    SetAngle(angle) {
        this.angle = angle;
        this.rotatePolygon();
    }
    GetPolygonForm() {
        return this.polygonRotatedFormCoordinates;
    }
    GetAbsolutePolygonForm() {
        let absolutePosition = this.GetAbsolutePosition();
        return this.polygonRotatedFormCoordinates.map((el) => {
            let absoluteX = absolutePosition.x + el.x;
            let absoluteY = absolutePosition.y + el.y;
            return {
                x: absoluteX,
                y: absoluteY
            };
        });
    }
    Draw(context) {
        super.Draw(context);
    }
    rotatePolygon() {
        const angleInRadians = ((this.angle + 90) * Math.PI) / 180;
        const polygonCenter = this.GetRelativeCenter();
        const rotatedPolygon = this.polygonFormCoordinates.map(point => {
            const x = polygonCenter.x + (point.x - polygonCenter.x) * Math.cos(angleInRadians) - (point.y - polygonCenter.y) * Math.sin(angleInRadians);
            const y = polygonCenter.y + (point.x - polygonCenter.x) * Math.sin(angleInRadians) + (point.y - polygonCenter.y) * Math.cos(angleInRadians);
            return { x: x, y: y };
        });
        this.polygonRotatedFormCoordinates = rotatedPolygon;
        return rotatedPolygon;
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
    ConverToPoligon() {
        return new PolygonObject(this.relativeX, this.relativeY, [
            [0, 0],
            [0, this.height],
            [this.width, this.height],
            [this.width, 0],
        ]);
    }
    drawBackground(context) {
        if (!this.background || !this.width || !this.height)
            return;
        context.fillStyle = this.background;
        let position = this.GetAbsolutePosition();
        context.fillRect(position.x, position.y, this.width, this.height);
    }
}
