import { ChangeState } from "./ChangeState";
import { ApplicationType } from "./ApplicationType";

export type IDE = {
  id: string;
  path: string;
  name: string;
};

export type Project = {
  path: string;
  project: string;
  branch: string;
  defaultBranch?: string;
  changes: Array<Array<string>>;
  ideId?: IDE["id"];
};

export type ChangeStep = {
  step: number;
  state: ChangeState;
  path: string;
};

export type JiraConfig = {
  id: string;
  url: string;
  name: string;
  applicationType: ApplicationType;
};
