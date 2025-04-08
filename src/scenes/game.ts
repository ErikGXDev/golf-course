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
import { getFirst } from "../util";
import { gameState } from "../state";
import { addInfoBox } from "../objects/infoBox";

k.scene("game", (level = "Level_0") => {
  gameState.currentLevel = level;

  const map = addMap(level);

  addPauseMenu();

  addCameraControls();

  setCameraControlsEnabled(false);
  setCameraUpdateEnabled(false);

  const mapCenter = map.mapCenter;

  k.tween(
    k.vec2(-400, k.height() + map.height / 2 + 300),
    mapCenter,
    2,
    (p) => {
      k.setCamPos(p);
    },
    k.easings.easeInOutQuad
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
      1,
      (p) => k.setCamPos(p),
      k.easings.easeOutSine
    );

    await k.wait(1.8);

    await k.tween(
      k.getCamPos(),
      k.vec2(k.getCamPos().x + 600, -k.width() / 2 - 100),
      1.5,
      (p) => {
        k.setCamPos(p);
      },
      k.easings.easeInOutQuad
    );

    map.islandWaveLoop.cancel();

    if (map.isEnd) {
      k.go("game_end");
    } else {
      k.go("game", map.nextLevel);
    }
  });

  if (map.isEnd) {
    const hole = getFirst("hole");

    if (!hole) {
      return;
    }

    addInfoBox(hole.pos.add(0, -50), "This is the\nlast level!");
  }

  k.onKeyPress("g", () => {
    k.go("game", map.nextLevel);
  });

  k.onKeyPress("r", () => {
    k.go("game", level);
  });

  addFakeMouse();
});
