import { GameObj, Vec2 } from "kaplay";
import k from "../kaplay";
import { roundVec2 } from "../util";

let targetCamPos = k.vec2(0, 0);
let cameraControlsEnabled = true;

export function addCameraControls() {
  const CAM_SPEED = 500;
  cameraControlsEnabled = true;

  k.onKeyDown(["up", "w"], () => {
    if (!cameraControlsEnabled) return;
    targetCamPos.y -= CAM_SPEED * k.dt();
  });

  k.onKeyDown(["down", "s"], () => {
    if (!cameraControlsEnabled) return;
    targetCamPos.y += CAM_SPEED * k.dt();
  });

  k.onKeyDown(["left", "a"], () => {
    if (!cameraControlsEnabled) return;
    targetCamPos.x -= CAM_SPEED * k.dt();
  });

  k.onKeyDown(["right", "d"], () => {
    if (!cameraControlsEnabled) return;
    targetCamPos.x += CAM_SPEED * k.dt();
  });

  k.onUpdate(() => {
    if (!cameraControlsEnabled) return;

    let newCamPos = k.lerp(k.camPos(), targetCamPos, 0.1);

    if (newCamPos.dist(targetCamPos) < 0.03) {
      targetCamPos = newCamPos;
    }

    k.camPos(roundVec2(newCamPos));
  });

  k.onKeyPress("c", () => {
    console.log(k.camPos(), targetCamPos);
  });
}

export function setCameraControlsEnabled(enabled: boolean) {
  cameraControlsEnabled = enabled;
}

export function setCameraTarget(pos: Vec2) {
  targetCamPos = pos;
}
