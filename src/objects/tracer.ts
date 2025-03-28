import k from "../kaplay";
import { GameObj, Vec2 } from "kaplay";
import { drawCircleOptimized } from "../gfx/draw";
import { getFakeMousePos } from "./mouse";

/*
export function drawTracer(origin: Vec2, direction: Vec2, depth: number) {
  destroyTracer();
  addTracer(origin, direction, depth);
  console.log("Draw Tracer");

  //drawTracerRecursive(origin, direction, 0, depth);
  // const newVelocity = player.vel.reflect(normal).scale(0.8);
}
  */

export function addTracer(player: GameObj, depth: number) {
  const tracer = k.add([
    k.pos(0, 0),
    "tracer_obj",
    {
      circleGap: 50,
    },
  ]);

  let tracerAngle = 0;
  tracer.onDraw(async () => {
    const playerPos = player.pos;
    const mousePos = getFakeMousePos();

    const power = k.clamp(playerPos.dist(mousePos) - 32, 0, 100);

    if (power == 0) return;

    const angle = playerPos.angle(mousePos);
    // Angle smoothing
    tracerAngle = k.lerp(tracerAngle, angle, 0.1);

    drawTracerLoop(player.pos, angle, depth, tracer.circleGap);
  });
}

export function setTracerCircleGap(circleGap: number) {
  const tracers = k.get("tracer_obj");

  if (tracers.length === 0) return;

  const tracer = tracers[0];
  tracer.circleGap = circleGap;
}

export function destroyTracer() {
  k.destroyAll("tracer_obj");
}

export async function drawTracerLoop(
  startPos: Vec2,
  angle: number,
  depth: number,
  circleGap: number = 50
) {
  const LIMIT = 7;
  let totalCircles = 0;

  let direction = k.Vec2.fromAngle(angle);

  //const circleShape = new k.Circle(k.vec2(0, 0), 14);

  for (let i = 0; i < depth; i++) {
    const result = k.raycast(startPos, direction.scale(40000), [
      "golfball",
      "hole",
      "logic_button",
    ]);

    if (result) {
      const colPos = result.point;

      //const normalAngle = k.vec2(0, 0).angle(result.normal);

      const ballRadius = 14;

      /*
      NOTE: Old code, keeping it in case I change the golf ball collision shape

      // Because of the golf ball size, we need to add a small offset to the collision position.
      // so we need to "backtrack" the path from the collision position to the start position by 16 units.
      // Calculate the offset based on the angle
      
      let angle = k.deg2rad(normalAngle) % (2 * Math.PI);

      if (angle < 0) angle += 2 * Math.PI;

      // Calculate the distance from the center to the edge of the square
      const diagonalAngle = Math.atan2(ballRadius, ballRadius);
      let distanceToEdge;

      if (angle < diagonalAngle || angle > 2 * Math.PI - diagonalAngle) {
        distanceToEdge = ballRadius / Math.cos(angle);
      } else if (angle < Math.PI - diagonalAngle) {
        distanceToEdge = ballRadius / Math.sin(angle);
      } else if (angle < Math.PI + diagonalAngle) {
        distanceToEdge = ballRadius / -Math.cos(angle);
      } else {
        distanceToEdge = ballRadius / -Math.sin(angle);
      }

      // offset = result.normal.scale(8);

      // Calculate the offset based on the angle and distance to the edge
      const offsetX = distanceToEdge * Math.cos(angle);
      const offsetY = distanceToEdge * Math.sin(angle);
      const offset = k.vec2(offsetX, offsetY);

      const newHitPos = colPos.sub(offset);*/

      const newHitPos = result.normal.scale(ballRadius).add(colPos);

      // Get length of the ray.
      const rayLength = startPos.dist(newHitPos);

      const amountOfCircles = rayLength / circleGap;

      // Place circles along the path of the tracer in a set interval.
      for (let j = 1; j < amountOfCircles; j++) {
        // Stop drawing the tracer if we reach the limit
        if (totalCircles >= LIMIT) {
          return;
        }

        /*
        let pos;

        // Dont use newHitPos if there distance is too short to reach the collision point
        if (
          i === 0 &&
          newHitPos.dist(startPos) >
            startPos.dist(
              startPos.lerp(newHitPos, (LIMIT + 1) / amountOfCircles)
            )
        ) {
          const direction = startPos.sub(result.point).unit().scale(-1);
          const rayLen = startPos.dist(result.point);
          pos = direction.scale((j * rayLen) / amountOfCircles).add(startPos);
        } else {
          pos = startPos.lerp(newHitPos, j / amountOfCircles);
        }
        */
        let pos = startPos.lerp(newHitPos, j / amountOfCircles);

        let offset = Math.max(
          0,
          Math.sin(totalCircles * 0.9 + k.time() * -3) * 1.5
        );

        drawCircleOptimized({
          pos: pos,
          color: k.rgb("#1f102a"),
          radius: 4 + offset,
          segments: 45,
        });

        drawCircleOptimized({
          pos: pos,
          color: k.rgb("#ffffff"),
          radius: 2 + offset,
          segments: 45,
        });

        totalCircles++;
      }

      drawCircleOptimized({
        pos: newHitPos,
        color: k.rgb("#1f102a"),
        radius: 7,
        segments: 45,
      });

      drawCircleOptimized({
        pos: newHitPos,
        color: k.rgb("#ffffff"),
        radius: 5,
        segments: 20,
      });

      const newDirection = direction.reflect(result.normal).scale(0.8);

      startPos = newHitPos;
      direction = newDirection;
    }
  }
}

/*
export function drawTracerRecursive(
  origin: Vec2,
  direction: Vec2,
  depth: number,
  maxDepth: number
) {
  const result = k.raycast(origin, direction.scale(400), [
    "golfball",
    "debug_obj",
    "hole",
    "special",
  ]);

  if (result && depth < maxDepth) {
    const colPos = result.point;

    // Because of the golf ball size, we need to add a small offset to the collision position.
   
    const newHitPos = colPos;

    // Get length of the ray.
    const rayLength = origin.dist(newHitPos);

    const amountOfCircles = rayLength / 40;

    // Place circles along the path of the tracer in a set interval.
    for (let i = 1; i < amountOfCircles; i++) {
      let pos = origin.lerp(newHitPos, i / amountOfCircles);

      let offset = 0; //Math.max(0, Math.sin(i * 0.9 + k.time() * -3) * 1.5);

      k.drawCircle({
        pos: pos,
        color: k.rgb("#1f102a"),
        radius: 4 + offset,
      });

      k.drawCircle({
        pos: pos,
        color: k.rgb("#ffffff"),
        radius: 2 + offset,
      });
    }

    k.drawCircle({
      pos: newHitPos,
      color: k.rgb("#1f102a"),
      radius: 7,
    });

    k.drawCircle({
      pos: newHitPos,
      color: k.rgb("#ffffff"),
      radius: 5,
    });

    const newDirection = direction.reflect(result.normal).scale(0.8);

    drawTracerRecursive(newHitPos, newDirection, depth + 1, maxDepth);
  }
}
*/
