import * as vscode from "vscode";
import { connectToWds } from "./commands/connectToWds";
import { createSettings } from "./commands/createSettings";
import { manuallyBuild } from "./commands/manuallyBuild";
import { updateMementoWithSettings } from "./wvsSettings";
import { onFileSave } from "./handlers/onFileSave";

export async function activate(context: vscode.ExtensionContext) {
  console.log("[webpack-vscode-saver] start");

  await updateMementoWithSettings(context);

  vscode.workspace.onDidSaveTextDocument(async (e) => {
    await onFileSave(context, e);
  });

  const connectToWdsCommand = vscode.commands.registerCommand(
    "webpack-vscode-saver.connectToWds",
    async () => connectToWds(context)
  );

  const manuallyBuildCommand = vscode.commands.registerCommand(
    "webpack-vscode-saver.manuallyBuild",
    async () => manuallyBuild()
  );

  const createSettingsCommand = vscode.commands.registerCommand(
    "webpack-vscode-saver.createSettings",
    async () => createSettings()
  );

  context.subscriptions.push(connectToWdsCommand);
  context.subscriptions.push(manuallyBuildCommand);
  context.subscriptions.push(createSettingsCommand);
}

export function deactivate() {}
