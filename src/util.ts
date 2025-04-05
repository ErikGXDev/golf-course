import { Vec2 } from "kaplay";
import k from "./kaplay";

export function worldMousePos() {
  return k.toWorld(k.mousePos());
}

export function roundVec2(v: Vec2) {
  return k.vec2(Math.round(v.x), Math.round(v.y));
}

export function getFirst(id: string) {
  return k.get(id)?.[0];
}

const picture = new k.Picture();
export type Picture = typeof picture;

export function safeEndPicture() {
  let cLog = console.log;
  console.log = () => {
    // do nothing
  };
  const picture = kEndPicture();
  console.log = cLog;
  return picture;
}

const kEndPicture = k.endPicture;

k.endPicture = safeEndPicture;
