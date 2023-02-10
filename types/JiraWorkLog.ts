export type JiraWorkLog = {
  startAt: number;
  maxResults: number;
  total: number;
  worklogs: WorkLog[];
}

export type WorkLog = {
  self: string;
  author: Author;
  updateAuthor: UpdateAuthor;
  created: string;
  updated: string;
  started: string;
  timeSpent: string;
  timeSpentSeconds: number;
  id: string;
  issueId: string;
}

interface Author {
  self: string;
  accountId: string;
  emailAddress: string;
  avatarUrls: AvatarUrls;
  displayName: string;
  active: boolean;
  timeZone: string;
  accountType: string;
}

interface AvatarUrls {
  "48x48": string;
  "24x24": string;
  "16x16": string;
  "32x32": string;
}

interface UpdateAuthor {
  self: string;
  accountId: string;
  emailAddress: string;
  avatarUrls: AvatarUrls;
  displayName: string;
  active: boolean;
  timeZone: string;
  accountType: string;
}

