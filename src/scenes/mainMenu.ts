import k from "../kaplay";
import { playMainMusic } from "../music";
import { addFakeMouse } from "../objects/mouse";

k.scene("mainMenu", () => {
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
  k.onKeyPress("space", () => {
    playMainMusic();
    k.go("game");
  });

  addFakeMouse();
});
