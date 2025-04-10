import "./style.css";
import "./assets";
import k from "./kaplay";
import "./scenes/intro";
import "./scenes/mainMenu";
import "./scenes/game";
import "./scenes/gameEnd";
import "./scenes/performance";
import { playMainMusic } from "./music";

k.setLayers(["background", "map", "game", "ui"], "game");

k.onLoad(() => {
  //addAntialiasing();

  if (new Date().getDate() < 11 && !import.meta.env.DEV) {
    k.add([
      k.text("Releasing on the 11th of April!", {
        size: 24,
      }),
      k.pos(k.center()),
      k.anchor("center"),
    ]);

    k.wait(5).then(() => {
      window.open("https://erikgxdev.itch.io/", "_blank");
    });
    return;
  }

  if (window.location.host.includes("itch")) {
    k.setBackground(k.rgb("#6d80fa"));
    playMainMusic();
    k.go("main_menu");
  } else {
    k.go("intro");
  }

  //k.go("game_end");
});
