export type JiraCommits = {
  errors: Object[];
  detail: Detail[];
}

interface Detail {
  repositories: Repository[];
  _instance: Instance;
}

export type Repository = {
  name: string;
  avatar: string;
  avatarDescription: string;
  url: string;
  parent: Parent;
  commits: Commit[];
}

interface Parent {
  name: string;
  avatar: string;
  avatarDescription: string;
  url: string;
}

interface Commit {
  id: string;
  displayId: string;
  authorTimestamp: string;
  url: string;
  author: Author;
  fileCount: number;
  merge: boolean;
  message: string;
  files: File[];
}

interface Author {
  name: string;
  avatar: string;
}

interface File {
  path: string;
  url: string;
  changeType: ChangeType;
  linesAdded: number;
  linesRemoved: number;
}

export enum ChangeType {
  MODIFIED = "MODIFIED",
  DELETED = "DELETED",
  MOVED = "MOVED",
  ADDED = "ADDED",
  COPIED = "COPIED",
  UNKNOWN = "UNKNOWN",
}

interface Instance {
  singleInstance: boolean;
  primary: boolean;
  applicationLinkId: string;
  baseUrl: string;
  name: string;
  typeName: string;
  id: string;
  type: string;
}
