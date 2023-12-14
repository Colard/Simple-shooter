export function AlignRotateDirection(DrawView, obj, context) {
    const size = obj.GetSize();
    const position = obj.GetAbsolutePosition();
    const angle = obj.GetAngle();
    const radianAngle = (angle + 90) * Math.PI / 180;
    context.save();
    context.translate(position.x + size.width / 2, position.y + size.height / 2);
    context.rotate(radianAngle);
    context.translate(-(position.x + size.width / 2), -(position.y + size.height / 2));
    DrawView(context);
    context.rotate(-radianAngle);
    context.restore();
}
