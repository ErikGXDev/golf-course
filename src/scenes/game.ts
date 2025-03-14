import k from "../kaplay";
import { addMap } from "../map";
import { playMainMusic } from "../music";
import {
  addCameraControls,
  setCameraControlsEnabled,
  setCameraTarget,
} from "../objects/cameraControls";
import { addFakeMouse } from "../objects/mouse";
import { roundVec2 } from "../util";

k.scene("game", (level = "Level_0") => {
  const map = addMap(level);

  addCameraControls();
  setCameraControlsEnabled(false);

  const mapCenter = map.mapCenter;

  k.tween(
    k.vec2(-200, 2000),
    mapCenter,
    2.5,
    (p) => k.camPos(roundVec2(p)),
    k.easings.easeOutQuart
  ).then(() => {
    setCameraTarget(mapCenter);
    setCameraControlsEnabled(true);
  });

  const fpsText = k.add([
    k.text("FPS: 0", {
      size: 16,
    }),
    k.pos(8, 8),
  ]);

  k.onUpdate(() => {
    fpsText.text = `FPS: ${Math.round(k.debug.fps())}`;
    fpsText.pos = k
      .camPos()
      .sub(k.width() / 2, k.height() / 2)
      .add(k.vec2(8, 8));
  });

  k.on("level_finish", "player", async () => {
    await k.wait(2);
    setCameraControlsEnabled(false);
    console.log("Level finished!");

    await k.tween(
      k.camPos(),
      k.vec2(400, -2000),
      3,
      (p) => k.camPos(roundVec2(p)),
      k.easings.easeInOutQuad
    );

    map.islandWaveLoop.cancel();

    k.go("game", map.nextLevel);
  });

  k.onKeyPress("g", () => {
    k.go("game", map.nextLevel);
  });

  k.onKeyPress("r", () => {
    k.go("game", level);
  });

  addFakeMouse();
});
