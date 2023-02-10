export type JiraIssue = {
  expand: string;
  id: string;
  self: string;
  key: string;
  fields: Fields;
}

interface Fields {
  issuetype: Issuetype;
  parent: Parent;
  attachment: Attachment[];
  timespent: number;
  project: Project;
  fixVersions: any[];
  aggregatetimespent: any;
  resolution: Resolution;
  resolutiondate: string;
  workratio: number;
  lastViewed: any;
  watches: Watches;
  created: string;
  priority: Priority;
  labels: string[];
  timeestimate: any;
  aggregatetimeoriginalestimate: any;
  versions: any[];
  issuelinks: any[];
  assignee: User;
  updated: string;
  status: Status;
  components: Component[];
  timeoriginalestimate: any;
  description: string;
  aggregatetimeestimate: any;
  summary: string;
  creator: User;
  subtasks: any[];
  reporter: User;
  aggregateprogress: Aggregateprogress;
  environment: any;
  duedate: any;
  progress: Progress;
  votes: Votes;
}

interface Component {
  id: string;
  name: string;
  self: string;
}

interface Issuetype {
  self: string;
  id: string;
  description: string;
  iconUrl: string;
  name: string;
  subtask: boolean;
  avatarId: number;
}

interface Attachment {
  self: string;
  id: string;
  filename: string;
  author: User;
  created: string;
  size: number;
  mimeType: string;
  content: string;
  thumbnail: string;
}

interface Parent {
  id: string;
  key: string;
  self: string;
  fields: Fields;
}

interface Fields {
  summary: string;
  status: Status;
  priority: Priority;
  issuetype: Issuetype;
}

interface Status {
  self: string;
  description: string;
  iconUrl: string;
  name: string;
  id: string;
  statusCategory: StatusCategory;
}

interface StatusCategory {
  self: string;
  id: number;
  key: string;
  colorName: string;
  name: string;
}

interface Issuetype {
  self: string;
  id: string;
  description: string;
  iconUrl: string;
  name: string;
  subtask: boolean;
  avatarId: number;
}

interface Project {
  self: string;
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  avatarUrls: AvatarUrls;
  projectCategory: ProjectCategory;
}

interface AvatarUrls {
  "48x48": string;
  "24x24": string;
  "16x16": string;
  "32x32": string;
}

interface ProjectCategory {
  self: string;
  id: string;
  description: string;
  name: string;
}

interface Resolution {
  self: string;
  id: string;
  description: string;
  name: string;
}

interface Watches {
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

interface Status {
  self: string;
  description: string;
  iconUrl: string;
  name: string;
  id: string;
  statusCategory: StatusCategory;
}

interface StatusCategory {
  self: string;
  id: number;
  key: string;
  colorName: string;
  name: string;
}

export type User = {
  self: string;
  name: string;
  key: string;
  emailAddress: string;
  avatarUrls: AvatarUrls;
  displayName: string;
  active: boolean;
  timeZone: string;
}

interface Aggregateprogress {
  progress: number;
  total: number;
}

interface Progress {
  progress: number;
  total: number;
}

interface Votes {
  self: string;
  votes: number;
  hasVoted: boolean;
}
