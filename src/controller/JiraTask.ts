import ApiController from "./ApiController";
import JiraBaseController from "./JiraBaseController";
import {JiraComments, JiraCommits, JiraIssue, JiraPullRequests, JiraWorkLog} from "../../types/Jira";
import Commits = JiraCommits.Commits;
import Task = JiraIssue.Task;
import PullRequests = JiraPullRequests.PullRequests;
import CommentsRoot = JiraComments.CommentsRoot;

export default class JiraTask extends ApiController {
    private readonly _controller: JiraBaseController;
    task: Task;

    commitData: Commits | undefined;
    pullRequestData: PullRequests | undefined;
    commentsData: CommentsRoot | undefined;

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
        const dataUrl = `rest/dev-status/latest/issue/detail?issueId=${this.task.id}&applicationType=${this._controller.applicationType}&dataType`;
        [this.commitData, this.pullRequestData, this.commentsData] = await Promise.all([
            ApiController.fetchJira(
                this._controller.url,
                `${dataUrl}=repository`,
                'GET',
                this._controller.credentials),
            ApiController.fetchJira(
                this._controller.url,
                `${dataUrl}=pullrequest`,
                'GET',
                this._controller.credentials),
            ApiController.fetchJira(
                this._controller.url,
                `rest/api/latest/issue/${this.task.key}/comment`,
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

    async addComment(body: string){
        const result = await ApiController.fetchJira(
            this._controller.url,
            `rest/api/latest/issue/${this.task.key}/comment`,
            'POST',
            this._controller.credentials, {
                body
            });
        await this.updateSelf();
        return result;
    }

}
