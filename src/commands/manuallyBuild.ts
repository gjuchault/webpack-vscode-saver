import * as vscode from "vscode";
import { invalidate } from "../invalidate";
import { getLogger } from "../helpers/logs";
import { WvsSettings, wvsMementoKey } from "../settings";

export async function manuallyBuild(context: vscode.ExtensionContext) {
  const logger = getLogger();

  logger.appendLine("Manually invalidating build");

  const settings = context.workspaceState.get<WvsSettings>(wvsMementoKey);

  if (!settings) {
    logger.appendLine("No settings, skipping");
    return;
  }

  await Promise.all(settings.map(({ wdsServer }) => invalidate(wdsServer)));
}
