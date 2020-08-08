import * as vscode from "vscode";

let instance: vscode.OutputChannel;

export function getLogger() {
  if (!instance) {
    instance = vscode.window.createOutputChannel("WebpackVscodeSaver");
  }

  return instance;
}
