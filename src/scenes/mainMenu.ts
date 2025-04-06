import { Vec2 } from "kaplay";
import k from "../kaplay";
import { playMainMusic } from "../music";
import { addFakeMouse, setFakeCursor } from "../objects/mouse";
import { gameState } from "../state";
import { addSettingsMenu } from "../objects/menu/settingsMenu";
import { fullscreenPanel } from "../objects/menu/ui";
import { addStartMenu } from "../objects/menu/startMenu";
import { addMap } from "../map";

k.scene("main_menu", () => {
  k.tween(
    k.getCamPos().add(0, k.height() * 2),
    k.getCamPos(),
    2,
    (p) => {
      k.setCamPos(p);
    },
    k.easings.easeInOutQuad
  );

  addStartMenu();
  addLogo(k.vec2(k.width() / 2, k.height() / 2 - 170));

  const prev1 = k.add([
    k.sprite("preview_1"),
    k.pos(-6000, 600),
    k.rotate(30),
    k.anchor("center"),
  ]);

  const prev2 = k.add([
    k.sprite("preview_2"),
    k.pos(k.width() + 5000, 500),
    k.rotate(140),
    k.anchor("center"),
  ]);

  k.tween(
    k.vec2(-900, 600),
    k.vec2(50, 600),
    3,
    (p) => {
      prev1.pos = p;
    },
    k.easings.easeInOutQuad
  );

  k.wait(0.2).then(() =>
    k.tween(
      k.vec2(k.width() + 900, 500),
      k.vec2(k.width() + 50, 500),
      3,
      (p) => {
        prev2.pos = p;
      },
      k.easings.easeInOutQuad
    )
  );

  addFakeMouse();

  /*
  k.add([
    k.text("Press Space to Start", {
      size: 16,
    }),
    k.pos(k.width() / 2, k.height() / 2 + 32),
    k.anchor("center"),
  ]);
  k.add([
    k.text("Press P for Performance Test", {
      size: 16,
    }),
    k.pos(k.width() / 2, k.height() / 2 + 64),
    k.anchor("center"),
  ]);

  k.onKeyPress("space", () => {
    gameState.totalShots = 0;
    k.go("game");
  });

  k.onKeyPress("p", () => {
    k.go("performance");
  });*/
});

function addLogo(pos: Vec2) {
  const logo = k.add([k.anchor("center"), k.pos(pos)]);

  const imgs = ["deep_water", "shallow_water", "grass", "title"];

  imgs.forEach((img, i) => {
    const part = logo.add([
      k.sprite(`logo_${img}`),
      k.anchor("center"),
      k.pos(0, 0),
      k.scale(1),
    ]);

    if (i != imgs.length - 1) {
      part.onUpdate(() => {
        part.scale = k.vec2(1.1 + Math.sin(k.time() * 0.5 + i / 5) * 0.05);
      });
    }
  });
}
