import k from "../../kaplay";
import { getFirst } from "../../util";
import { createMenuButton, fullscreenPanel } from "./ui";
import { addSettingsMenu } from "./settingsMenu";
import { gameState } from "../../state";
import { setFakeCursor } from "../mouse";
import { setCameraControlsEnabled } from "../camera";

let expanded = false;
export function addPauseMenu() {
  const menuButtonHolder = k.add([
    k.pos(0, 0),
    k.layer("ui"),
    k.z(10),
    k.fixed(),
  ]);

  const menuButton = createMenuButton(
    menuButtonHolder,
    "",
    k.vec2(28, k.height() - 28),
    k.vec2(38, 38),
    () => {
      toggleExpand();
    }
  );

  menuButton.use(k.z(10));
  menuButton.use(k.layer("ui"));

  menuButton.add([
    k.sprite("menu_icon"),
    k.pos(0, 0),
    k.scale(1.5),
    k.color(k.rgb("#a6555f")),
    k.anchor("center"),
    k.layer("ui"),
    k.z(10),
  ]);

  menuButton.use("pause_menu_btn");

  /* const menuButtonBg = k.add([
    k.rect(48, 48, {
      radius: 4,
    }),
    k.pos(32, k.height() - 32),
    k.anchor("center"),
    k.area(),
    "pause_menu_btn",
  ]);

  const menuButton = menuButtonBg.add([
    k.sprite("menu_icon"),
    k.pos(0, 0),
    k.anchor("center"),
    "pause_menu_btn",
  ]);

  menuButtonBg.onClick(() => {
    k.play("quiet_click_eq", {
      volume: 0.8,
      detune: k.randi(-3, -6) * 100,
    });
    toggleExpand();
  });

  menuButtonBg.onHover(() => {
    setFakeCursor("pointer");
  });

  menuButtonBg.onHoverEnd(() => {
    setFakeCursor("cursor");
  }); */

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
    k.rect(200, 48, {
      radius: 8,
    }),
    k.outline(8, k.rgb("#a6555f").darken(15)),
    k.color(k.rgb("#f2ae99").darken(15)),
    k.pos(0, -200),
    k.anchor("center"),
  ]);

  pauseMenu.add([
    k.text("Game Menu", {
      size: 24,
    }),
    k.color(k.rgb("#a6555f").darken(15)),
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
      setFakeCursor("cursor");
      removePauseMenu();
      addSettingsMenu();
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
      k.vec2(0, -100 + index * 48),
      k.vec2(180, 36),
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

const pausableTags = ["golfball", "special"];
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
