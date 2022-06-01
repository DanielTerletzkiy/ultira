export var JiraConfiguration;
(function (JiraConfiguration) {
    let ApplicationType;
    (function (ApplicationType) {
        ApplicationType["Bitbucket"] = "bitbucket";
        ApplicationType["Stash"] = "stash";
        ApplicationType["GitHub"] = "github";
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