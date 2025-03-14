import { Color, Vec2 } from "kaplay";
import k from "../kaplay";

const BASE_SEGMENTS = 32;
const TWO_PI = Math.PI * 2;

// k.drawCircle() was too slow
export function drawCircleOptimized(opt: {
  pos: Vec2;
  radius: number;
  color: Color;
  segments?: number;
}) {
  const offset = k.vec2(0.5);

  const points = getCirclePts(
    offset,
    opt.radius,
    opt.segments ?? BASE_SEGMENTS
  );

  k.drawPolygon({
    pos: opt.pos,
    color: opt.color,
    pts: points,
  });
}

// Calculate segments based on segment line length
const SEGMENT_LENGTH = 16;
export function calculateSegments(radius: number): number {
  // Circumference of the circle
  const circumference = TWO_PI * radius;

  // Number of segments needed for desired segment length
  const segments = Math.ceil(circumference / SEGMENT_LENGTH);

  // Clamp between reasonable min/max values
  const MIN_SEGMENTS = 6;
  const MAX_SEGMENTS = 72;

  return Math.min(Math.max(segments, MIN_SEGMENTS), MAX_SEGMENTS);
}

export function getCirclePts(
  pos: Vec2,
  radius: number,
  segments: number
): Vec2[] {
  const pts: Vec2[] = [];
  const step = TWO_PI / segments;

  // Pre-calculate sin and cos of step
  const stepCos = Math.cos(step);
  const stepSin = Math.sin(step);

  // Initial vector
  let x = radius; // cos(0) = 1
  let y = 0; // sin(0) = 0

  for (let i = 0; i <= segments; i++) {
    pts.push(pos.add(x, y));

    // Rotate using pre-calculated values
    const nextX = x * stepCos - y * stepSin;
    y = x * stepSin + y * stepCos;
    x = nextX;
  }

  return pts;
}
