import { RotatablePolygon } from "./abstract_classes/elements";
import { IPosition } from "./interfaces/object_view";

type ContextedFunction = (c : CanvasRenderingContext2D) => void;

export function AlignRotateDirection(DrawView : ContextedFunction, obj : RotatablePolygon, context : CanvasRenderingContext2D) {
  
  const size = obj.GetSize();
  const position = obj.GetAbsolutePosition();
  const angle = obj.GetAngle();
  const radianAngle = (angle+90)*Math.PI/180;

  context.save();

  context.translate(position.x + size.width / 2, position.y + size.height / 2);
  context.rotate(radianAngle);
  context.translate(-(position.x + size.width / 2), -(position.y + size.height / 2));

  DrawView(context);

  context.rotate(-radianAngle);
  
  context.restore();
}