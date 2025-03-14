import { Vec2 } from "kaplay";
import k from "../kaplay";

export function addCollision(pos: Vec2, size: Vec2) {
  return k.add([
    k.rect(size.x, size.y),
    k.opacity(0),
    k.pos(pos),
    k.area(),
    k.body({ isStatic: true }),
    "solid",
  ]);
}

type SlopeDirection = "TopLeft" | "TopRight" | "BotLeft" | "BotRight";

export function addSlopeCollision(pos: Vec2, direction: SlopeDirection) {
  const slope = k.add([
    k.pos(pos),
    k.polygon([k.vec2(-32, -32), k.vec2(32, 32), k.vec2(-32, 32)]),
    k.area(),
    k.opacity(0),
    k.body({ isStatic: true }),
    k.rotate(0),
    "slope",
    "solid",
  ]);

  switch (direction) {
    case "BotLeft":
      slope.angle = 0;
      break;
    case "TopLeft":
      slope.angle = 90;
      break;
    case "TopRight":
      slope.angle = 180;
      break;
    case "BotRight":
      slope.angle = 270;
      break;
  }
}
