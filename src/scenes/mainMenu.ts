import k from "../kaplay";
import { playMainMusic } from "../music";
import { addFakeMouse } from "../objects/mouse";

k.scene("main_menu", () => {
  k.add([
    k.text("Main Menu", {
      size: 32,
    }),
    k.pos(k.width() / 2, k.height() / 2),
    k.anchor("center"),
  ]);
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
    playMainMusic();
    k.go("game");
  });

  k.onKeyPress("p", () => {
    k.go("performance");
  });

  addFakeMouse();
});
