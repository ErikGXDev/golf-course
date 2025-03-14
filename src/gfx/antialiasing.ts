import k from "../kaplay";

export function addAntialiasing() {
  k.usePostEffect("antialias", {
    u_resolution: k.vec2(k.width(), k.height()),
  });

  k.onResize(() => {
    k.usePostEffect("antialias", {
      u_resolution: k.vec2(k.width(), k.height()),
    });
  });
}
