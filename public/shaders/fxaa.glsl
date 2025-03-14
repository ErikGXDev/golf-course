uniform vec2 u_resolution;

// More aggressive parameters for better coverage
const float FXAA_SPAN = 16.0;          // Reduced for more precise sampling
const float FXAA_REDUCE = 1.0;         // More aggressive reduction
const float FXAA_BOOST = 2.0;          // Stronger edge enhancement
const float BLEND_FACTOR = 0.2;       // Stronger blending

// Even lower thresholds for more sensitive detection
const float CONTRAST_THRESHOLD = 0.01;  // More sensitive edge detection
const float RELATIVE_THRESHOLD = 0.05;  // More aggressive relative threshold

vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
  vec2 texel = 1.0 / u_resolution;

    // Sample in a wider pattern including diagonals
  vec4 center = texture2D(tex, uv);
  vec4 north = texture2D(tex, uv + vec2(0.0, texel.y));
  vec4 south = texture2D(tex, uv - vec2(0.0, texel.y));
  vec4 east = texture2D(tex, uv + vec2(texel.x, 0.0));
  vec4 west = texture2D(tex, uv - vec2(texel.x, 0.0));
  vec4 nw = texture2D(tex, uv + vec2(-texel.x, texel.y));
  vec4 ne = texture2D(tex, uv + vec2(texel.x, texel.y));
  vec4 sw = texture2D(tex, uv + vec2(-texel.x, -texel.y));
  vec4 se = texture2D(tex, uv + vec2(texel.x, -texel.y));

    // Enhanced luminance calculation
  float lumCenter = dot(center.rgb, vec3(0.2126, 0.7152, 0.0722));
  float lumNorth = dot(north.rgb, vec3(0.2126, 0.7152, 0.0722));
  float lumSouth = dot(south.rgb, vec3(0.2126, 0.7152, 0.0722));
  float lumEast = dot(east.rgb, vec3(0.2126, 0.7152, 0.0722));
  float lumWest = dot(west.rgb, vec3(0.2126, 0.7152, 0.0722));
  float lumNW = dot(nw.rgb, vec3(0.2126, 0.7152, 0.0722));
  float lumNE = dot(ne.rgb, vec3(0.2126, 0.7152, 0.0722));
  float lumSW = dot(sw.rgb, vec3(0.2126, 0.7152, 0.0722));
  float lumSE = dot(se.rgb, vec3(0.2126, 0.7152, 0.0722));

    // Improved contrast detection including diagonals
  float minLum = min(lumCenter, min(min(lumNorth, lumSouth), min(min(lumEast, lumWest), min(min(lumNW, lumNE), min(lumSW, lumSE)))));
  float maxLum = max(lumCenter, max(max(lumNorth, lumSouth), max(max(lumEast, lumWest), max(max(lumNW, lumNE), max(lumSW, lumSE)))));
  float lumRange = maxLum - minLum;

  if(lumRange < max(CONTRAST_THRESHOLD, maxLum * RELATIVE_THRESHOLD)) {
    return center;
  }

    // Enhanced direction detection including diagonals
  vec2 dir;
  dir.x = -((lumNorth + lumNE + lumNW) - (lumSouth + lumSE + lumSW));
  dir.y = ((lumEast + lumNE + lumSE) - (lumWest + lumNW + lumSW));

    // More aggressive direction adjustment
  float dirReduce = max((lumNorth + lumSouth + lumEast + lumWest +
    lumNW + lumNE + lumSW + lumSE) * 0.125 * FXAA_REDUCE, 1.0);
  float stepLength = min(abs(dir.x), abs(dir.y)) + dirReduce;

  dir = min(vec2(FXAA_SPAN), max(vec2(-FXAA_SPAN), dir * FXAA_BOOST / (stepLength + 0.0001))) * texel;

    // More samples for better blending
  vec4 result1 = 0.5 * (texture2D(tex, uv + dir * 0.5) +
    texture2D(tex, uv - dir * 0.5));

  vec4 result2 = result1 * 0.75 + 0.25 * (texture2D(tex, uv + dir * 1.5) +
    texture2D(tex, uv - dir * 1.5));

  return mix(center, result2, BLEND_FACTOR);
}