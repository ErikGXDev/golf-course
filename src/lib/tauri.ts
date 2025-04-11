import { open } from "@tauri-apps/plugin-shell";

export function isTauri() {
  // @ts-ignore
  return window?.isTauri !== undefined;
}

export function openTauriLink(url: string) {
  open(url);
}
