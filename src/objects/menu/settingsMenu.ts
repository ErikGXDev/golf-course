import { GameObj } from "kaplay";
import k from "../../kaplay";
import {
  createMenuButton,
  createSelectOption,
  createSliderOption,
  fullscreenPanel,
} from "./ui";
import { gameState } from "../../state";
import { muteMusic, skipMusic, unmuteMusic } from "../../music";
import type { Option } from "./ui";

export function addSettingsMenu() {
  const settingsMenu = fullscreenPanel("settings_menu");

  settingsMenu.add([
    k.rect(200, 48, {
      radius: 8,
    }),
    k.color(k.rgb("#4caf50")),
    k.outline(8, k.rgb("#2e7d32")),
    k.pos(0, -260),
    k.anchor("center"),
  ]);

  settingsMenu.add([
    k.text("Settings", {
      size: 24,
    }),
    k.pos(0, -260),
    k.anchor("center"),
  ]);

  const options: Record<string, Option> = {
    Volume: {
      type: "slider",
      min: 0,
      max: 100,
      increment: 10,
      value: 100,
      onChange(value: number) {
        gameState.settings.volume = value / 100;
        k.setVolume(value / 100);
      },
      getValue() {
        return gameState.settings.volume * 100;
      },
    },
    Music: {
      type: "select",
      state: "music",
      options: ["Off", "On"],
      onChange(value: string) {
        if (value === "Off") {
          muteMusic();
        } else if (value === "On") {
          unmuteMusic();
        }
      },
    },
    /* Zoom: {
      type: "slider",
      min: 0.5,
      max: 2,
      increment: 0.1,
      value: 1,
      onChange(value: number) {
        gameState.settings.cameraZoom = value;
        k.setCamScale(value);
      },
      getValue() {
        return gameState.settings.cameraZoom;
      },
    }, */
    /* 
    "Level Names": {
      type: "select",
      state: "showLevelNames",
      options: ["Off", "On"],
    }, */
    Island: {
      type: "select",
      state: "island",
      options: ["Off", "Low", "High", "Ultra"],
    },
    Vegetation: {
      type: "select",
      state: "vegetation",
      options: ["Off", "Low", "High", "Ultra"],
    },
    Shadows: {
      type: "select",
      state: "shadows",
      options: ["Off", "On"],
    },
  };

  Object.entries(options).forEach(([text, option], index) => {
    const pos = k.vec2(0, -180 + index * 64);

    switch (option.type) {
      case "slider":
        createSliderOption(
          settingsMenu,
          text,
          pos,
          option.min,
          option.max,
          option.increment,
          option.onChange,
          option.getValue
        );
        break;
      case "select":
        createSelectOption(
          settingsMenu,
          text,
          pos,
          option.state,
          option.options,
          option.onChange
        );
        break;
    }
  });

  createMenuButton(
    settingsMenu,
    "Skip Song",
    k.vec2(185, -180 + 64),
    k.vec2(160, 32),
    () => {
      skipMusic();
    }
  );

  settingsMenu.add([
    k.rect(450, 32, {
      radius: 8,
    }),
    k.color(0, 0, 0),
    k.opacity(0.6),
    k.pos(0, 130),
    k.anchor("center"),
  ]);

  settingsMenu.add([
    k.text("Graphics will change after level restart", {
      size: 14,
    }),
    k.pos(0, 130),
    k.anchor("center"),
  ]);

  return settingsMenu;
}
