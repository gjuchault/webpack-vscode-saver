// TODO: handle array configurations and match paths to reload proper devServer

import { promises as fs } from "fs";
import { FindFiles } from "../findFiles";
import { WdsServerGuesserResult } from "../result";
import { getLogger } from "../../helpers/logs";

const defaultCraWdsPort = 3000;
const dotEnvRegex = /^PORT=(\d+)$/g;

export async function guessWdsServer(
  findFiles: FindFiles
): Promise<WdsServerGuesserResult> {
  const logger = getLogger();

  const dotEnv = await findFiles("**/.env", "**​/node_modules/**", 1);
  const dotEnvLocal = await findFiles(
    "**/.env.local",
    "**​/node_modules/**",
    1
  );
  const dotEnvDevelopment = await findFiles(
    "**/.env.development",
    "**​/node_modules/**",
    1
  );
  const dotEnvDevelopmentLocal = await findFiles(
    "**/.env.development.local",
    "**​/node_modules/**",
    1
  );

  const dotEnvPaths = [
    dotEnv[0],
    dotEnvLocal[0],
    dotEnvDevelopment[0],
    dotEnvDevelopmentLocal[0],
  ];

  let port = defaultCraWdsPort;

  try {
    const contents = await Promise.all(
      dotEnvPaths
        .filter(Boolean)
        .map(({ fsPath }) => fs.readFile(fsPath, "utf-8"))
    );

    for (const dotEnvContent of contents) {
      const match = dotEnvRegex.exec(dotEnvContent);

      if (!match) {
        continue;
      }

      port = Number(match[1]) ?? port;
    }
  } catch (err) {
    logger.appendLine(`Error while reading .env: ${err.toString()}`);

    return {
      outcome: "notMatched",
    };
  }

  return {
    outcome: "matched",
    server: `http://localhost:${port}/`,
  };
}
