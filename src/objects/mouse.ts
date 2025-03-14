import k from "../kaplay";
import { worldMousePos } from "../util";

export function addFakeMouse() {
  k.setCursor("none");

  const mouse = k.add([
    k.sprite("cursor"),
    k.pos(0, 0),
    k.layer("ui"),
    k.fakeMouse(),
    "fakeMouse",
  ]);

  mouse.onUpdate(() => {
    mouse.pos = worldMousePos();
  });
}

export function setFakeCursor(mode: "cursor" | "pointer" | "drag") {
  const cursors = k.get("fakeMouse");

  if (cursors.length == 0) return;

  const cursor = cursors[0];

  cursor.sprite = mode;
}
