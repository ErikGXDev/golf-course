import k from "../kaplay";
import { addMap } from "../map";
import {
  addCameraControls,
  setCameraControlsEnabled,
  setCameraTarget,
  setCameraUpdateEnabled,
} from "../objects/camera";
import { addFakeMouse, getFakeMouse } from "../objects/mouse";
import { addPauseMenu } from "../objects/menu/pauseMenu";
import { getFirst } from "../util";
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
    (p) => {
      k.setCamPos(p);
    },
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

  fpsText.onUpdate(() => {
    fpsText.text = `FPS: ${Math.round(k.debug.fps())}`;
    fpsText.pos = k
      .getCamPos()
      .sub(k.width() / 2, k.height() / 2)
      .add(k.vec2(8, 8));
  });

  k.on("level_finish", "player", async () => {
    console.log("Level finished");

    const player = getFirst("player");

    setCameraControlsEnabled(false);
    setCameraUpdateEnabled(false);

    k.tween(
      k.getCamPos(),
      player.pos,
      1.5,
      (p) => k.setCamPos(p),
      k.easings.easeOutSine
    );

    await k.wait(2);

    await k.tween(
      k.getCamPos(),
      k.vec2(800, -2000),
      3,
      (p) => k.setCamPos(p),
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
