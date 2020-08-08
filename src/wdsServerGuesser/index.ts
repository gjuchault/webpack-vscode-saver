import { FindFiles } from "./findFiles";
import { guessWdsServer as guessWdsServerFromCra } from "./guessers/createReactApp";
import { guessWdsServer as guessWdsServerFromVueCli } from "./guessers/vueCli";
import { guessWdsServer as guessWdsServerFromWebpack } from "./guessers/webpack";

const defaultWdsServer = "http://localhost:8080/";

export async function guessWdsServer(findFiles: FindFiles): Promise<string> {
  const searchQueue = [
    guessWdsServerFromCra,
    guessWdsServerFromVueCli,
    guessWdsServerFromWebpack,
  ];

  for (const guessWdsServerItem of searchQueue) {
    const guess = await guessWdsServerItem(findFiles);
    if (guess.outcome === "matched") {
      return guess.server;
    }
  }

  return defaultWdsServer;
}
