export class PolygonHandler {
    static DrawFilledPolygon(context, polygon) {
        context.beginPath();
        const polygonForm = polygon.GetPolygonForm();
        const polygonsPointsLength = polygonForm.length;
        const polygonAbsolutePosition = polygon.GetAbsolutePosition();
        if (polygonsPointsLength < 2)
            return;
        context.moveTo(polygonForm[0].x + polygonAbsolutePosition.x, polygonForm[0].y + polygonAbsolutePosition.y);
        for (let i = 1; i < polygonForm.length; i++) {
            context.lineTo(polygonForm[i].x + polygonAbsolutePosition.x, polygonForm[i].y + polygonAbsolutePosition.y);
        }
        context.closePath();
        context.fill();
    }
}
