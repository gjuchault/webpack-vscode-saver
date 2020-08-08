export type WdsServerGuesserResult =
  | { outcome: "matched"; server: string }
  | { outcome: "notMatched" };
