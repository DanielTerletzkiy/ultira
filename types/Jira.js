export var SortNames;
(function (SortNames) {
    SortNames["Latest"] = "Last Updated";
    SortNames["Priority"] = "Priority";
    SortNames["State"] = "State";
    SortNames["Type"] = "Type";
    SortNames["Project"] = "Project";
})(SortNames || (SortNames = {}));
export var ViewSwitch;
(function (ViewSwitch) {
    ViewSwitch["Server"] = "Server";
    ViewSwitch["Local"] = "Local";
})(ViewSwitch || (ViewSwitch = {}));
/*export interface Project {
  path: string;
  project: string;
  branch: string;
}*/
export var JiraConfiguration;
(function (JiraConfiguration) {
    let ApplicationType;
    (function (ApplicationType) {
        ApplicationType["Bitbucket"] = "bitbucket";
        ApplicationType["Stash"] = "stash";
        ApplicationType["GitHub"] = "GitHub";
    })(ApplicationType = JiraConfiguration.ApplicationType || (JiraConfiguration.ApplicationType = {}));
})(JiraConfiguration || (JiraConfiguration = {}));
export var JiraCommits;
(function (JiraCommits) {
    let ChangeType;
    (function (ChangeType) {
        ChangeType["MODIFIED"] = "MODIFIED";
        ChangeType["DELETED"] = "DELETED";
        ChangeType["MOVED"] = "MOVED";
        ChangeType["ADDED"] = "ADDED";
        ChangeType["COPIED"] = "COPIED";
        ChangeType["UNKNOWN"] = "UNKNOWN";
    })(ChangeType = JiraCommits.ChangeType || (JiraCommits.ChangeType = {}));
})(JiraCommits || (JiraCommits = {}));
//# sourceMappingURL=Jira.js.map