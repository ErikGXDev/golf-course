import { Vec2 } from "kaplay";
import k from "./kaplay";

export function worldMousePos() {
  return k.toWorld(k.mousePos());
}

export function roundVec2(v: Vec2) {
  return k.vec2(Math.round(v.x), Math.round(v.y));
}
