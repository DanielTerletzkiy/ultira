import ApiController from "./ApiController";
import JiraBaseController from "./JiraBaseController";
import JiraTask from "./JiraTask";
import {JiraIssue} from "../../types/Jira";
import Task = JiraIssue.Task;

export default class JiraController extends ApiController {
    controller: JiraBaseController;
    issues: Array<JiraTask> | undefined;
    totalIssues: number = 0;

    constructor(baseController: JiraBaseController) {
        super();
        this.controller = baseController;
    }

    async getAllIssues(): Promise<any> {
        const searchResult = await ApiController.fetchJira(
            this.controller.url,
            `rest/api/latest/search?jql=assignee=currentuser() OR reporter=currentuser() ORDER BY updated desc`,
            'GET',
            this.controller.credentials);
        this.issues = searchResult.issues.map((issue: Task) => new JiraTask(issue, this.controller));
        this.totalIssues = searchResult.total;
        return {issues: this.issues, total: this.totalIssues};
    }
}
