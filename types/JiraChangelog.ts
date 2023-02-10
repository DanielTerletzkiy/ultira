export type JiraChangelog = {
  expand: string;
  id: string;
  self: string;
  key: string;
  fields: Fields;
  changelog: Changelog;
}

export type Issuetype = {
  self: string;
  id: string;
  description: string;
  iconUrl: string;
  name: string;
  subtask: boolean;
  avatarId: number;
}

export type AvatarUrls = {
  "48x48": string;
  "24x24": string;
  "16x16": string;
  "32x32": string;
}

export type ProjectCategory = {
  self: string;
  id: string;
  description: string;
  name: string;
}

export type Project = {
  self: string;
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  avatarUrls: AvatarUrls;
  projectCategory: ProjectCategory;
}

export type Resolution = {
  self: string;
  id: string;
  description: string;
  name: string;
}

export type Watches = {
  self: string;
  watchCount: number;
  isWatching: boolean;
}

export type Priority = {
  self: string;
  iconUrl: string;
  name: string;
  id: string;
}

export type Assignee = {
  self: string;
  name: string;
  key: string;
  emailAddress: string;
  avatarUrls: AvatarUrls;
  displayName: string;
  active: boolean;
  timeZone: string;
}

export type StatusCategory = {
  self: string;
  id: number;
  key: string;
  colorName: string;
  name: string;
}

export type Status = {
  self: string;
  description: string;
  iconUrl: string;
  name: string;
  id: string;
  statusCategory: StatusCategory;
}

export type Component = {
  self: string;
  id: string;
  name: string;
}

export type Timetracking = {
}

export type Creator = {
  self: string;
  name: string;
  key: string;
  emailAddress: string;
  avatarUrls: AvatarUrls;
  displayName: string;
  active: boolean;
  timeZone: string;
}

export type Reporter = {
  self: string;
  name: string;
  key: string;
  emailAddress: string;
  avatarUrls: AvatarUrls;
  displayName: string;
  active: boolean;
  timeZone: string;
}

export type Aggregateprogress = {
  progress: number;
  total: number;
}

export type Progress = {
  progress: number;
  total: number;
}

export type Comment = {
  comments: any[];
  maxResults: number;
  total: number;
  startAt: number;
}

export type Votes = {
  self: string;
  votes: number;
  hasVoted: boolean;
}

export type Worklog = {
  startAt: number;
  maxResults: number;
  total: number;
  worklogs: any[];
}

export type Fields = {
  issuetype: Issuetype;
  timespent?: any;
  project: Project;
  fixVersions: any[];
  aggregatetimespent?: any;
  resolution: Resolution;
  resolutiondate: Date;
  workratio: number;
  lastViewed: Date;
  watches: Watches;
  created: Date;
  priority: Priority;
  labels: any[];
  timeestimate?: any;
  aggregatetimeoriginalestimate?: any;
  versions: any[];
  issuelinks: any[];
  assignee: Assignee;
  updated: Date;
  status: Status;
  components: Component[];
  timeoriginalestimate?: any;
  description: string;
  timetracking: Timetracking;
  attachment: any[];
  aggregatetimeestimate?: any;
  summary: string;
  creator: Creator;
  subtasks: any[];
  reporter: Reporter;
  aggregateprogress: Aggregateprogress;
  environment?: any;
  duedate?: any;
  progress: Progress;
  comment: Comment;
  votes: Votes;
  worklog: Worklog;
}

export type Author = {
  self: string;
  name: string;
  key: string;
  emailAddress: string;
  avatarUrls: AvatarUrls;
  displayName: string;
  active: boolean;
  timeZone: string;
}

export type Item = {
  field: string;
  fieldtype: string;
  from: string;
  fromString: string;
  to: string;
  toString: string;
}

export type Actor = {
  id: string;
  displayName: string;
  type: string;
  avatarUrl: string;
  url: string;
}

export type Generator = {
  id: string;
  type: string;
  avatarUrl: string;
}

export type Cause = {
  id: string;
  displayName: string;
  displayNameKey: string;
  type: string;
}

export type ExtraData = {
}

export type HistoryMetadata = {
  type: string;
  description: string;
  descriptionKey: string;
  activityDescription: string;
  activityDescriptionKey: string;
  emailDescription: string;
  emailDescriptionKey: string;
  actor: Actor;
  generator: Generator;
  cause: Cause;
  extraData: ExtraData;
}

export type History = {
  id: string;
  author: Author;
  created: Date;
  items: Item[];
  historyMetadata: HistoryMetadata;
}

export type Changelog = {
  startAt: number;
  maxResults: number;
  total: number;
  histories: History[];
}

