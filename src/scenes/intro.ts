import k from "../kaplay";
import { playMainMusic } from "../music";
import { addIslandPicture } from "../objects/island";
import { addFakeMouse } from "../objects/mouse";

k.scene("intro", () => {
  addIslandPicture([
    k.vec2(k.width() / 2 - 381, k.height() / 2 - 7.5),
    k.vec2(k.width() / 2 - 362, k.height() / 2 - 60.5),
    k.vec2(k.width() / 2 - 320, k.height() / 2 - 107.5),
    k.vec2(k.width() / 2 - 242, k.height() / 2 - 110.5),
    k.vec2(k.width() / 2 - 155, k.height() / 2 - 115.5),
    k.vec2(k.width() / 2 - 25, k.height() / 2 - 105.5),
    k.vec2(k.width() / 2 + 42, k.height() / 2 - 99.5),
    k.vec2(k.width() / 2 + 112, k.height() / 2 - 103.5),
    k.vec2(k.width() / 2 + 176, k.height() / 2 - 115.5),
    k.vec2(k.width() / 2 + 296, k.height() / 2 - 113.5),
    k.vec2(k.width() / 2 + 348, k.height() / 2 - 99.5),
    k.vec2(k.width() / 2 + 368, k.height() / 2 - 55.5),
    k.vec2(k.width() / 2 + 374, k.height() / 2 + 0.5),
    k.vec2(k.width() / 2 + 338, k.height() / 2 + 52.5),
    k.vec2(k.width() / 2 + 227, k.height() / 2 + 62.5),
    k.vec2(k.width() / 2 + 87, k.height() / 2 + 64.5),
    k.vec2(k.width() / 2 - 34, k.height() / 2 + 59.5),
    k.vec2(k.width() / 2 - 100, k.height() / 2 + 59.5),
    k.vec2(k.width() / 2 - 189, k.height() / 2 + 59.5),
    k.vec2(k.width() / 2 - 288, k.height() / 2 + 56.5),
    k.vec2(k.width() / 2 - 360, k.height() / 2 + 30.5),
    k.vec2(k.width() / 2 + 20, k.height() / 2 + 83.5),
    k.vec2(k.width() / 2 + 149, k.height() / 2 + 82.5),
    k.vec2(k.width() / 2 + 292, k.height() / 2 + 84.5),
    k.vec2(k.width() / 2 - 85, k.height() / 2 - 133.5),
    k.vec2(k.width() / 2 + 232, k.height() / 2 - 131.5),
  ]);

  const box = k.add([
    k.rect(700, 150, {
      radius: 16,
    }),
    k.color(k.rgb("#f2ae99")),
    k.outline(8, k.rgb("#a6555f")),
    k.scale(1),
    k.pos(k.width() / 2, k.height() / 2 - 20),
    k.anchor("center"),
    k.area(),
  ]);

  box.onClick(() => {
    goToMainMenu();
    return;
  });

  box.add([
    k.text("You were invited to play golf!", {
      size: 24,
    }),
    k.color(k.rgb("#a6555f")),
    k.pos(0, -12),
    k.anchor("center"),
  ]);

  box.add([
    k.text("Press any button to start!", {
      size: 20,
    }),
    k.color(k.rgb("#a6555f")),
    k.pos(0, 18),
    k.anchor("center"),
    k.opacity(1),
  ]);

  k.onKeyPress(() => {
    goToMainMenu();
  });

  k.onGamepadButtonPress(() => {
    goToMainMenu();
  });

  addFakeMouse();

  let canGo = true;
  async function goToMainMenu() {
    if (!canGo) return;
    canGo = false;

    k.play("strum3", { volume: 0.3 });

    k.tween(
      k.vec2(1),
      k.vec2(1.05),
      1,
      (p) => {
        box.scale = p;
      },
      k.easings.easeOutElastic
    );

    await k.wait(0.5);

    k.tween(
      k.getCamPos(),
      k.getCamPos().add(0, -k.height() * 2),
      2,
      (p) => {
        k.setCamPos(p);
      },
      k.easings.easeInOutQuad
    );

    await k.wait(1.5);
    playMainMusic();
    canGo = true;
    k.go("main_menu");
  }
});
