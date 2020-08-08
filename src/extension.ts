import * as vscode from "vscode";
import { invalidate } from "./invalidate";
import { connectToWds } from "./commands/connectToWds";
import { createSettings } from "./commands/createSettings";
import { readWvsSettings } from "./wvsSettings";
import { WvsSettings } from "./settings";

const wdsServerKey = "webpack-vscode-saver";

export async function activate(context: vscode.ExtensionContext) {
  console.log("[webpack-vscode-saver] start");

  const wvsConfig = await readWvsSettings(vscode.workspace.findFiles);

  if (wvsConfig && wvsConfig[0]) {
    console.log("[webpack-vscode-saver] loading config", { wvsConfig });
    await context.workspaceState.update(wdsServerKey, wvsConfig);
  } else {
    console.log("[webpack-vscode-saver] no workspace config found");
  }

  vscode.workspace.onDidSaveTextDocument(async (e) => {
    if (e.uri.fsPath.endsWith(".vscode/wvs.json")) {
      console.log("[webpack-vscode-saver] detected settings file save");
      const wvsConfig = await readWvsSettings(vscode.workspace.findFiles);

      if (wvsConfig && wvsConfig[0]) {
        console.log("[webpack-vscode-saver] loading config", { wvsConfig });
        await context.workspaceState.update(wdsServerKey, wvsConfig);
      } else {
        console.log("[webpack-vscode-saver] no workspace config found");
      }
    }

    const currentConfig = context.workspaceState.get<WvsSettings>(wdsServerKey);

    if (!currentConfig || !currentConfig[0]) {
      console.log(`[webpack-vscode-saver] no configuration, skipping...`);
      return;
    }

    console.log("[webpack-vscode-saver] invalidating build");

    await invalidate(currentConfig[0].wdsServer);
  });

  const connectToWdsCommand = vscode.commands.registerCommand(
    "webpack-vscode-saver.connectToWds",
    async () => connectToWds(context, wdsServerKey)
  );

  const manuallyBuildCommand = vscode.commands.registerCommand(
    "webpack-vscode-saver.manuallyBuild",
    async () => {
      console.log("[webpack-vscode-saver] manually invalidating build");

      const wvsConfig = await readWvsSettings(vscode.workspace.findFiles);

      if (!wvsConfig || !wvsConfig[0]) {
        console.log(`[webpack-vscode-saver] no configuration, skipping...`);
        return;
      }

      await invalidate(wvsConfig[0].wdsServer);
    }
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
