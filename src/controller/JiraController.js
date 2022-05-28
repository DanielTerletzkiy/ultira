import ApiController from "./ApiController";
import JiraTask from "./JiraTask";
export default class JiraController extends ApiController {
    controller;
    issues;
    totalIssues = 0;
    constructor(baseController) {
        super();
        this.controller = baseController;
    }
    async getAllIssues() {
        const searchResult = await ApiController.fetchJira(this.controller.url, `rest/api/latest/search?jql=assignee=currentuser() OR reporter=currentuser() ORDER BY updated desc`, 'GET', this.controller.credentials);
        this.issues = searchResult.issues.map((issue) => new JiraTask(issue, this.controller));
        this.totalIssues = searchResult.total;
        return { issues: this.issues, total: this.totalIssues };
    }
}
//# sourceMappingURL=JiraController.js.map