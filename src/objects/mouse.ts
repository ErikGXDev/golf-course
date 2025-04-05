import { FakeMouseComp, GameObj, LayerComp, PosComp, SpriteComp } from "kaplay";
import k from "../kaplay";
import { worldMousePos } from "../util";

export function addFakeMouse() {
  k.setCursor("none");

  const mouse = k.add([
    k.sprite("cursor"),
    k.pos(0, 0),
    k.layer("ui"),
    k.fakeMouse(),
    k.z(100),
    "cursor",
  ]);

  mouse.onUpdate(() => {
    if (mouse.isPressed) return;

    mouse.pos = worldMousePos();
  });
}

export function setFakeCursor(mode: "cursor" | "pointer" | "drag") {
  const cursor = getFakeMouse();

  if (!cursor) return;

  cursor.sprite = mode;
}

export function getFakeMouse() {
  const cursors = k.get("cursor");

  if (cursors.length == 0) return null;

  return cursors[0] as GameObj<
    SpriteComp | PosComp | LayerComp | FakeMouseComp
  >;
}

export function getFakeMousePos() {
  const cursor = getFakeMouse();

  if (!cursor) return k.vec2(0, 0);

  return cursor.pos;
}
