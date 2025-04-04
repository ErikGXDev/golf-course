import { Vec2 } from "kaplay";
import k from "../kaplay";
import { roundVec2 } from "../util";

let targetCamPos = k.vec2(0, 0);
let cameraControlsEnabled = true;
let cameraUpdateEnabled = true;

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

  const STICK_SPEED = 700;
  k.onGamepadStick("right", (pos) => {
    if (!cameraControlsEnabled) return;
    if (pos.dist(k.vec2(0)) < 0.2) return;

    const gamepadPos = pos.scale(STICK_SPEED * k.dt());

    targetCamPos = targetCamPos.add(gamepadPos);
  });

  k.onUpdate(() => {
    if (!cameraUpdateEnabled) return;

    let newCamPos = k.lerp(k.getCamPos(), targetCamPos, 0.1);

    if (newCamPos.dist(targetCamPos) < 0.03) {
      targetCamPos = newCamPos;
    }

    k.setCamPos(roundVec2(newCamPos));
  });

  k.onKeyPress("c", () => {
    console.log(k.getCamPos(), targetCamPos);
  });
}

export function setCameraControlsEnabled(enabled: boolean) {
  cameraControlsEnabled = enabled;
}

export function getCameraControlsEnabled() {
  return cameraControlsEnabled;
}

export function setCameraTarget(pos: Vec2) {
  targetCamPos = pos;
}

export function getCameraTarget() {
  return targetCamPos;
}

export function setCameraUpdateEnabled(enabled: boolean) {
  cameraUpdateEnabled = enabled;
}

export function getCameraUpdateEnabled() {
  return cameraUpdateEnabled;
}
