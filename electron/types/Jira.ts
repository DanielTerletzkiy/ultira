import { ChangeState } from "./ChangeState";
import { ApplicationType } from "./ApplicationType";
import { StatusResult } from "simple-git";

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
  changes: StatusResult;
  ideId?: IDE["id"];
  ide?: IDE;
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
