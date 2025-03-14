uniform vec2 u_resolution;

const float EDGE_THRESHOLD = 0.05;        // Edge detection sensitivity
const vec3 LUMINANCE_WEIGHTS = vec3(0.2126, 0.7152, 0.0722); // BT.709 weights

float getLuminance(vec4 color) {
  return dot(color.rgb, LUMINANCE_WEIGHTS);
}

float detectEdge(vec4 center, vec4 north, vec4 south, vec4 east, vec4 west) {
  float lumCenter = getLuminance(center);
  float lumNorth = getLuminance(north);
  float lumSouth = getLuminance(south);
  float lumEast = getLuminance(east);
  float lumWest = getLuminance(west);

    // Calculate local contrast
  float verticalContrast = abs(lumNorth - lumSouth);
  float horizontalContrast = abs(lumEast - lumWest);

    // Calculate edge strength
  float edgeStrength = max(verticalContrast, horizontalContrast);

    // Normalize and smooth the edge detection
  return smoothstep(0.0, EDGE_THRESHOLD, edgeStrength);
}

vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
  vec2 texel = 1.0 / u_resolution;

  vec4 center = def_frag();
  vec4 north = texture2D(tex, uv + vec2(0.0, texel.y));
  vec4 south = texture2D(tex, uv - vec2(0.0, texel.y));
  vec4 east = texture2D(tex, uv + vec2(texel.x, 0.0));
  vec4 west = texture2D(tex, uv - vec2(texel.x, 0.0));

  vec4 mixH = mix(east, west, 0.5);
  vec4 mixV = mix(north, south, 0.5);
  vec4 mixHV = mix(mixH, mixV, 0.5);

    // Get edge strength and use it to control blending
  float edgeStrength = detectEdge(center, north, south, east, west);

  return mix(center, mixHV, edgeStrength * 0.5);
}