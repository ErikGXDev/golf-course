import kaplay from "kaplay";

const k = kaplay({
  debug: true,
  debugKey: "ö",
  global: false,
  background: "#000000",
  font: "happy",
  pixelDensity: window.devicePixelRatio,
});

export default k;
