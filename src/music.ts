import k from "./kaplay";

export function playMainMusic() {
  const music = k.play("music1");
  music.volume = 0.25;
  music.loop = true;
}
