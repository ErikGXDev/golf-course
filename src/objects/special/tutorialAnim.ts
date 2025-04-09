import { Vec2 } from "kaplay";
import k from "../../kaplay";

export function addTutorialAnim(pos: Vec2) {
  const DURATION = 8;

  const animHolder = k.add([
    k.pos(pos),
    k.opacity(0.5),
    "tutorial_anim",
    "special",
  ]);

  const ball = animHolder.add([
    k.sprite("golfball"),
    k.pos(0, 0),
    k.animate(),
    k.scale(1),
    k.opacity(0.5),
    k.anchor("center"),
    "tutorial_ball",
    "special",
  ]);

  ball.animate(
    "pos",
    [
      k.vec2(0, 0),
      k.vec2(0, 0),
      k.vec2(0, 0),
      k.vec2(0, 0),
      k.vec2(0, -320),
      k.vec2(0, -320),
    ],
    {
      duration: DURATION,
      easing: k.easings.easeOutCubic,
    }
  );

  ball.animate(
    "scale",
    [
      k.vec2(0),
      k.vec2(1),
      k.vec2(1),
      k.vec2(1),
      k.vec2(1),
      k.vec2(1),
      k.vec2(0),
      k.vec2(0),
    ],
    {
      duration: DURATION,
      easings: [
        k.easings.easeOutElastic,
        k.easings.easeOutCubic,
        k.easings.easeOutCubic,
        k.easings.easeOutCubic,
        k.easings.easeOutCubic,
        k.easings.easeInElastic,
        k.easings.easeOutCubic,
        k.easings.easeOutCubic,
      ],
    }
  );

  const fakeCursor = animHolder.add([
    k.sprite("cursor"),
    k.pos(64, -64),
    k.opacity(0.5),
    k.animate(),

    "tutorial_cursor",
    "special",
    {
      time: 0,
    },
  ]);

  fakeCursor.animate(
    "pos",
    [
      k.vec2(64, 64),
      k.vec2(0, 0),
      k.vec2(0, 0),
      k.vec2(0, 128),
      k.vec2(0, 128),
      k.vec2(64, 64),
    ],
    {
      duration: DURATION,
      easing: k.easings.easeOutCubic,
    }
  );

  fakeCursor.animate("time", [0, 6], {
    duration: DURATION,
  });

  fakeCursor.onUpdate(() => {
    if (fakeCursor.time < 1) {
      fakeCursor.sprite = "cursor";
    }
    if (fakeCursor.time >= 0.5) {
      fakeCursor.sprite = "pointer";
    }
    if (fakeCursor.time >= 2) {
      fakeTracer.opacity = 0.5;
      fakeCursor.sprite = "drag";
    }
    if (fakeCursor.time >= 3.5) {
      fakeTracer.opacity = 0;
      fakeCursor.sprite = "cursor";
    }
  });

  const fakeTracer = animHolder.add([
    k.pos(0, -32),
    k.opacity(0),
    k.animate(),
    "tutorial_tracer",
    {
      gap: 5,
    },
  ]);

  fakeTracer.animate("gap", [0, 0, 0, 40, 40, 40], {
    duration: DURATION,
    easing: k.easings.easeOutCubic,
  });

  fakeTracer.onDraw(() => {
    for (let i = 0; i < 5; i++) {
      const pos = k.UP.scale(i * fakeTracer.gap);

      k.drawCircle({
        pos: pos,
        color: k.rgb("#1f102a"),
        radius: 4,
        opacity: fakeTracer.opacity,
      });

      k.drawCircle({
        pos: pos,
        color: k.rgb("#ffffff"),
        radius: 2,
        opacity: fakeTracer.opacity,
      });
    }
  });

  const hintText = k.add([
    k.text(
      "[wavy]Use WASD to \nmove the camera!\n\nClick and drag to\nmove the ball![/wavy]",
      {
        size: 22,
        align: "center",
        font: "happy_o",
        styles: {
          wavy: (idx) => ({
            angle: k.wave(-5, 5, k.time() * 2 + idx * 0.2),
          }),
        },
      }
    ),
    k.opacity(0.6),
    k.pos(pos.add(0, -200)),
    k.anchor("center"),
  ]);

  const golfBall = k.get("golfball")[0];
  animHolder.onUpdate(() => {
    if (golfBall.state === "dragging") {
      animHolder.destroy();
      hintText.destroy();
    }
  });
}
