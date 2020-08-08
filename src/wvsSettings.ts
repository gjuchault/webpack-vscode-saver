import { FindFiles } from "./wdsServerGuesser/findFiles";
import { WvsSettings, wvsSettingsPath } from "./settings";

export async function readWvsSettings(
  findFiles: FindFiles
): Promise<WvsSettings | undefined> {
  const files = await findFiles(
    `**/${wvsSettingsPath}`,
    "**​/node_modules/**",
    1
  );

  console.log(files);

  if (!files.length) {
    return;
  }

  try {
    // clear cache before requiring config file in case if it changed
    delete require.cache[require.resolve(files[0].path)];

    const wvsSettings: WvsSettings = require(files[0].path);

    return wvsSettings;
  } catch (err) {
    console.error(`[webpack-vscode-saver] error while reading wvs.json`, {
      path: files[0].path,
      err,
    });

    return;
  }
}
