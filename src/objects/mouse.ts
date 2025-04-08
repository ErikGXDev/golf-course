import { FakeMouseComp, GameObj, LayerComp, PosComp, SpriteComp } from "kaplay";
import k from "../kaplay";

export function addFakeMouse() {
  k.setCursor("none");

  const mouse = k.add([
    k.sprite("cursor"),
    k.pos(0, 0),
    k.layer("ui"),
    k.fakeMouse({ followMouse: false }),
    k.z(100),
    "cursor",
  ]);

  mouse.onUpdate(() => {
    mouse.pos = k
      .getCamPos()
      .sub(k.width() / 2, k.height() / 2)
      .add(k.mousePos());
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
