export type JiraComments = {
  startAt: number;
  maxResults: number;
  total: number;
  comments: Comment[];
}

export type Comment = {
  self: string;
  id: string;
  author: Author;
  body: string;
  updateAuthor: UpdateAuthor;
  created: string;
  updated: string;
  jsdPublic: boolean;
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
