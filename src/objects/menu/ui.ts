import { Anchor, BlendMode, Color, Comp, GameObj, Vec2 } from "kaplay";
import k from "../../kaplay";
import { getFirst } from "../../util";
import { getFakeMousePos, setFakeCursor } from "../mouse";
import { gameState } from "../../state";

export function createMenuButton(
  parent: GameObj,
  text: string,
  pos: Vec2,
  width: Vec2,
  onClick: () => void
) {
  const btnBg = parent.add([
    k.rect(width.x, width.y, {
      radius: 4,
    }),
    k.color(k.rgb("#f2ae99")),
    k.outline(4, k.rgb("#a6555f")),
    k.pos(pos),
    k.anchor("center"),
    k.area(),
    "menu_btn",
  ]);

  btnBg.area.scale = k.vec2(0);

  k.wait(0.1).then(() => {
    btnBg.area.scale = k.vec2(1);
  });

  btnBg.add([
    k.text(text, {
      size: 18,
    }),
    k.color(k.rgb("#a6555f")),
    k.anchor("center"),
  ]);

  btnBg.onHover(() => {
    btnBg.outline.width = 5;
    k.play("quiet_click_eq", {
      volume: 0.5,
      detune: -800,
    });
    setFakeCursor("pointer");
  });

  btnBg.onHoverEnd(() => {
    btnBg.outline.width = 4;
    setFakeCursor("cursor");
  });

  btnBg.onClick(() => {
    k.play("quiet_click_eq", {
      volume: 0.8,
      detune: k.randi(-3, -6) * 100,
    });
    onClick();
  });

  return btnBg;
}

export function createSliderOption(
  parent: GameObj,
  text: string,
  pos: Vec2,
  onChange: (value: number) => void,
  getValue: () => number
) {
  const sliderBg = parent.add([
    k.rect(550, 48),
    k.color(0, 0, 0),
    k.opacity(0.6),
    k.pos(pos),
    k.anchor("center"),
  ]);

  sliderBg.add([
    k.text(text, {
      size: 16,
    }),
    k.anchor("left"),
    k.pos(-260, 0),
  ]);

  sliderBg.add([
    k.rect(250, 8),
    k.color(200, 200, 200),
    k.pos(-90, 0),
    k.anchor("left"),
    k.area(),
  ]);

  const sliderRect = sliderBg.add([
    k.rect(0, 8),
    k.color(255, 255, 255),
    k.pos(-90, 0),
    k.anchor("left"),
  ]);

  const sliderText = sliderBg.add([
    k.text("0", {
      size: 16,
    }),
    k.anchor("left"),
    k.pos(220, 0),
  ]);

  createMenuButton(sliderBg, "+", k.vec2(185, 0), k.vec2(32, 32), () => {
    const newValue = k.clamp(getValue() + 10, 0, 100);
    onChange(newValue);
    updateSlider();
  });

  createMenuButton(sliderBg, "-", k.vec2(-115, 0), k.vec2(32, 32), () => {
    const newValue = k.clamp(getValue() - 10, 0, 100);
    onChange(newValue);
    updateSlider();
  });

  function updateSlider() {
    const value = getValue();
    sliderText.text = value.toString();
    sliderRect.width = k.map(value, 0, 100, 0, 250);
  }

  updateSlider();
}

export function createSelectOption(
  parent: GameObj,
  text: string,
  pos: Vec2,
  state: keyof typeof gameState.settings,
  options: string[]
) {
  const selectBg = parent.add([
    k.rect(550, 48),
    k.color(0, 0, 0),
    k.opacity(0.6),
    k.pos(pos),
    k.anchor("center"),
  ]);

  selectBg.add([
    k.text(text, {
      size: 16,
    }),
    k.anchor("left"),
    k.pos(-260, 0),
  ]);

  const btns = options.map((option, index) => {
    const btn = createMenuButton(
      selectBg,
      option,
      k.vec2(-25 + index * 84, 0),
      k.vec2(74, 32),
      () => {
        // @ts-ignore
        gameState.settings[state] = option;
        updateSelect();
      }
    );

    return btn;
  });

  function updateSelect() {
    btns.forEach((btn, i) => {
      const btnText = btn.children[0];

      if (btnText.text === gameState.settings[state]) {
        btn.color = k.rgb("#abdd64");
        btn.outline.color = k.rgb("#5ba675");
        btnText.color = k.rgb("#5ba675");
      } else {
        btn.color = k.rgb("#f2ae99");
        btn.outline.color = k.rgb("#a6555f");
        btnText.color = k.rgb("#a6555f");
      }
    });
  }

  updateSelect();
}

export function fullscreenPanel(id: string = "") {
  return k.add([
    k.rect(k.width(), k.height()),
    k.color(0, 0, 0),
    k.pos(k.width() / 2, k.height() / 2),
    k.layer("ui"),
    k.fixed(),
    k.anchor("center"),
    k.opacity(0.3),
    id,
    "menu",
  ]);
}
