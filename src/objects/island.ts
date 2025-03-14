import { Vec2 } from "kaplay";
import k from "../kaplay";
import { drawCircleOptimized } from "../gfx/draw";

// #6d80fa - deep water
// #7d9cfd - shallow water
// #8db7ff - shallowest water
// #5ba675 - wet grass
// #6bc96c - grass

export function addIsland(patches: Vec2[]) {
  console.log("Patches: " + patches.length);

  const island = k.add([
    k.pos(0, 0),
    k.layer("background"),
    k.animate(),
    "island",
    {
      radius1: 128,
      radius2: 96,
      radius3: 78,
      radius4: 68,
    },
  ]);

  island.animate("radius1", [128, 100, 128], {
    duration: 10,
    direction: "forward",
    easing: k.easings.easeInOutQuad,
    timing: [0, 0.5, 1],
  });

  island.animate("radius2", [96, 80, 96], {
    duration: 10,
    direction: "forward",
    easing: k.easings.easeInOutQuad,
    timing: [0, 0.6, 1],
  });

  island.animate("radius3", [76, 64, 76], {
    duration: 10,
    direction: "forward",
    easing: k.easings.easeInOutQuad,
    timing: [0, 0.65, 1],
  });

  island.animate("radius4", [68, 68, 55, 55, 68], {
    duration: 10,
    direction: "forward",
    easing: k.easings.easeInOutQuad,
    timing: [0, 0.1, 0.6, 0.7, 1],
  });

  const colors = ["#7d9cfd", "#8db7ff", "#5ba675", "#6bc96c"];
  const props: Array<keyof typeof island> = [
    "radius1",
    "radius2",
    "radius3",
    "radius4",
  ];
  const segments = [38, 32, 32, 30];

  // Create RNG instance outside the draw loop - it doesn't need to be recreated every frame
  const rng = new k.RNG(1);

  // Pre-calculate random offsets for each patch
  const patchOffsets = patches.map(() => ({
    pos: k.vec2(rng.genNumber(-8, 8), rng.genNumber(-8, 8)),
    rad: rng.genNumber(0, 15),
  }));

  island.onDraw(async () => {
    for (let i = 0; i < 4; i++) {
      const radius = island[props[i]] as number;
      const color = k.rgb(colors[i]);

      for (let j = 0; j < patches.length; j++) {
        const patch = patches[j];
        const offset = patchOffsets[j];

        drawCircleOptimized({
          pos: patch.add(offset.pos),
          radius: radius + offset.rad,
          color: color,
          segments: segments[i],
        });
      }
    }
  });
}

export function addIslandWaveLoop() {
  const sound = k.play("ocean_wave", { volume: 0.3 });
  sound.volume = 0.3;
  return k.loop(10, () => {
    sound.play(0);
  });
}
