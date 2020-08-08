import * as vscode from "vscode";
import { relative } from "path";
import { updateMementoWithSettings } from "../wvsSettings";
import { wvsMementoKey, WvsSettings } from "../settings";
import { invalidate } from "../invalidate";
import { createMatcher } from "../helpers/match";

export async function onFileSave(
  context: vscode.ExtensionContext,
  e: vscode.TextDocument
) {
  if (!vscode.workspace.workspaceFolders) {
    console.log(`[webpack-vscode-saver] no workspace, skipping`);
    return;
  }

  const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;

  if (isSavingSettingsFile(e)) {
    console.log("[webpack-vscode-saver] detected settings file save");
    updateMementoWithSettings(context);
  }

  const settings = context.workspaceState.get<WvsSettings>(wvsMementoKey);

  if (!settings || !settings[0]) {
    console.log(`[webpack-vscode-saver] no configuration, skipping`);
    return;
  }

  const filePath = relative(rootPath, e.uri.fsPath);
  const serversToInvalidate = new Set<string>();

  console.log(`[webpack-vscode-saver] ${filePath}`);

  for (const setting of settings) {
    console.log(`[webpack-vscode-saver] checking`, { setting });

    const includeMatcher = createMatcher(
      setting.include.map((includePath) =>
        includePath.replace("<rootPath>", "")
      )
    );

    const excludeMatcher = createMatcher(
      setting.exclude.map((excludePath) =>
        excludePath.replace("<rootPath>", "")
      )
    );

    if (includeMatcher(filePath) && !excludeMatcher(filePath)) {
      serversToInvalidate.add(setting.wdsServer);
    }
  }

  console.log(
    "[webpack-vscode-saver] invalidating build",
    Array.from(serversToInvalidate)
  );

  await Promise.all(
    Array.from(serversToInvalidate).map((wdsServer) => invalidate(wdsServer))
  );
}

export function isSavingSettingsFile(e: vscode.TextDocument) {
  return e.uri.fsPath.endsWith(".vscode/wvs.json");
}
