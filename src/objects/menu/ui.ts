import { Anchor, Comp, GameObj, Vec2 } from "kaplay";
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
    k.rect(width.x, width.y),
    k.color(0, 0, 0),
    k.opacity(0.5),
    k.pos(pos),
    k.anchor("center"),
    k.area(),
  ]);

  btnBg.add([
    k.text(text, {
      size: 16,
    }),
    k.anchor("center"),
  ]);

  btnBg.onHover(() => {
    btnBg.opacity = 0.7;
    setFakeCursor("pointer");
  });

  btnBg.onHoverEnd(() => {
    btnBg.opacity = 0.5;
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
      k.vec2(0 + index * 75, 0),
      k.vec2(70, 32),
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
      const btnText = btn.children[0].text;

      if (btnText === gameState.settings[state]) {
        btn.color = k.rgb("#f29848");
      } else {
        btn.color = k.rgb("#000000");
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
