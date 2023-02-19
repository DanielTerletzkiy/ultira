export type JiraIssue = {
  expand: string;
  id: string;
  self: string;
  key: string;
  fields: Fields;
  renderedFields: RenderedFields
  names: Names;
  changelog: Changelog;
}

interface Names {
  [key: string]: string;
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
  statuscategorychangedate: string
  timetracking: Timetracking
  security: any
  comment: Comment
  worklog: Worklog
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

export interface RenderedFields {
  statuscategorychangedate: string
  issuetype: any
  timespent: string
  customfield_10030: any
  customfield_10031: any
  project: any
  customfield_10032: any
  fixVersions: any
  customfield_10033: any
  aggregatetimespent: string
  customfield_10034: any
  customfield_10035: any
  resolution: any
  customfield_10029: any
  resolutiondate: string
  workratio: any
  issuerestriction: any
  lastViewed: any
  watches: any
  created: string
  customfield_10020: any
  customfield_10021: any
  customfield_10022: any
  customfield_10023: any
  priority: any
  customfield_10024: any
  customfield_10025: any
  labels: any
  customfield_10016: any
  customfield_10017: string
  customfield_10018: any
  customfield_10019: any
  aggregatetimeoriginalestimate: string
  timeestimate: string
  versions: any
  issuelinks: any
  assignee: any
  updated: string
  status: any
  components: any
  timeoriginalestimate: string
  description: string
  customfield_10010: any
  customfield_10014: any
  timetracking: Timetracking
  customfield_10015: any
  customfield_10005: any
  customfield_10006: any
  customfield_10007: any
  security: any
  customfield_10008: any
  customfield_10009: any
  attachment: Attachment[]
  aggregatetimeestimate: string
  summary: any
  creator: any
  subtasks: any
  reporter: any
  customfield_10000: any
  aggregateprogress: any
  customfield_10001: any
  customfield_10002: any
  customfield_10003: any
  customfield_10004: any
  environment: string
  duedate: any
  progress: any
  comment: Comment
  votes: any
  worklog: Worklog
}

export interface Timetracking {
  originalEstimate: string
  remainingEstimate: string
  timeSpent: string
  originalEstimateSeconds: number
  remainingEstimateSeconds: number
  timeSpentSeconds: number
}

export interface Worklog {
  startAt: number
  maxResults: number
  total: number
  worklogs: WorklogItem[]
}

export interface WorklogItem {
  self: string
  author: User
  updateAuthor: User
  created: string
  updated: string
  started: string
  timeSpent: string
  id: string
  issueId: string
}

export interface Comment {
  comments: CommentItem[]
  self: string
  maxResults: number
  total: number
  startAt: number
}

export interface CommentItem {
  self: string
  id: string
  author: User
  body: string
  updateAuthor: User
  created: string
  updated: string
  jsdPublic: boolean
}

export interface Changelog {
  startAt: number
  maxResults: number
  total: number
  histories: History[]
}

export interface History {
  id: string
  author: User
  created: string
  items: Item[]
}
export interface Item {
  field: string
  fieldtype: string
  fieldId?: string
  from?: string
  fromString?: string
  to?: string
  toString?: string
}
