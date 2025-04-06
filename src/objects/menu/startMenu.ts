import k from "../../kaplay";
import { gameState } from "../../state";
import { getFirst } from "../../util";
import { addSettingsMenu } from "./settingsMenu";
import { createMenuButton, fullscreenPanel } from "./ui";
import { setFakeCursor } from "../mouse";

export function addStartMenu() {
  k.onKeyPress("escape", () => {
    closeSettingsMenu();
  });

  createStartMenu();
}

function createStartMenu() {
  const startMenu = fullscreenPanel("start_menu_ui");
  startMenu.unuse("fixed");
  startMenu.opacity = 0;

  const actions = {
    "Start Game": async () => {
      k.play("strum3", {
        volume: 0.4,
        detune: 200,
      });

      setFakeCursor("cursor");

      startMenu.paused = true;

      k.tween(
        k.getCamPos(),
        k.getCamPos().add(k.vec2(0, -k.height() * 2)),
        2,
        (p) => {
          k.setCamPos(p);
        },
        k.easings.easeInOutQuad
      );
      await k.wait(1.5);
      k.go("game", "Level_0");
    },
    Settings: () => {
      removeStartMenu();
      setFakeCursor("cursor");

      k.tween(
        k.getCamPos(),
        k.getCamPos().add(k.vec2(0, 500)),
        0.5,
        (p) => {
          k.setCamPos(p);
        },
        k.easings.easeInOutSine
      );

      addSettingsMenu(startMenu);
    },
    Credits: () => {},
  };

  Object.entries(actions).forEach(([text, action], i) => {
    const btn = createMenuButton(
      startMenu,
      text,
      k.vec2(0, 80 + i * 60),
      k.vec2(190, 48),
      () => {
        action();
      }
    );
  });
}

function removeStartMenu() {
  const startMenu = getFirst("start_menu_ui");
  if (startMenu) {
    startMenu.destroy();
  }
}

function closeSettingsMenu() {
  const settingsMenu = getFirst("settings_menu");
  if (settingsMenu) {
    settingsMenu.destroy();
    createStartMenu();
    k.tween(
      k.getCamPos(),
      k.getCamPos().add(k.vec2(0, -500)),
      0.5,
      (p) => {
        k.setCamPos(p);
      },
      k.easings.easeInOutSine
    );
  }
}
