import { Vec2 } from "kaplay";
import k from "../kaplay";
import { addTracer, destroyTracer, setTracerCircleGap } from "./tracer";
import { getFakeMousePos, setFakeCursor } from "./mouse";
import { controllerComp as controllerSupportComp } from "./controllerSupport";

export function addGolfBall(pos: Vec2) {
  const player = k.add([
    k.sprite("golfball"),
    //k.circle(16),
    //k.color("#1f102a"),
    k.pos(pos),
    k.anchor("center"),
    k.body(),
    k.scale(1),
    k.area({
      shape: new k.Circle(k.vec2(0, 0), 14),
    }),
    k.state("idle", ["idle", "dragging", "rolling", "finished"]),
    "golfball",
    "player",
    controllerSupportComp(),
  ]);

  player.onDraw(() => {});

  // Bounciness
  player.restitution = 1;

  //player.add([k.circle(11), k.color("#ffffff")]);

  //#region Controls
  player.onHover(() => {
    if (player.state === "idle") {
      setFakeCursor("pointer");
    }
  });

  player.onHoverEnd(() => {
    if (player.state === "idle") {
      setFakeCursor("cursor");
    }
  });

  player.onMouseDown((m) => {
    if (m === "left" && player.isHovering() && player.state === "idle") {
      player.enterState("dragging");
    } else if (m === "right" && player.state === "dragging") {
      player.enterState("idle");
    }
  });

  player.onMouseRelease(() => {
    if (player.state === "dragging") {
      player.trigger("shoot");
    }
  });

  player.on("shoot", () => {
    const playerPos = player.pos;
    const releasePos = getFakeMousePos();

    const power = k.clamp(playerPos.dist(releasePos) - 32, 0, 100);

    if (power == 0) {
      /* If the cursor is basically on top of the golf ball, don't do anything.
           The player should drag the golf ball a bit further to apply power.*/
      player.enterState("idle");
      return;
    }

    // Calculate the velocity of the golf ball based on the power
    const velocity = playerPos
      .sub(releasePos)
      .unit()
      .scale(k.clamp(power, 5, 100) * 15);

    // Same as player.vel = velocity, but might as well use built-in functions
    player.applyImpulse(velocity);

    player.enterState("rolling");
  });

  //#endregion Controls

  //#region Logic
  player.onStateEnter("idle", () => {
    player.vel = k.vec2(0, 0);
  });

  player.onStateEnter("dragging", () => {
    setFakeCursor("drag");
    addTracer(player, 2);
  });

  player.onStateUpdate("dragging", () => {
    const playerPos = player.pos;
    const mousePos = getFakeMousePos();

    const dist = playerPos.dist(mousePos);

    const realDist = k.clamp(dist - 32, 0, 100);

    setTracerCircleGap(k.map(realDist, 0, 100, 20, 50));
  });

  player.onStateEnd("dragging", () => {
    setFakeCursor("cursor");
    destroyTracer();
  });

  player.onStateEnter("rolling", () => {
    k.play("click", {
      volume: 0.4,
      detune: k.randi(0, 3) * 100,
    });
  });

  player.onStateUpdate("rolling", () => {
    const drag = 1.5;

    player.vel = player.vel.scale(1 - k.dt() * drag);

    //player.moveBy(player.velocity.scale(k.dt()));

    if (player.vel.len() < 12) {
      player.enterState("idle");
    }
  });

  player.onStateEnd("rolling", () => {
    if (player.isHovering()) {
      setFakeCursor("pointer");
    }
  });

  player.onCollide("solid", () => {
    player.vel = player.vel.scale(0.8);
    k.play("quiet_click_eq", {
      volume: 0.8,
      detune: k.randi(-3, -6) * 100,
    });
  });

  player.onCollide("hole", async (obj) => {
    player.vel = k.vec2(0, 0);

    player.enterState("finished");

    await k.tween(
      player.pos,
      obj.pos,
      0.75,
      (p) => (player.pos = p),
      k.easings.easeOutElastic
    );
    await k.wait(0.5);
    await k.tween(
      player.scale,
      k.vec2(0, 0),
      1,
      (p) => (player.scale = p),
      k.easings.easeInBounce
    );
  });

  player.onStateEnter("finished", () => {
    player.trigger("level_finish");
  });
}
