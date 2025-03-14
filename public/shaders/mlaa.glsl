uniform vec2 u_resolution;

// Adjusted constants for smoother edges
const float EDGE_THRESHOLD = 0.05;        // More sensitive threshold
const int MAX_SEARCH_STEPS = 8;           // More search steps
const float MAX_SEARCH_LENGTH = 8.0;      // Increased search range
const float BLEND_FACTOR = 0.75;          // Stronger blending

// Helper functions
vec2 uvToPixel(vec2 uv) {
  return uv * u_resolution;
}

vec2 pixelToUV(vec2 pixel) {
  return pixel / u_resolution;
}

vec2 neighbourPixelUV(vec2 uv, vec2 offset) {
  return pixelToUV(uvToPixel(uv) + offset);
}

float luminance(vec4 color) {
  return dot(color.rgb, vec3(0.299, 0.587, 0.114));
}

// Enhanced edge detection
bool isEdge(float delta) {
    // Add smoothing to edge detection
  float smoothDelta = smoothstep(0.0, EDGE_THRESHOLD, abs(delta));
  return smoothDelta > 0.5;
}

// Search for edge end
float searchLength(vec2 texCoord, vec2 dir, sampler2D tex) {
  float length = 0.0;
  float prevLum = luminance(texture2D(tex, texCoord));
  vec2 step = dir / float(MAX_SEARCH_STEPS);

  for(int i = 1; i < MAX_SEARCH_STEPS; i++) {
    vec2 currentCoord = texCoord + step * float(i);
    float currentLum = luminance(texture2D(tex, currentCoord));
    float delta = currentLum - prevLum;

    if(!isEdge(delta)) {
            // Interpolate for smoother transition
      float t = abs(delta) / EDGE_THRESHOLD;
      length = float(i - 1) + smoothstep(0.0, 1.0, t);
      break;
    }
    prevLum = currentLum;
  }

  return (length / float(MAX_SEARCH_STEPS)) * MAX_SEARCH_LENGTH;
}

vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
  vec4 center = texture2D(tex, uv);

    // Sample neighboring pixels using neighbourPixelUV
  vec4 up = texture2D(tex, neighbourPixelUV(uv, vec2(0.0, 1.0)));
  vec4 down = texture2D(tex, neighbourPixelUV(uv, vec2(0.0, -1.0)));
  vec4 left = texture2D(tex, neighbourPixelUV(uv, vec2(-1.0, 0.0)));
  vec4 right = texture2D(tex, neighbourPixelUV(uv, vec2(1.0, 0.0)));

    // Calculate luminance differences
  float lumCenter = luminance(center);
  float lumUp = luminance(up);
  float lumDown = luminance(down);
  float lumLeft = luminance(left);
  float lumRight = luminance(right);

    // Enhanced edge detection with gradient analysis
  vec2 gradient;
  gradient.x = (lumRight - lumLeft) * 0.5;
  gradient.y = (lumUp - lumDown) * 0.5;
  float gradientMagnitude = length(gradient);

    // Adjust edge detection threshold based on gradient
  bool horizontal = isEdge(lumUp - lumDown) && gradientMagnitude > EDGE_THRESHOLD;
  bool vertical = isEdge(lumLeft - lumRight) && gradientMagnitude > EDGE_THRESHOLD;

  if(!horizontal && !vertical) {
    return center;
  }

  vec2 dir = vec2(0.0);
  if(horizontal) {
    float upLength = searchLength(uv, vec2(0.0, 1.0), tex);
    float downLength = searchLength(uv, vec2(0.0, -1.0), tex);
    dir.y = (upLength - downLength) * smoothstep(0.0, 2.0, abs(upLength - downLength));
  }
  if(vertical) {
    float rightLength = searchLength(uv, vec2(1.0, 0.0), tex);
    float leftLength = searchLength(uv, vec2(-1.0, 0.0), tex);
    dir.x = (rightLength - leftLength) * smoothstep(0.0, 2.0, abs(rightLength - leftLength));
  }

    // Smoother blending with adaptive factor
  float blendStrength = BLEND_FACTOR * (1.0 - smoothstep(0.0, 0.1, gradientMagnitude));
  vec4 blended = mix(center, texture2D(tex, neighbourPixelUV(uv, dir)), blendStrength);

  return blended;
}