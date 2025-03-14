import { Vec2 } from "kaplay";
import k from "../kaplay";

export function addFinish(pos: Vec2) {
  k.add([
    k.sprite("hole"),
    k.pos(pos),
    k.anchor("center"),
    k.layer("map"),
    k.area({ scale: 0.3 }),

    "hole",
  ]);
}
