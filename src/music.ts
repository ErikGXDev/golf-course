import { AudioPlay } from "kaplay";
import k from "./kaplay";

let music: AudioPlay | null = null;
export function playMainMusic(force = false) {
  if (music && !force) {
    return;
  }

  const musicIndex = k.randi(1, 4);

  music = k.play("soundtrack" + musicIndex);
  music.volume = 0.25;

  music.onEnd(() => {
    playMainMusic(true);
  });
}
