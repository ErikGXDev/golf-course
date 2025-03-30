import { Vec2 } from "kaplay";
import k from "../kaplay";
import { addVegetation, addVegetationPicture } from "../objects/bush";
import { addFakeMouse } from "../objects/mouse";
import {
  addIsland,
  addIslandPicture,
  addIslandQuantizedPicture,
} from "../objects/island";

function addPerformanceControls() {
  console.info(`Controls:
    1 - Old Bushes
    2 - Picture Bushes
    3 - Old Island
    4 - Picture Island
    5 - Quantized Island
    
    9 - Main Menu`);

  k.onKeyPress("1", () => {
    k.go("performance_bush_old");
  });

  k.onKeyPress("2", () => {
    k.go("performance_bush_picture");
  });

  k.onKeyPress("3", () => {
    k.go("performance_island_old");
  });

  k.onKeyPress("4", () => {
    k.go("performance_island_picture");
  });

  k.onKeyPress("5", () => {
    k.go("performance_island_quantize");
  });

  k.onKeyPress("9", () => {
    k.go("mainMenu");
  });

  const sceneText = k.add([
    k.text(k.getSceneName() || "Untitled", {
      size: 16,
    }),
    k.layer("ui"),
    k.pos(8, 24),
  ]);

  const fpsText = k.add([
    k.text("FPS: 0", {
      size: 16,
    }),
    k.layer("ui"),
    k.pos(8, 8),
  ]);

  k.onUpdate(() => {
    fpsText.text = `FPS: ${Math.round(k.debug.fps())}`;
    fpsText.pos = k
      .getCamPos()
      .sub(k.width() / 2, k.height() / 2)
      .add(k.vec2(8, 8));

    sceneText.pos = k
      .getCamPos()
      .sub(k.width() / 2, k.height() / 2)
      .add(k.vec2(8, 24));
  });

  k.setCamPos(k.vec2(0, 0));

  addFakeMouse();
}

//#region Configuration

// Common constants
const VEGETATION_COUNT = 1000;
const PATCH_COUNT = 300;

//#endregion Configuration

k.scene("performance", () => {
  addPerformanceControls();

  k.add([
    k.text("Performance Test,\ncheck console", {
      size: 16,
    }),
    k.pos(0, 0),
    k.layer("ui"),
    k.anchor("center"),
  ]);
});

k.scene("performance_bush_picture", () => {
  addPerformanceControls();

  const bushes: Vec2[] = [];

  const rng = new k.RNG(0);

  for (let i = 0; i < VEGETATION_COUNT; i++) {
    bushes.push(k.vec2(rng.genNumber(-500, 500), rng.genNumber(-300, 300)));
  }

  addVegetationPicture(bushes);
});

k.scene("performance_bush_old", () => {
  addPerformanceControls();

  const bushes: Vec2[] = [];

  const rng = new k.RNG(0);

  for (let i = 0; i < VEGETATION_COUNT; i++) {
    bushes.push(k.vec2(rng.genNumber(-500, 500), rng.genNumber(-300, 300)));
  }

  addVegetation(bushes);
});

k.scene("performance_island_old", () => {
  addPerformanceControls();

  const patches: Vec2[] = [];

  const rng = new k.RNG(0);

  for (let i = 0; i < PATCH_COUNT; i++) {
    patches.push(k.vec2(rng.genNumber(-300, 300), rng.genNumber(-200, 200)));
  }

  addIsland(patches);
});

k.scene("performance_island_picture", () => {
  addPerformanceControls();

  const patches: Vec2[] = [];

  const rng = new k.RNG(0);

  for (let i = 0; i < PATCH_COUNT; i++) {
    patches.push(k.vec2(rng.genNumber(-300, 300), rng.genNumber(-200, 200)));
  }

  addIslandPicture(patches);
});

k.scene("performance_island_quantize", () => {
  addPerformanceControls();

  const patches: Vec2[] = [];

  const rng = new k.RNG(0);

  for (let i = 0; i < PATCH_COUNT; i++) {
    patches.push(k.vec2(rng.genNumber(-300, 300), rng.genNumber(-200, 200)));
  }

  addIslandQuantizedPicture(patches);
});
