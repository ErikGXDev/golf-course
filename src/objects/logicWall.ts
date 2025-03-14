import { Vec2 } from "kaplay";
import k from "../kaplay";
import { channelColors } from "../constants/channelColors";

export function addLogicWall(pos: Vec2, channel: string) {
  return k.add([
    k.sprite("logic_wall"),
    k.pos(pos),
    k.area(),
    k.body({ isStatic: true }),
    k.shader("chromaKey", () => ({
      u_target_red: k.rgb(channelColors.background[channel]),
      u_target_blue: k.rgb(channelColors.foreground[channel]),
    })),
    k.layer("map"),
    "solid",
    "logic_wall",
    { channel },
  ]);
}
