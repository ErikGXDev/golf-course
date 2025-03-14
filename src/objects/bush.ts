import { Vec2 } from "kaplay";
import k from "../kaplay";
import { worldMousePos } from "../util";
import { drawCircleOptimized } from "../gfx/draw";

export function addVegetation(bushes: Vec2[]) {
  const vegetation = k.add([
    k.pos(0, 0),
    k.layer("game"),
    k.z(10),
    k.animate(),
    "vegetation",
  ]);

  const colors = [k.rgb("#5ba675"), k.rgb("#6bc96c")];
  const radius = [40, 35];

  // Pre-calculate random offsets
  const rng = new k.RNG(0);
  const radOffsets = bushes.map(() => rng.genNumber(-10, 0));

  vegetation.onDraw(() => {
    // Draw shadows first
    for (let i = 0; i < bushes.length; i++) {
      const pos = bushes[i];
      const posOffset = Math.sin(k.time() - pos.x) * 2;

      k.drawSprite({
        pos: pos.sub(k.vec2(128)).add(posOffset),
        sprite: "dropshadow",
        scale: k.vec2(1),
        opacity: 0.1,
      });
    }

    // Draw circles
    for (let i = 0; i < colors.length; i++) {
      const currentRadius = radius[i];
      const currentColor = colors[i];

      for (let j = 0; j < bushes.length; j++) {
        const pos = bushes[j];
        const radOffset = radOffsets[j];

        drawCircleOptimized({
          pos: pos.add(calculateBushPosOffset(pos)),
          radius: currentRadius + radOffset,
          color: currentColor,
          segments: 24,
        });
      }
    }
  });
}

function calculateBushPosOffset(bushPos: Vec2) {
  const mousePos = worldMousePos();

  const posOffset = k.vec2(Math.sin(k.time() - bushPos.x / 60) * 2);

  if (mousePos.dist(bushPos) < 50) {
    const baseDistance = 5 - mousePos.dist(bushPos) / 10;
    const adjustedDistance = Math.min(baseDistance, 5 - baseDistance);

    const angle = bushPos.angle(mousePos);
    const angleVec = k.Vec2.fromAngle(angle).scale(adjustedDistance);

    return posOffset.add(angleVec);
  }

  return posOffset;
}
