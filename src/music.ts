import k from "./kaplay";

export function playMainMusic() {
  const musicIndex = k.randi(1, 4);

  const music = k.play("soundtrack" + musicIndex);
  music.volume = 0.25;

  music.onEnd(() => {
    playMainMusic();
  });
}
