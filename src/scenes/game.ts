import k from "../kaplay";
import { addMap } from "../map";
import {
  addCameraControls,
  setCameraControlsEnabled,
  setCameraTarget,
  setCameraUpdateEnabled,
} from "../objects/camera";
import { addFakeMouse } from "../objects/mouse";
import { addPauseMenu } from "../objects/menu/pauseMenu";
import { roundVec2 } from "../util";
import { gameState } from "../state";

k.scene("game", (level = "Level_0") => {
  gameState.currentLevel = level;

  const map = addMap(level);

  addPauseMenu();

  addCameraControls();
  setCameraControlsEnabled(false);
  setCameraUpdateEnabled(false);

  const mapCenter = map.mapCenter;

  k.tween(
    k.vec2(-200, 2000),
    mapCenter,
    2.5,
    (p) => k.setCamPos(roundVec2(p)),
    k.easings.easeOutQuart
  ).then(() => {
    setCameraTarget(mapCenter);
    setCameraControlsEnabled(true);
    setCameraUpdateEnabled(true);
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
      .getCamPos()
      .sub(k.width() / 2, k.height() / 2)
      .add(k.vec2(8, 8));
  });

  k.on("level_finish", "player", async () => {
    await k.wait(2);
    setCameraControlsEnabled(false);
    console.log("Level finished!");

    await k.tween(
      k.getCamPos(),
      k.vec2(400, -2000),
      3,
      (p) => k.setCamPos(roundVec2(p)),
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
