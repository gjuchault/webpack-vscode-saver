import * as vscode from "vscode";
import { relative } from "path";
import { updateMementoWithSettings } from "../readWvsSettings";
import { wvsMementoKey, WvsSettings } from "../settings";
import { invalidate } from "../invalidate";
import { createMatcher } from "../helpers/match";
import { getLogger } from "../helpers/logs";

export async function onFileSave(
  context: vscode.ExtensionContext,
  e: vscode.TextDocument
) {
  const logger = getLogger();

  if (!vscode.workspace.workspaceFolders) {
    logger.appendLine("No workspace, skipping");
    return;
  }

  const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;

  if (isSavingSettingsFile(e)) {
    logger.appendLine("Detected wvs.json settings file being saved");
    updateMementoWithSettings(context);
  }

  const settings = context.workspaceState.get<WvsSettings>(wvsMementoKey);

  if (!settings || !settings[0]) {
    logger.appendLine("No configuration, skipping");
    return;
  }

  const filePath = relative(rootPath, e.uri.fsPath);
  const serversToInvalidate = new Set<string>();

  logger.appendLine(`File saved: ${filePath}`);

  for (const setting of settings) {
    const includeMatcher = createMatcher(setting.include);
    const excludeMatcher = createMatcher(setting.exclude);

    if (includeMatcher(filePath) && !excludeMatcher(filePath)) {
      serversToInvalidate.add(setting.wdsServer);
    }
  }

  if (serversToInvalidate.size === 0) {
    logger.appendLine("No match - no server to invalidate");
    return;
  }

  logger.appendLine(
    `Invalidating build for ${Array.from(serversToInvalidate).join(", ")}`
  );

  await Promise.all(
    Array.from(serversToInvalidate).map((wdsServer) => invalidate(wdsServer))
  );
}

export function isSavingSettingsFile(e: vscode.TextDocument) {
  return e.uri.fsPath.endsWith(".vscode/wvs.json");
}
