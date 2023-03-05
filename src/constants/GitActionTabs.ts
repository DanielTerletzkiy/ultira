import { GitActionTabTypes } from "../../types/GitActionTabTypes";

export const gitActionTabs = [
  {
    type: GitActionTabTypes.Commit,
    icon: "message",
  },
  {
    type: GitActionTabTypes.Logs,
    icon: "list-ui-alt",
  },
  {
    type: GitActionTabTypes.Stash,
    icon: "archive",
  },
  {
    type: GitActionTabTypes.Custom,
    icon: "dollar-sign",
  },

];
