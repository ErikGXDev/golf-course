import { AudioPlay } from "kaplay";
import k from "./kaplay";
import { gameState } from "./state";

let music: AudioPlay | null = null;
let lastIndex = -1;
export function playMainMusic(force = false) {
  if (music && !force) {
    return;
  }

  const musicIndex = k.randi(1, 4);

  if (musicIndex === lastIndex) {
    playMainMusic(true);
    return;
  }

  lastIndex = musicIndex;

  music = k.play("soundtrack" + musicIndex);
  music.volume = 0.25;

  if (gameState.settings.music === "Off") {
    music.volume = 0;
  }

  music.onEnd(() => {
    playMainMusic(true);
  });
}

export function muteMusic() {
  if (music) {
    music.volume = 0;
  }
}

export function unmuteMusic() {
  if (music) {
    music.volume = 0.25;
  }
}

export function skipMusic() {
  if (music) {
    music.stop();
    playMainMusic(true);
  }
}
