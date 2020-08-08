import { join } from "path";
import * as vscode from "vscode";
import { wvsSettingsPath, defaultSettingsAsString } from "../settings";

export async function createSettings() {
  console.log("[webpack-vscode-saver] creating a settings file");

  const wsedit = new vscode.WorkspaceEdit();

  if (!vscode.workspace.workspaceFolders) {
    console.log("[webpack-vscode-saver] you must be in a workspace");
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
