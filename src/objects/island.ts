import { Vec2 } from "kaplay";
import k from "../kaplay";
import { drawCircleOptimized } from "../gfx/draw";
import { Picture } from "../util";

// #6d80fa - deep water
// #7d9cfd - shallow water
// #8db7ff - shallowest water
// #5ba675 - wet grass
// #6bc96c - grass

//#region Unoptimized
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

//#endregion Unoptimized

//#region Picture Optimized

// Alternative implementation of addIsland
export function addIslandPicture(patches: Vec2[]) {
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

  const initialRadius = [128, 96, 78, 68];

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

  // Pre-render the circles into pictures
  const pictures: Picture[] = [];

  for (let i = 0; i < colors.length; i++) {
    k.beginPicture(new k.Picture());

    k.drawCircle({
      pos: k.vec2(0, 0),
      radius: initialRadius[i] as number,
      color: k.rgb(colors[i]),
    });

    const picture = k.endPicture();

    pictures.push(picture);
  }

  const rng = new k.RNG(1);

  // Pre-calculate random offsets for each patch
  const patchOffsets = patches.map(() => ({
    pos: k.vec2(rng.genNumber(-8, 8), rng.genNumber(-8, 8)),
    rad: rng.genNumber(0, 15),
  }));

  island.onDraw(async () => {
    for (let i = 0; i < colors.length; i++) {
      //const color = k.rgb(colors[i]);
      const animatedRadius = island[props[i]] as number;
      const radius = initialRadius[i] as number;

      for (let j = 0; j < patches.length; j++) {
        const patch = patches[j];
        const offset = patchOffsets[j];

        /*  drawCircleOptimized({
          pos: patch.add(offset.pos),
          radius: radius + offset.rad,
          color: color,
          segments: segments[i],
        }); */

        const scale = (offset.rad + animatedRadius) / radius;

        k.drawPicture(pictures[i], {
          pos: patch.add(offset.pos),
          scale: k.vec2(scale),
        });
      }
    }
  });

  island.onDestroy(() => {
    // Clean up the pictures to free memory
    for (const picture of pictures) {
      picture.free();
    }
  });
}

//#endregion Picture Optimized

//#region Pre-rendered Opt.

// Alternative implementation of addIsland using quantized easings and pre-rendered pictures

/* function easeInOutQuadPixelated(x: number, steps: number): number {
  const eased = x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;

  return Math.floor(eased * steps) / steps;
} */

export function addIslandQuantizedPicture(
  patches: Vec2[],
  steps: number = 240
) {
  console.log("Patches: " + patches.length);

  const perfTime = Date.now();

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

  // Pre-render the island animation frames into pictures
  const islandPictures: Picture[] = [];

  for (let t = 0; t < steps; t++) {
    const animTime = (t / steps) * 10; // Scale to 10 seconds

    island.animation.seek(animTime);
    island.update(); // Force update to apply the animation

    k.beginPicture(new k.Picture());

    const rng = new k.RNG(1);

    // Pre-calculate random offsets for each patch
    const patchOffsets = patches.map(() => ({
      pos: k.vec2(rng.genNumber(-8, 8), rng.genNumber(-8, 8)),
      rad: rng.genNumber(0, 15),
    }));

    for (let i = 0; i < colors.length; i++) {
      const color = k.rgb(colors[i]);
      const radius = island[props[i]] as number;

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

    const picture = k.endPicture();
    islandPictures.push(picture);
  }

  // Remove the island animation, it's not needed anymore
  island.unanimateAll();

  // Draw the pre-rendered island animation frames
  island.onDraw(async () => {
    const time = k.time() % 10; // Loop every 10 seconds

    // find nearest frame (10/steps)
    const frame = Math.floor((time / 10) * steps) % steps;

    const picture = islandPictures[frame];

    k.drawPicture(picture, {
      pos: k.vec2(0, 0),
    });
  });

  island.onDestroy(() => {
    // Clean up the pictures to free memory
    for (const picture of islandPictures) {
      picture.free();
    }
  });

  const perfTimeEnd = Date.now() - perfTime;
  console.log("Island pre-rendered in " + perfTimeEnd + "ms");
}

export function addIslandWaveLoop() {
  const sound = k.play("ocean_wave", { volume: 0.3 });
  sound.volume = 0.3;
  return k.loop(10, () => {
    sound.play(0);
  });
}
