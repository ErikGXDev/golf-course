uniform vec2 u_quad_pos;

uniform vec2 u_quad_size;

uniform vec2 u_resolution;

uniform float u_shadow_length;

uniform float u_direction;

uniform float u_quality;

uniform vec3 u_target_color;
vec4 targetColor = vec4(u_target_color / 255.0, 1.0);

uniform vec3 u_exclude_color;
vec4 excludeColor = vec4(u_exclude_color / 255.0, 1.0);

vec4 shadowColor = vec4(0.0, 0.0, 0.0, 1.0);

// Increase if needed
const int MAX_SHADOW_LENGTH = 256;

// Convert global UV coordinates to local UV coordinates
vec2 toLocalUV(vec2 uv) {
  return (uv - u_quad_pos) / u_quad_size;
}

// Convert local UV coordinates to global UV coordinates
vec2 toGlobalUV(vec2 localUV) {
  return localUV * u_quad_size + u_quad_pos;
}

vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {

  vec4 currentColor = def_frag();

  if(distance(currentColor, excludeColor) < 0.01) {
    return currentColor;
  }

  if(distance(currentColor, targetColor) < 0.01) {
    return currentColor;
  }

  vec2 uvFactor = 1.0 / u_resolution;

  float angleRad = radians(u_direction);
  vec2 direction = vec2(cos(angleRad), sin(angleRad));

  bool isShadow = false;

  vec2 uvPos = toLocalUV(uv);
  vec2 uvScreenPos = uvPos * u_resolution;

  for(int i = 0; i < MAX_SHADOW_LENGTH; i++) {
    if(float(i) >= u_shadow_length * u_quality) {
      break;
    }

    uvScreenPos += direction / u_quality;

    uvPos += (uvFactor * direction) / float(u_quality);

    vec4 shadowColor = texture2D(tex, toGlobalUV(uvPos));

    if(uvPos.x < 0.0 || uvPos.x > 1.0 || uvPos.y < 0.0 || uvPos.y > 1.0) {
      break;
    }

    if(distance(shadowColor, targetColor) < 0.01) {
      isShadow = true;
      break;
    }

  }

  if(isShadow) {
    return mix(currentColor, shadowColor, 0.33);
  } else {
    return currentColor;
  }

}