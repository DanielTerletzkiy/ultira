export type JiraTransitions = {
  expand: string;
  transitions: Transition[];
}

export type Transition = {
  id: string;
  name: string;
  to: To;
}

export type To = {
  self: string;
  description: string;
  iconUrl: string;
  name: string;
  id: string;
  statusCategory: StatusCategory;
}

export type StatusCategory = {
  self: string;
  id: number;
  key: string;
  colorName: string;
  name: string;
}
