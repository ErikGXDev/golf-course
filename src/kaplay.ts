import kaplay from "kaplay";

const k = kaplay({
  debug: import.meta.env.MODE != "production",
  global: false,
  background: "#6d80fa",
  font: "happy",
  pixelDensity: window.devicePixelRatio,
});

export default k;
