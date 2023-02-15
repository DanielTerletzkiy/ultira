import { ChangeState } from "./ChangeState";
import { ApplicationType } from "./ApplicationType";

export type Project = {
  path: string,
  project: string,
  branch: string,
  changes: Array<Array<string>>,
}

export type ChangeStep = {
  step: number,
  state: ChangeState,
  path: string,
}

export type JiraConfig = {
  id: string;
  url: string;
  name: string;
  applicationType: ApplicationType;
}

