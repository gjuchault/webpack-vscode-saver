import fetch from "node-fetch";
import { URL } from "url";
import { debounce } from "./helpers/debounce";
import { getLogger } from "./helpers/logs";

export const invalidate = debounce(async (wdsServer: string) => {
  const logger = getLogger();

  const { href } = new URL("/webpack-dev-server/invalidate", wdsServer);

  logger.appendLine(`Invalidating ${href}`);
  try {
    const res = await fetch(href);
    logger.appendLine(`Invalidating: ${res.ok}`);
  } catch (err) {
    logger.appendLine(`Could not invalidate ${wdsServer}: ${err.toString()}`);
  }
}, 200);
