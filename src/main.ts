import "./style.css";
import "./assets";
import k from "./kaplay";
import "./scenes/mainMenu";
import "./scenes/game";
import "./scenes/performance";

k.setLayers(["background", "map", "game", "ui"], "game");

k.onLoad(() => {
  //addAntialiasing();
  k.go("main_menu");
});
