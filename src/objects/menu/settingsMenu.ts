import { GameObj } from "kaplay";
import k from "../../kaplay";
import { createSelectOption, createSliderOption, fullscreenPanel } from "./ui";
import { gameState } from "../../state";

export function addSettingsMenu(parent: GameObj) {
  const settingsMenu = fullscreenPanel("settings_menu");

  settingsMenu.add([
    k.rect(200, 48),
    k.color(0, 0, 0),
    k.opacity(0.4),
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
      value: 100,
      onChange(value: number) {
        gameState.settings.volume = value / 100;
        k.setVolume(value / 100);
      },
      getValue() {
        return gameState.settings.volume * 100;
      },
    },
    "Level Names": {
      type: "select",
      state: "showLevelNames",
      options: ["Off", "On"],
    },
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

  interface SliderOption {
    type: "slider";
    min: number;
    max: number;
    value: number;
    onChange: (value: number) => void;
    getValue: () => number;
  }

  interface SelectOption {
    type: "select";
    state: keyof typeof gameState.settings;
    options: string[];
  }

  type Option = SliderOption | SelectOption;

  Object.entries(options).forEach(([text, option], index) => {
    const pos = k.vec2(0, -180 + index * 64);

    switch (option.type) {
      case "slider":
        createSliderOption(
          settingsMenu,
          text,
          pos,
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
          option.options
        );
        break;
    }
  });

  settingsMenu.add([
    k.rect(450, 32),
    k.color(0, 0, 0),
    k.opacity(0.4),
    k.pos(0, 135),
    k.anchor("center"),
  ]);

  settingsMenu.add([
    k.text("Graphics will change after level restart", {
      size: 14,
    }),
    k.pos(0, 135),
    k.anchor("center"),
  ]);

  return settingsMenu;
}
