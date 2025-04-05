import k from "../kaplay";

export function getTimer() {
  if (k.get("game_timer").length > 0) {
    return k.get("game_timer")[0];
  }

  const timer = k.add([k.timer(), "game_timer"]);

  return timer;
}
