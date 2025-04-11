import { invoke } from "@tauri-apps/api/core";

export async function getSteamID() {
  return await invoke("get_steam_id");
}

export async function isSteamRunning() {
  return await invoke("is_steam_running");
}
