export type WvsSettings = {
  include: string[];
  exclude: string[];
  wdsServer: string;
}[];

export const wvsMementoKey = "webpack-vscode-saver";
export const wvsSettingsPath = ".vscode/wvs.json";

export const defaultSettings: WvsSettings = [
  {
    include: ["*"],
    exclude: [],
    wdsServer: "http://localhost:8080/",
  },
];

export const defaultSettingsAsString = JSON.stringify(defaultSettings, null, 2);
