import ApiController from "./ApiController";
import JiraBaseController from "./JiraBaseController";
import JiraTask from "./JiraTask";
import {JiraIssue} from "../../types/Jira";
import Task = JiraIssue.Task;

export default class JiraController extends ApiController {
    controller: JiraBaseController;
    issues: Array<JiraTask> = [];
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
        //TODO make it better
        if (this.issues) {
            searchResult.issues.filter((issue: Task) => this.issues.find((e) => e.task.key === issue.key)?.updateSelf())
        }
        if (this.issues.length !== searchResult.issues.length) {
            this.issues = searchResult.issues.map((issue: Task) => {
                if (!this.issues.find((e) => e.task.key === issue.key)) {
                    return new JiraTask(issue, this.controller)
                }
            });
        }
        this.totalIssues = searchResult.total;
        return {issues: this.issues, total: this.totalIssues};
    }
}
