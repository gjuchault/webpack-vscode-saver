// TODO: read from package.json script (`vue-cli-service --port`)

import { FindFiles } from "../findFiles";
import { WdsServerGuesserResult } from "../result";

interface VueConfiguration {
  devServer?: {
    port?: number;
  };
}

const defaultVueWdsPort = 8080;

export async function guessWdsServer(
  findFiles: FindFiles
): Promise<WdsServerGuesserResult> {
  const files = await findFiles("**/vue.config.js", "**​/node_modules/**", 1);

  if (!files.length) {
    return {
      outcome: "notMatched",
    };
  }

  let port = defaultVueWdsPort;

  try {
    const vueConfig: VueConfiguration = require(files[0].path);

    port = vueConfig.devServer?.port ?? port;
  } catch (err) {
    console.error(
      `[webpack-vscode-saver] error while reading webpack config.js`,
      {
        path: files[0].path,
        err,
      }
    );

    return {
      outcome: "notMatched",
    };
  }

  return {
    outcome: "matched",
    server: `http://localhost:${port}/`,
  };
}
