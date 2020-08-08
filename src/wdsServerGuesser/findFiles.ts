import { Uri } from "vscode";

export type FindFiles = (
  include: string,
  exclude?: string | null,
  maxResults?: number
) => Thenable<Uri[]>;
