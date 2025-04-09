import k from "../../kaplay";
import { getFirst } from "../../util";
import { addSettingsMenu } from "./settingsMenu";
import { createMenuButton, fullscreenPanel } from "./ui";
import { setFakeCursor } from "../mouse";
import { addCreditsMenu } from "./creditsMenu";

export function addStartMenu() {
  k.onKeyPress("escape", () => {
    closeMenues();
  });

  k.onGamepadButtonPress("start", () => {
    closeMenues();
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
        k.getCamPos().add(k.vec2(0, -k.height() - 100)),
        1.5,
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
      addCloseButton();
      addSettingsMenu();
    },
    Credits: () => {
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
      addCloseButton();
      addCreditsMenu();
    },
  };

  Object.entries(actions).forEach(([text, action], i) => {
    createMenuButton(
      startMenu,
      text,
      k.vec2(0, 80 + i * 60),
      k.vec2(190, 48),
      () => {
        action();
      }
    );
  });

  const btn = createMenuButton(
    startMenu,
    "",
    k.vec2(0, 95 + 3 * 60),
    k.vec2(190, 48),
    () => {
      window.open("https://erikgxdev.itch.io/golf-course", "_blank");
    }
  );

  btn.add([
    k.sprite("logo_itchio"),
    k.color(k.rgb("#a6555f")),

    k.anchor("center"),
    k.scale(0.3),
    k.layer("ui"),
  ]);
}

function removeStartMenu() {
  const startMenu = getFirst("start_menu_ui");
  if (startMenu) {
    startMenu.destroy();
  }
}

function closeMenues() {
  const settingsMenu = getFirst("settings_menu");
  const creditsMenu = getFirst("credits_menu");

  if (settingsMenu || creditsMenu) {
    if (settingsMenu) {
      settingsMenu.destroy();
    }
    if (creditsMenu) {
      creditsMenu.destroy();
    }

    removeCloseButton();

    createStartMenu();
    k.tween(
      k.getCamPos(),
      k.center(),
      0.5,
      (p) => {
        k.setCamPos(p);
      },
      k.easings.easeInOutSine
    );
  }
}

function addCloseButton() {
  const btnHolder = k.add([
    k.pos(k.width() / 2, k.height() / 2),
    k.fixed(),
    k.layer("ui"),
    k.z(10),
    "close_btn",
  ]);

  const closeBtn = createMenuButton(
    btnHolder,
    "< Back",
    k.vec2(0, 250),
    k.vec2(150, 36),
    () => {
      closeMenues();
      setFakeCursor("cursor");
    }
  );

  closeBtn.use("close_btn");
}

function removeCloseButton() {
  const closeBtn = getFirst("close_btn");
  if (closeBtn) {
    closeBtn.destroy();
  }
}
