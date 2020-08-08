// TODO: handle array configurations and match paths to reload proper devServer

import { FindFiles } from "../findFiles";
import { WdsServerGuesserResult } from "../result";

type WebpackFileExportFunctionConfig = () => WebpackConfiguration;
type WebpackFileExportPromiseConfig = () => Promise<WebpackConfiguration>;

type WebpackFileExport =
  | WebpackConfiguration
  | WebpackFileExportFunctionConfig
  | WebpackFileExportPromiseConfig;

interface WebpackConfiguration {
  devServer?: {
    port?: number;
  };
}

const defaultWebpackPort = 8080;

export async function guessWdsServer(
  findFiles: FindFiles
): Promise<WdsServerGuesserResult> {
  const files = await findFiles(
    "**/webpack.config.js",
    "**​/node_modules/**",
    1
  );

  if (!files.length) {
    return {
      outcome: "notMatched",
    };
  }

  let port = defaultWebpackPort;

  try {
    const webpackExport: WebpackFileExport = require(files[0].path);
    let config: WebpackConfiguration;

    if (typeof webpackExport === "function") {
      config = await webpackExport();
    } else {
      config = webpackExport;
    }

    port = config.devServer?.port ?? port;
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
