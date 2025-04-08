import k from "../kaplay";
import { createMenuButton, fullscreenPanel } from "../objects/menu/ui";
import { addFakeMouse } from "../objects/mouse";
import { gameState } from "../state";

k.scene("game_end", () => {
  k.tween(
    k.vec2(-400, k.height() + 300),
    k.center(),
    2,
    (p) => {
      k.setCamPos(p);
    },
    k.easings.easeInOutQuad
  );

  const prev = k.add([
    k.sprite("preview_1"),
    k.pos(k.width() / 2, k.height() / 2),
    k.anchor("center"),
    k.layer("background"),
    k.rotate(10),
    k.opacity(0.8),
    k.z(-1),
  ]);

  prev.onUpdate(() => {
    prev.angle = k.wave(5, 10, k.time() / 2);
  });

  const box = k.add([
    k.rect(650, 120, {
      radius: 16,
    }),
    k.color(k.rgb("#ff9800")),
    k.outline(8, k.rgb("#ff6f00")),
    k.scale(1),
    k.pos(k.width() / 2, k.height() / 2 - 120),
    k.anchor("center"),
    k.area(),
  ]);

  box.add([
    k.text("Congratulations!", {
      size: 24,
    }),
    k.color(k.rgb("#ffffff")),
    k.pos(0, -16),
    k.anchor("center"),
  ]);

  box.add([
    k.text("You completed the Golf Course!", {
      size: 24,
    }),
    k.color(k.rgb("#ffffff")),
    k.pos(0, 16),
    k.anchor("center"),
  ]);

  const box2 = k.add([
    k.rect(635, 70, {
      radius: 16,
    }),
    k.color(k.rgb("#7d2da0")),
    k.outline(8, k.rgb("#4e187c")),
    k.scale(1),
    k.pos(k.width() / 2, k.height() / 2),
    k.anchor("center"),
    k.area(),
  ]);

  const display = `You needed [wavy]${gameState.totalShots} shot${
    gameState.totalShots == 1 ? "" : "s"
  }[/wavy]! (Impressive!)`;

  box2.add([
    k.text(display, {
      size: 20,
      align: "center",
      styles: {
        wavy: () => ({
          angle: k.wave(-10, 10, k.time() * 2),
        }),
      },
    }),
    k.color(k.rgb("#ffffff")),
    k.pos(0),
    k.anchor("center"),
  ]);

  const gameEndMenu = k.add([k.pos(k.width() / 2, k.height() / 2)]);

  createMenuButton(
    gameEndMenu,
    "Exit to Menu",
    k.vec2(0, 100),
    k.vec2(180, 36),
    () => {
      returnToMainMenu();
    }
  );

  k.onKeyPress("space", () => {
    returnToMainMenu();
  });

  k.onGamepadButtonPress(["east", "south"], () => {
    returnToMainMenu();
  });

  function returnToMainMenu() {
    k.play("strum3", { volume: 0.3 });
    k.tween(
      k.getCamPos(),
      k.getCamPos().add(0, k.height() + 100),
      1.5,
      (p) => {
        k.setCamPos(p);
      },
      k.easings.easeInOutQuad
    ).then(() => {
      k.go("main_menu");
    });
  }

  addFakeMouse();
});
