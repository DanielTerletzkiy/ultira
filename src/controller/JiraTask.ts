import ApiController from "./ApiController";
import JiraBaseController from "./JiraBaseController";
import {JiraCommits, JiraIssue, JiraPullRequests, JiraWorkLog} from "../../types/Jira";
import Commits = JiraCommits.Commits;
import Task = JiraIssue.Task;
import PullRequests = JiraPullRequests.PullRequests;
import WorkLogRoot = JiraWorkLog.WorkLogRoot;
import {Ref, ref} from "vue";

export default class JiraTask extends ApiController {
    private _task: Task;
    private readonly _controller: JiraBaseController;

    private _commitData = ref<Commits | undefined>();
    private _pullRequestData = ref<PullRequests | undefined>();
    private _workLogData = ref<WorkLogRoot | undefined>();

    constructor(task: Task, controller: JiraBaseController) {
        super();
        this._task = task;
        this._controller = controller;
        this.getConnectedData();
    }

    async updateSelf() {
        const url = new URL(this._task.self);
        [this._task] = await Promise.all([
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
        const dataUrl = `rest/dev-status/latest/issue/detail?issueId=${this._task.id}&applicationType=bitbucket&dataType`;
        [/*this._workLogData.value,*/this._commitData.value, this._pullRequestData.value] = await Promise.all([
            /*ApiController.fetchJira(
                this._controller.url,
                `rest/api/latest/issue/${this._task.key}/worklog`,
                'GET',
                this._controller.credentials),*/
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
            `rest/api/latest/issue/${this._task.key}/worklog`,
            'POST',
            this._controller.credentials, {
                timeSpentSeconds: seconds
            });
        await this.updateSelf();
        return result;
    }

    get commitData(): Ref<JiraCommits.Commits | undefined> {
        return this._commitData;
    }

    get pullRequestData(): Ref<JiraPullRequests.PullRequests | undefined> {
        return this._pullRequestData;
    }

    get task(): Task {
        return this._task;
    }

}
