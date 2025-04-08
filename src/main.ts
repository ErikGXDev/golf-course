import "./style.css";
import "./assets";
import k from "./kaplay";
import "./scenes/intro";
import "./scenes/mainMenu";
import "./scenes/game";
import "./scenes/gameEnd";
import "./scenes/performance";

k.setLayers(["background", "map", "game", "ui"], "game");

k.onLoad(() => {
  //addAntialiasing();
  k.go("intro");
  //k.go("game_end");
});
