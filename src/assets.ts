import k from "./kaplay";
import { loadMap } from "./map";

loadMap("Level_0");
loadMap("Level_1");
loadMap("Level_2");
loadMap("Level_3");
loadMap("Level_4");
loadMap("Level_5");
loadMap("Level_6");
loadMap("Level_7");
loadMap("Level_8");
loadMap("Level_9");
loadMap("Level_10");
loadMap("Level_11");
loadMap("Level_12");
loadMap("Level_13");
loadMap("Level_14");
loadMap("Level_15");

k.loadBitmapFont("happy", "sprites/happy_28x36.png", 28, 36);
k.loadBitmapFont("happy_o", "sprites/happy_32x40.png", 32, 40);

// Sounds
k.loadMusic("ocean_wave", "sounds/ocean_wave.mp3");
//k.loadMusic("music1", "sounds/music.mp3");
// Music
k.loadMusic("soundtrack1", "sounds/music/soundtrack1.mp3");
k.loadMusic("soundtrack2", "sounds/music/Gymnopedie No 1.mp3");
k.loadMusic("soundtrack3", "sounds/music/Devonshire Waltz Andante.mp3");

k.loadSound("click", "sounds/click.wav");
k.loadSound("quiet_click", "sounds/quiet_click.wav");
k.loadSound("quiet_click_eq", "sounds/quiet_click_eq.wav");
k.loadSound("switch_activated", "sounds/switch_activated.wav");
k.loadSound("finish_ball", "sounds/finish_ball.wav");
k.loadSound("strum1", "sounds/strum1.wav");
k.loadSound("strum2", "sounds/strum2.wav");
k.loadSound("strum3", "sounds/strum3.wav");

// Logo sprites
k.loadSprite("logo_deep_water", "sprites/logo/golfcourse_deep_water.png");
k.loadSprite("logo_shallow_water", "sprites/logo/golfcourse_shallow_water.png");
k.loadSprite("logo_grass", "sprites/logo/golfcourse_grass.png");
k.loadSprite("logo_title", "sprites/logo/golfcourse_title.png");

k.loadSprite("logo_itchio", "sprites/logo/itchio.png");

// Golf course sprites
k.loadSpriteAtlas("sprites/golfball.png", {
  golfball: { x: 1, y: 1, width: 35, height: 35 },
});

k.loadSprite("hole", "sprites/hole.png");

k.loadSpriteAtlas("sprites/logic_button.png", {
  logic_button: { x: 0, y: 0, width: 48, height: 48 },
  logic_button_pressed: { x: 48, y: 0, width: 48, height: 48 },
});

k.loadSpriteAtlas("sprites/logic.png", {
  logic_wall: {
    x: 0,
    y: 0,
    width: 64,
    height: 64,
  },
  logic_floor: {
    x: 64,
    y: 0,
    width: 64,
    height: 64,
  },
});

k.loadSprite("dropshadow", "sprites/dropshadow.png");

// Mouse sprites
k.loadSprite("cursor", "sprites/mouse/cursor.png");
k.loadSprite("pointer", "sprites/mouse/pointer.png");
k.loadSprite("drag", "sprites/mouse/drag.png");

// Level Previews
k.loadSprite("preview_1", "sprites/level/preview_1.png");
k.loadSprite("preview_2", "sprites/level/preview_2.png");

k.loadSprite("menu_icon", "sprites/menu_icon.png");

/*
// Deco sprites
k.loadSprite("tree1", "sprites/deco/tree1.png");

k.loadSprite("lilypads1", "sprites/deco/lilypads1.png");
k.loadSprite("lilypads2", "sprites/deco/lilypads2.png");

k.loadSprite("bush1", "sprites/deco/bush1.png");
k.loadSprite("bush2", "sprites/deco/bush2.png");

k.loadSprite("palmtrees", "sprites/deco/palmtrees.png");
*/

// Chroma Key Shader
// Can modify fully red and fully blue pixels to be any color
k.loadShader(
  "chromaKey",
  null,
  `
uniform vec3 u_target_red;
uniform vec3 u_target_blue;

vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
    vec4 o_color = texture2D(tex, uv);
    if (o_color.r > 0.01 && o_color.g < 0.01 && o_color.b < 0.01) return vec4(u_target_red / 255., o_color.a);
    if (o_color.r < 0.01 && o_color.g < 0.01 && o_color.b > 0.01) return vec4(u_target_blue / 255., o_color.a);
    return o_color;
}
`
);

k.loadShaderURL("shadow", null, "shaders/shadow.glsl");

//k.loadShaderURL("fxaa", null, "shaders/fxaa.glsl");
//k.loadShaderURL("mlaa", null, "shaders/mlaa.glsl");
//k.loadShaderURL("antialias", null, "shaders/antialiasing.glsl");
