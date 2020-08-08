import * as vscode from "vscode";
import { wvsMementoKey } from "../settings";

export async function connectToWds(context: vscode.ExtensionContext) {
  const wdsServer = await vscode.window.showInputBox({
    placeHolder: "webpack-dev-server base url",
    prompt: "Where is your webpack dev server located?",
    value: "http://localhost:8080/",
  });

  if (!wdsServer) {
    return;
  }

  await context.workspaceState.update(wvsMementoKey, [
    {
      include: ["."],
      exclude: [],
      wdsServer,
    },
  ]);

  console.log(`[webpack-vscode-saver] setup with ${wdsServer}`);
}
