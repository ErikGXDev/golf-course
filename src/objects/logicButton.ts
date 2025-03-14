import { Vec2 } from "kaplay";
import k from "../kaplay";
import { channelColors } from "../constants/channelColors";
import { addLogicWall } from "./logicWall";

export function addLogicButton(pos: Vec2, channel: string) {
  const button = k.add([
    k.sprite("logic_button"),
    k.pos(pos),
    k.anchor("center"),
    k.area(),
    k.layer("map"),
    k.shader("chromaKey", () => ({
      u_target_red: k.rgb(channelColors.background[channel]),
      u_target_blue: k.rgb(channelColors.foreground[channel]),
    })),
    "logic_button",
    { channel, pressed: false },
  ]);

  button.onCollide("golfball", () => {
    if (button.pressed) return;
    button.pressed = true;
    button.sprite = "logic_button_pressed";

    k.play("switch_activated", {
      volume: 0.2,
    });

    k.shake(1);

    k.get("logic_wall").forEach((wall) => {
      if (wall.channel == button.channel) {
        wall.destroy();
      }
    });

    k.get("logic_floor").forEach((floor) => {
      if (floor.channel == button.channel) {
        addLogicWall(floor.pos, floor.channel);
        floor.destroy();
      }
    });
  });
}
