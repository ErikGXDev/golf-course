import { Color, GameObj, Quad, ShaderComp, SpriteComp } from "kaplay";
import k from "../kaplay";

export function shadowShader(shaderOpt: {
  direction?: number;
  quality?: number;
  shadowLength?: number;
  targetColor: Color;
  excludeColor?: Color;
  noUpdate?: boolean;
}) {
  let _spriteFrames: Quad[];
  let _spriteUV: Quad;
  let _currFrame: number;

  return {
    id: "shadowshader",
    require: ["sprite"],
    add(this: GameObj<SpriteComp | ShaderComp>) {
      this.use(k.shader("shadow"));

      const spriteData = k.getSprite(this.sprite);

      if (!spriteData || !spriteData.data) {
        throw new Error(`Sprite ${this.sprite} not found`);
      }

      _currFrame = this.frame;
      _spriteFrames = spriteData.data.frames;

      const spriteUV = _spriteFrames[_currFrame];
      const spriteDimensions = k
        .vec2(spriteData.data.width, spriteData.data.height)
        .scale(1 / _spriteFrames.length);

      _spriteUV = spriteUV;

      this.uniform = {
        u_quad_pos: k.vec2(spriteUV.x, spriteUV.y),
        u_quad_size: k.vec2(spriteUV.w, spriteUV.h),
        u_resolution: spriteDimensions,
        u_direction: shaderOpt.direction || 45,
        u_quality: shaderOpt.quality || 1.5,
        u_shadow_length: shaderOpt.shadowLength || 8,
        u_target_color: shaderOpt.targetColor,
        u_exclude_color: shaderOpt.excludeColor || k.rgb(0, 0, 0),
      };
    },
    ...(shaderOpt.noUpdate
      ? {}
      : {
          update(this: GameObj<SpriteComp | ShaderComp>) {
            if (this.frame !== _currFrame) {
              _currFrame = this.frame;
              _spriteUV = _spriteFrames[_currFrame];

              if (this.uniform) {
                this.uniform.u_quad_pos = k.vec2(_spriteUV.x, _spriteUV.y);
                this.uniform.u_quad_size = k.vec2(_spriteUV.w, _spriteUV.h);
              }
            }
          },
        }),
    setShadowSettings(
      this: GameObj<SpriteComp | ShaderComp>,
      settings: {
        direction?: number;
        quality?: number;
        shadowLength?: number;
        targetColor?: Color;
        excludeColor?: Color;
      }
    ) {
      if (!this.uniform) {
        return;
      }

      if (settings.direction !== undefined) {
        this.uniform.u_direction = settings.direction;
      }

      if (settings.quality !== undefined) {
        this.uniform.u_quality = settings.quality;
      }

      if (settings.shadowLength !== undefined) {
        this.uniform.u_shadow_length = settings.shadowLength;
      }

      if (settings.targetColor) {
        this.uniform.u_target_color = settings.targetColor;
      }

      if (settings.excludeColor) {
        this.uniform.u_exclude_color = settings.excludeColor;
      }
    },
  };
}

export function shadowComp() {
  return shadowShader({
    direction: -135,
    quality: 4,
    shadowLength: 12,
    targetColor: k.rgb(31, 16, 42),
    excludeColor: k.rgb(74, 48, 82),
    noUpdate: true,
  });
}
