import fetch from "node-fetch";
import { debounce } from "./helpers/debounce";
import { URL } from "url";

export const invalidate = debounce(async (wdsServer: string) => {
  const { href } = new URL("/webpack-dev-server/invalidate", wdsServer);

  console.log(`[webpack-vscode-saver] invalidating ${href}`);
  try {
    const res = await fetch(href);
    console.log(`[webpack-vscode-saver] ${res.ok}`);
  } catch (err) {
    console.log(`[webpack-vscode-saver] could not invalidate`, {
      wdsServer,
      err,
    });
  }
}, 200);
