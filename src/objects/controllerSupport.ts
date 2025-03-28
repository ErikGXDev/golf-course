import { GameObj } from "kaplay";
import k from "../kaplay";
import { worldMousePos } from "../util";
import { setCameraControlsEnabled, setCameraTarget } from "./camera";
import { getFakeMouse } from "./mouse";
import { registerMidiEvent } from "./midiControls";

export function controllerComp() {
  return {
    id: "controllerSupportComp",
    add(this: GameObj) {
      const player = this;

      player.useController = false;
      player.controllerPos = k.vec2(0, 0);

      function startControllerDragging() {
        const mouse = getFakeMouse();

        if (!mouse) return;

        if (player.state === "idle") {
          player.enterState("dragging");
        }

        setCameraControlsEnabled(false);
        setCameraTarget(player.pos);

        mouse.paused = true;
        mouse.pos = player.pos;

        player.useController = true;
      }

      function stopControllerDragging() {
        const mouse = getFakeMouse();

        if (!mouse) return;

        if (player.state === "dragging") {
          player.enterState("idle");
        }

        setCameraControlsEnabled(true);

        mouse.paused = false;
        mouse.pos = worldMousePos();

        player.useController = false;
      }

      player.onKeyPress("space", () => {
        toggleDragging();
      });

      function toggleDragging() {
        if (player.state === "rolling") return;

        const mouse = getFakeMouse();

        if (!mouse) return;

        if (player.useController) {
          player.trigger("shoot");
          stopControllerDragging();
          return;
        }

        startControllerDragging();
      }

      player.onMouseMove(() => {
        if (player.useController) {
          stopControllerDragging();
        }
      });

      let controllerDist = 0;
      let controllerAngle = 90;

      // Increase distance from the player
      const DISTANCE_SPEED = 100;

      player.onUpdate(() => {
        if (!player.useController) return;

        const mouse = getFakeMouse();

        if (!mouse) return;

        const dist = controllerDist;
        const angle = controllerAngle;

        player.controllerPos = player.pos.add(
          k.Vec2.fromAngle(angle).scale(dist)
        );

        mouse.pos = player.controllerPos;
      });

      //#region Keyboard

      player.onKeyDown(["up", "w"], () => {
        const mouse = getFakeMouse();

        if (!mouse) return;

        controllerDist += DISTANCE_SPEED * k.dt();

        controllerDist = k.clamp(controllerDist, 0, 132);
      });

      player.onKeyDown(["down", "s"], () => {
        const mouse = getFakeMouse();

        if (!mouse) return;

        controllerDist -= DISTANCE_SPEED * k.dt();

        controllerDist = k.clamp(controllerDist, 0, 132);
      });

      // Move the fakeMouse in a circle around the player
      const ROTATION_SPEED = 120;

      player.onKeyDown(["left", "a"], () => {
        const mouse = getFakeMouse();

        if (!mouse) return;

        controllerAngle -= ROTATION_SPEED * k.dt();
      });

      player.onKeyDown(["right", "d"], () => {
        const mouse = getFakeMouse();

        if (!mouse) return;

        controllerAngle += ROTATION_SPEED * k.dt();
      });

      //#region Midi

      function onMIDIMessage(event: MIDIMessageEvent) {
        if (!event.data) {
          return;
        }

        const [command, key, velocity] = event.data;

        console.log("MIDI", command, key, velocity);

        // Knobs
        if (command === 176) {
          if (key === 74) {
            controllerDist = k.map(velocity, 0, 127, 0, 132);
          }
          if (key === 75) {
            controllerAngle = k.map(velocity, 0, 127, 0, 360);
          }
        }

        // Pads
        if (command === 153) {
          if (key === 54) {
            console.log("Pad 1");
            toggleDragging();
          }
        }

        if (command === 144) {
          if (key === 60) {
            console.log("Key 1");
            toggleDragging();
          }
        }

        // Joystick
        if (command === 176 && key === 1) {
          controllerDist = k.map(velocity, 0, 127, 0, 132);
        }

        if (command === 224) {
          controllerAngle = k.map(velocity, 0, 127, 0, 360);
        }
      }

      registerMidiEvent(onMIDIMessage);

      //#region Gamepad

      k.onGamepadStick("left", (pos) => {
        const gamepadPos = pos.scale(132).add(player.pos);
        const angle = gamepadPos.angle(player.pos);
        const dist = gamepadPos.dist(player.pos);

        controllerDist = dist;
        controllerAngle = angle;
      });

      k.onGamepadButtonPress("south", () => {
        toggleDragging();
      });

      k.onGamepadButtonPress("east", () => {
        toggleDragging();
      });
    },
    useController: false,
    controllerPos: k.vec2(0, 0),
  };
}
