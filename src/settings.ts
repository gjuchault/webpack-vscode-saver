export type WvsSettings = {
  path: string[];
  ignore: string[];
  wdsServer: string;
}[];

export const wvsSettingsPath = ".vscode/wvs.json";

export const defaultSettings: WvsSettings = [
  {
    path: ["."],
    ignore: [],
    wdsServer: "http://localhost:8080/",
  },
];

export const defaultSettingsAsString = JSON.stringify(defaultSettings, null, 2);
