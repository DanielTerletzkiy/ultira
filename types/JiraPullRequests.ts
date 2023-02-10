export type JiraPullRequests = {
  errors: any[];
  detail: Detail[];
}

interface Detail {
  branches: Branch[];
  pullRequests: PullRequest[];
  repositories: any[];
  _instance: Instance;
}

interface Branch {
  name: string;
  url: string;
  createPullRequestUrl: string;
  repository: Repository;
}

export type Repository = {
  name: string;
  avatar: string;
  avatarDescription: string;
  url: string;
  parent: Parent;
}

interface Parent {
  name: string;
  avatar: string;
  avatarDescription: string;
  url: string;
}

interface PullRequest {
  author: Author;
  id: string;
  name: string;
  commentCount: number;
  source: Source;
  destination: Destination;
  reviewers: Reviewer[];
  status: string;
  url: string;
  lastUpdate: string;
}

interface Author {
  name: string;
  avatar: string;
}

interface Source {
  branch: string;
  repository: Repository;
  url: string;
}

interface Destination {
  branch: string;
  repository: Repository;
  url: string;
}

export type Reviewer = {
  name: string;
  avatar: string;
  approved: boolean;
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
