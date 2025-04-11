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

  if (window.location.host.includes("itch")) {
    k.setBackground(k.rgb("#6d80fa"));
    playMainMusic();
    k.go("main_menu");
  } else {
    k.go("intro");
  }

  //k.go("game_end");
});
