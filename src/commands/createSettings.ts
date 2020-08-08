import { join } from "path";
import * as vscode from "vscode";
import { wvsSettingsPath, defaultSettingsAsString } from "../settings";
import { getLogger } from "../helpers/logs";

export async function createSettings() {
  const logger = getLogger();

  logger.appendLine("Creating a settings file");

  const wsedit = new vscode.WorkspaceEdit();

  if (!vscode.workspace.workspaceFolders) {
    logger.appendLine("You must be in a workspace");
    vscode.window.showErrorMessage("You must be in a workspace");
    return;
  }

  const settingsPath = vscode.Uri.file(
    join(vscode.workspace.workspaceFolders[0].uri.fsPath, wvsSettingsPath)
  );

  wsedit.createFile(settingsPath, { ignoreIfExists: true });
  wsedit.insert(
    settingsPath,
    new vscode.Position(0, 0),
    defaultSettingsAsString
  );

  vscode.workspace.applyEdit(wsedit);
}
