import ApiController from "./ApiController";
import JiraBaseController from "./JiraBaseController";
import {JiraCommits, JiraIssue, JiraPullRequests, JiraWorkLog} from "../../types/Jira";
import Commits = JiraCommits.Commits;
import Task = JiraIssue.Task;
import PullRequests = JiraPullRequests.PullRequests;

export default class JiraTask extends ApiController {
    task: Task;
    private readonly _controller: JiraBaseController;

    commitData: Commits | undefined;
    pullRequestData: PullRequests | undefined;

    constructor(task: Task, controller: JiraBaseController) {
        super();
        this.task = task;
        this._controller = controller;
        this.getConnectedData();
    }

    async updateSelf() {
        const url = new URL(this.task.self);
        [this.task] = await Promise.all([
            ApiController.fetchJira(
                this._controller.url,
                `${url.pathname.replace(/\//, '')}`,
                'GET',
                this._controller.credentials),
            this.getConnectedData()
        ])
        return self;
    }

    async getConnectedData() {
        const dataUrl = `rest/dev-status/latest/issue/detail?issueId=${this.task.id}&applicationType=bitbucket&dataType`;
        [this.commitData, this.pullRequestData] = await Promise.all([
            ApiController.fetchJira(
                this._controller.url,
                `${dataUrl}=repository`,
                'GET',
                this._controller.credentials),
            ApiController.fetchJira(
                this._controller.url,
                `${dataUrl}=pullrequest`,
                'GET',
                this._controller.credentials)
        ])
    }

    async addWorkLog(seconds: number) {
        const result = await ApiController.fetchJira(
            this._controller.url,
            `rest/api/latest/issue/${this.task.key}/worklog`,
            'POST',
            this._controller.credentials, {
                timeSpentSeconds: seconds
            });
        await this.updateSelf();
        return result;
    }

}
