import * as vscode from "vscode";
import { FindFiles } from "./wdsServerGuesser/findFiles";
import { WvsSettings, wvsSettingsPath, wvsMementoKey } from "./settings";

export async function readWvsSettings(
  findFiles: FindFiles
): Promise<WvsSettings | undefined> {
  const files = await findFiles(
    `**/${wvsSettingsPath}`,
    "**​/node_modules/**",
    1
  );

  if (!files.length) {
    return;
  }

  try {
    // clear cache before requiring config file in case if it changed
    delete require.cache[require.resolve(files[0].path)];

    return require(files[0].path);
  } catch (err) {
    console.error(`[webpack-vscode-saver] error while reading wvs.json`, {
      path: files[0].path,
      err,
    });

    return;
  }
}

export async function updateMementoWithSettings(
  context: vscode.ExtensionContext
) {
  const wvsConfig = await readWvsSettings(vscode.workspace.findFiles);

  if (wvsConfig && wvsConfig[0]) {
    console.log("[webpack-vscode-saver] loading config", { wvsConfig });
    await context.workspaceState.update(wvsMementoKey, wvsConfig);
  } else {
    console.log("[webpack-vscode-saver] no workspace config found");
  }
}
