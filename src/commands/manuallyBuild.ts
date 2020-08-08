import * as vscode from "vscode";
import { readWvsSettings } from "../wvsSettings";
import { invalidate } from "../invalidate";

export async function manuallyBuild() {
  console.log("[webpack-vscode-saver] manually invalidating build");

  const wvsConfig = await readWvsSettings(vscode.workspace.findFiles);

  if (!wvsConfig || !wvsConfig[0]) {
    console.log(`[webpack-vscode-saver] no configuration, skipping...`);
    return;
  }

  await invalidate(wvsConfig[0].wdsServer);
}
