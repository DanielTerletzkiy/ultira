export enum SortNames {
  Latest = "Last Updated",
  Priority = "Priority",
  State = "State",
  Type = "Type",
  Project = "Project",
}

export enum ViewSwitch {
  Server = "Server",
  Local = "Local",
}

export type Project = {
  path: string,
  project: string,
  branch: string,
  changes: Array<Array<string>>,
}

export type JiraConfig = {
  url: string;
  name: string;
  applicationType: ApplicationType;
}

export enum ApplicationType {
  Bitbucket = "bitbucket",
  Stash = "stash",
  GitHub = "GitHub", //hmm ¯\_(ツ)_/¯
}

