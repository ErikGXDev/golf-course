import kaplay from "kaplay";

const k = kaplay({
  debug: import.meta.env.MODE != "production",
  global: false,
  background: "#000000",
  font: "happy",
  pixelDensity: window.devicePixelRatio,
});

export default k;
