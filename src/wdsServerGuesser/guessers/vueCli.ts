// TODO: read from package.json script (`vue-cli-service --port`)

import { FindFiles } from "../findFiles";
import { WdsServerGuesserResult } from "../result";
import { getLogger } from "../../helpers/logs";

interface VueConfiguration {
  devServer?: {
    port?: number;
  };
}

const defaultVueWdsPort = 8080;

export async function guessWdsServer(
  findFiles: FindFiles
): Promise<WdsServerGuesserResult> {
  const logger = getLogger();

  const files = await findFiles("**/vue.config.js", "**​/node_modules/**", 1);

  if (!files.length) {
    return {
      outcome: "notMatched",
    };
  }

  let port = defaultVueWdsPort;

  try {
    const vueConfig: VueConfiguration = require(files[0].fsPath);

    port = vueConfig.devServer?.port ?? port;
  } catch (err) {
    logger.appendLine(
      `Error while reading ${files[0].path}: ${err.toString()}`
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
