import "./style.css";
import "./assets";
import k from "./kaplay";
import "./scenes/mainMenu";
import "./scenes/game";

k.layers(["background", "map", "game", "ui"], "game");

k.onLoad(() => {
  //addAntialiasing();
  k.go("mainMenu");
});
