import k from "../../kaplay";
import { getFirst } from "../../util";
import { createMenuButton, fullscreenPanel } from "./ui";
import { addSettingsMenu } from "./settingsMenu";
import { gameState } from "../../state";
import { setFakeCursor } from "../mouse";
import { setCameraControlsEnabled } from "../camera";

let expanded = false;
export function addPauseMenu() {
  k.onKeyPress("escape", () => {
    toggleExpand();
  });

  k.onGamepadButtonPress("start", () => {
    toggleExpand();
  });
}

export function createPauseMenu() {
  const pauseMenu = fullscreenPanel("pause_menu");

  pauseMenu.add([
    k.rect(200, 48),
    k.color(0, 0, 0),
    k.opacity(0.35),
    k.pos(0, -200),
    k.anchor("center"),
  ]);

  pauseMenu.add([
    k.text("Game Menu", {
      size: 24,
    }),
    k.pos(0, -200),
    k.anchor("center"),
  ]);

  const actions = {
    Resume: () => {
      closePauseMenu();
      setFakeCursor("cursor");
    },
    Restart: () => {
      closePauseMenu();
      k.go("game", gameState.currentLevel);
    },
    Settings: () => {
      removePauseMenu();
      setFakeCursor("cursor");
      addSettingsMenu(pauseMenu);
    },
    "Exit to Menu": () => {
      closePauseMenu();
      k.go("main_menu");
    },
  };

  // loop through the actions and create buttons for each

  Object.entries(actions).forEach(([text, action], index) => {
    createMenuButton(
      pauseMenu,
      text,
      k.vec2(0, -100 + index * 40),
      k.vec2(160, 32),
      () => {
        action();
      }
    );
  });

  return pauseMenu;
}

function toggleExpand() {
  expanded = !expanded;

  if (expanded) {
    createPauseMenu();
    setCameraControlsEnabled(false);
    pauseGameObjects();
    setFakeCursor("cursor");
  } else {
    removeAllMenus();
    setCameraControlsEnabled(true);
    resumeGameObjects();
    setFakeCursor("cursor");
  }
}

function removePauseMenu() {
  const pauseMenu = getFirst("pause_menu");

  if (pauseMenu) {
    pauseMenu.destroy();
  }
}

function removeAllMenus() {
  const menus = k.get("menu");

  menus.forEach((menu) => {
    menu.destroy();
  });
}

function closePauseMenu() {
  removePauseMenu();
  expanded = false;
}

const pausableTags = ["golfball", "special", "island"];
function pauseGameObjects() {
  pausableTags.forEach((tag) => {
    const objs = k.get(tag);
    objs.forEach((obj) => {
      obj.paused = true;
    });
  });
}

function resumeGameObjects() {
  pausableTags.forEach((tag) => {
    const objs = k.get(tag);
    objs.forEach((obj) => {
      obj.paused = false;
    });
  });
}
