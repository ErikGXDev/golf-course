// Old and broken shader, do not use.

// Resolution of the texture/sprite
// Can be retrieved with obj.width and obj.height in kaplay
uniform vec2 u_resolution;

// The color of the shadow.
// Could be changed to a uniform
vec4 u_shadow_color = vec4(0.0, 0.0, 0.0, 1);

// A Caster is a pixel that is supposed to cast a shadow
// It will not be shaded, but will be used to determine if other pixels should be shaded
uniform float u_shadow_caster_color[3];

// This color will be excluded from any shading.
// Useful if your walls or other objects that are supposed to cast shadows
// have another color that should be ignored
uniform float u_shadow_exclude_color[3];

// Shadow length in pixels
uniform float u_shadow_length;

// Maximum shadow length in pixels
// Needed because uniforms dont work for loops,
// increase this number when needed.
const int MAX_SHADOW_LENGTH = 24;

// Angle of the shadow in degrees. 0° = up (broken right now, use trial and error)
uniform float u_shadow_angle;

// Utility functions for accessing UV and Pixel space

vec2 uvToPixel(vec2 uv) {
  // Convert UV coordinates to pixel coordinates
  vec2 pixelCoord = uv * u_resolution;
  return pixelCoord;
}

vec2 pixelToUV(vec2 pixelCoord) {
  // Convert pixel coordinates to UV coordinates
  vec2 uv = pixelCoord / u_resolution;
  return uv;
}

// If the pixel has a color that is present in the shadow_caster_colors array
// It is considered a caster and will not be shaded.
bool isCasterColor(vec4 color) {

  bool isCaster = false;

  vec4 shadow_caster_color = vec4(u_shadow_caster_color[0] / 255.0, u_shadow_caster_color[1] / 255.0, u_shadow_caster_color[2] / 255.0, 1);

  if(distance(color, shadow_caster_color) < 0.01) {
    isCaster = true;
  }

  return isCaster;
}

vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {

  vec4 shadow_exclude_color = vec4(u_shadow_exclude_color[0] / 255.0, u_shadow_exclude_color[1] / 255.0, u_shadow_exclude_color[2] / 255.0, 1);

  // Get the default color of the pixel
  vec4 fragmentColor = def_frag();

  // If the pixel is the exclude color, return the default color
  if(distance(fragmentColor, shadow_exclude_color) < 0.01) {
    return fragmentColor;
  }

  // Calculate the direction of the shadow
  float angle = u_shadow_angle + 90.0;
  float rad = radians(angle);

// Calculate direction in pixel space
// No aspect ratio adjustment needed since we're already in pixel coordinates
  vec2 direction = vec2(cos(rad), sin(rad));

// Normalize to maintain consistent length
  direction = normalize(direction);

  bool isShadow = false;

  // Get pixel position of the current pixel from UV
  vec2 pixel_pos = uvToPixel(uv);
  // "Raycast" our way to a solid pixel

  for(int i = 0; i < MAX_SHADOW_LENGTH; i++) {

    // Break if the shadow length is reached
    if(float(i) > float(u_shadow_length)) {
      break;
    }

    // Calculate the pixel position of a potential solid pixel
    vec2 test_pixel_pos = pixel_pos + (direction * float(i));

    // Convert the pixel position to UV coordinates
    vec2 test_uv = pixelToUV(test_pixel_pos);

    // Break if the pixel we're checking is outside the texture
    if(test_uv.x <= 0.0 || test_uv.x >= 1.0 || test_uv.y <= 0.0 || test_uv.y >= 1.0) {
      break;
    }

    // Get the color of the potential solid pixel
    vec4 texColor = texture2D(tex, test_uv);

    // Check if the pixel itself can be shaded
    // and if the pixel at test_pos casts a shadow
    if(isCasterColor(texColor) && !(isCasterColor(fragmentColor))) {
      isShadow = true;
      break;
    } else {
      isShadow = false;
    }

  }

  if(isShadow) {
    // Mix the fragment color with the shadow color
    return mix(fragmentColor, u_shadow_color, 0.33);
  } else {
    // The pixel is not shaded, return the default color
    return fragmentColor;
  }

}