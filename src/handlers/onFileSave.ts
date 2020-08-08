import * as vscode from "vscode";
import { updateMementoWithSettings } from "../wvsSettings";
import { wvsMementoKey, WvsSettings } from "../settings";
import { invalidate } from "../invalidate";

export async function onFileSave(
  context: vscode.ExtensionContext,
  e: vscode.TextDocument
) {
  if (e.uri.fsPath.endsWith(".vscode/wvs.json")) {
    console.log("[webpack-vscode-saver] detected settings file save");
    updateMementoWithSettings(context);
  }

  const currentConfig = context.workspaceState.get<WvsSettings>(wvsMementoKey);

  if (!currentConfig || !currentConfig[0]) {
    console.log(`[webpack-vscode-saver] no configuration, skipping...`);
    return;
  }

  console.log("[webpack-vscode-saver] invalidating build");

  await invalidate(currentConfig[0].wdsServer);
}
