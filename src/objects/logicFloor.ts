import { Vec2 } from "kaplay";
import { channelColors } from "../constants/channelColors";
import k from "../kaplay";

export function addLogicFloor(pos: Vec2, channel: string) {
  return k.add([
    k.sprite("logic_floor"),
    k.pos(pos),
    k.shader("chromaKey", () => ({
      u_target_red: k.rgb(channelColors.background[channel]),
      u_target_blue: k.rgb(channelColors.foreground[channel]),
    })),
    k.layer("map"),
    "solid",
    "logic_floor",
    { channel },
  ]);
}
