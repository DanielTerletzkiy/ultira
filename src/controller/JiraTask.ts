import ApiController from "./ApiController";
import JiraBaseController from "./JiraBaseController";
// @ts-ignore
import {JiraCommits, JiraIssue, JiraPullRequests} from "../../../../shared/types/Jira";
import Commits = JiraCommits.Commits;
import Task = JiraIssue.Task;
import PullRequests = JiraPullRequests.PullRequests;

export default class JiraTask extends ApiController {
    private readonly _task: Task;
    private readonly _controller: JiraBaseController;

    private _commitData: Commits | undefined;
    private _pullRequestData: PullRequests | undefined;

    constructor(task: Task, controller: JiraBaseController) {
        super();
        this._task = task;
        this._controller = controller;
        this.getConnectedData();
    }

    async getConnectedData(){
        const dataUrl = `rest/dev-status/latest/issue/detail?issueId=${this._task.id}&applicationType=bitbucket&dataType`
        this._commitData = await ApiController.fetchJira(
            this._controller.url,
            `${dataUrl}=repository`,
            'GET',
            this._controller.credentials);

        this._pullRequestData = await ApiController.fetchJira(
            this._controller.url,
            `${dataUrl}=pullrequest`,
            'GET',
            this._controller.credentials);
    }


    get commitData(): JiraCommits.Commits | undefined {
        return this._commitData;
    }

    get pullRequestData(): JiraPullRequests.PullRequests | undefined {
        return this._pullRequestData;
    }

    get task(): Task {
        return this._task;
    }

}
