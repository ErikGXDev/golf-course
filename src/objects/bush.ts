import { Vec2 } from "kaplay";
import k from "../kaplay";
import { Picture, worldMousePos } from "../util";
import { drawCircleOptimized } from "../gfx/draw";
import { gameState } from "../state";

export function addVegetation(bushes: Vec2[]) {
  switch (gameState.settings.vegetation) {
    case "Ultra":
      // Same as High, but with mouse interaction
      addVegetationUnoptimized(bushes);
      break;
    case "High":
      addVegetationPicture(bushes);
      break;
    case "Low":
      addVegetationStatic(bushes);
      break;
    case "Off":
      // Do nothing
      break;
  }

  //addVegetationUnoptimized(bushes);
  // addVegetationUnoptimized(bushes);
}

export function addVegetationUnoptimized(bushes: Vec2[]) {
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

// Alternative implementation of addVegetation
export function addVegetationPicture(bushes: Vec2[]) {
  const vegetation = k.add([
    k.pos(0, 0),
    k.layer("game"),
    k.z(10),
    k.animate(),
    "vegetation",
  ]);

  const colors = [k.rgb("#5ba675"), k.rgb("#6bc96c")];
  const radius = [40, 35];

  // Pre-render the circles into pictures
  const pictures: Picture[] = [];

  for (let i = 0; i < colors.length; i++) {
    k.beginPicture(new k.Picture());

    drawCircleOptimized({
      pos: k.vec2(0, 0),
      radius: radius[i],
      color: colors[i],
      segments: 24,
    });

    const picture = k.endPicture();

    pictures.push(picture);
  }

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
        opacity: 0.1,
      });
    }

    // Draw circles
    for (let i = 0; i < colors.length; i++) {
      const currentRadius = radius[i];

      for (let j = 0; j < bushes.length; j++) {
        const pos = bushes[j];
        const radOffset = radOffsets[j];

        const scale = (currentRadius + radOffset) / currentRadius;

        k.drawPicture(pictures[i], {
          pos: pos.add(calculateBushPosOffset(pos)),
          scale: k.vec2(scale),
        });
      }
    }
  });

  vegetation.onDestroy(() => {
    // Clean up the pictures to free memory
    for (const picture of pictures) {
      picture.free();
    }
  });
}

export function addVegetationStatic(bushes: Vec2[]) {
  const vegetation = k.add([
    k.pos(0, 0),
    k.layer("game"),
    k.z(10),
    k.animate(),
    "vegetation",
  ]);

  const colors = [k.rgb("#5ba675"), k.rgb("#6bc96c")];
  const radius = [40, 35];

  const rng = new k.RNG(0);
  const radOffsets = bushes.map(() => rng.genNumber(-10, 0));

  k.beginPicture(new k.Picture());

  for (let i = 0; i < bushes.length; i++) {
    const pos = bushes[i];
    const posOffset = Math.sin(k.time() - pos.x) * 2;

    k.drawSprite({
      pos: pos.sub(k.vec2(128)).add(posOffset),
      sprite: "dropshadow",
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
        pos: pos,
        radius: currentRadius + radOffset,
        color: currentColor,
        segments: 24,
      });
    }
  }

  const picture = k.endPicture();

  vegetation.onDraw(() => {
    k.drawPicture(picture, {
      pos: k.vec2(0, 0),
    });
  });
}

function calculateBushPosOffset(bushPos: Vec2) {
  const posOffset = k.vec2(Math.sin(k.time() - bushPos.x / 60) * 2);

  const mousePos = worldMousePos();

  if (mousePos.dist(bushPos) < 50) {
    const baseDistance = 5 - mousePos.dist(bushPos) / 10;
    const adjustedDistance = Math.min(baseDistance, 5 - baseDistance);

    const angle = bushPos.angle(mousePos);
    const angleVec = k.Vec2.fromAngle(angle).scale(adjustedDistance);

    return posOffset.add(angleVec);
  }

  return posOffset;
}
