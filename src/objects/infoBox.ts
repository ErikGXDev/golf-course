import { Vec2 } from "kaplay";
import k from "../kaplay";

export function addInfoBox(pos: Vec2, text: string) {
  const colors = k.choose([
    ["#4e187c", "#7d2da0"],
    ["#6d80fa", "#6997db"],
    ["#2e7d32", "#4caf50"],
    ["#004d40", "#00796b"],
    ["#ff6f00", "#ff9800"],
  ]);

  const lightColor = colors[1];
  const darkColor = colors[0];

  const rect = k.add([
    k.rect(350, 80, {
      radius: 8,
    }),
    k.color(k.rgb(lightColor)),
    k.outline(8, k.rgb(darkColor)),
    k.pos(pos),
    k.scale(0),
    k.anchor("bot"),
    k.layer("ui"),
  ]);

  const textRect = rect.add([
    k.text(text, {
      size: 20,
      align: "center",
      styles: {
        wavy: () => ({
          angle: k.wave(-10, 10, k.time() * 2),
        }),
      },
    }),
    k.pos(0, -40),
    k.anchor("center"),
  ]);

  rect.width = textRect.width + 50;

  rect.add([
    k.polygon([k.vec2(-1, 0), k.vec2(1, 0), k.vec2(0, 1)]),
    k.color(k.rgb(darkColor)),
    k.pos(0, 0),
    k.scale(16),
    k.anchor("top"),
  ]);

  k.tween(
    rect.scale,
    k.vec2(1),
    0.5,
    (p) => (rect.scale = p),
    k.easings.easeOutQuart
  );

  k.wait(5).then(() => {
    k.tween(
      rect.scale,
      k.vec2(0),
      0.5,
      (p) => (rect.scale = p),
      k.easings.easeInQuart
    );
  });
}
