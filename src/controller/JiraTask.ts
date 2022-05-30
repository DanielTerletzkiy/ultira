import ApiController from "./ApiController";
import JiraBaseController from "./JiraBaseController";
import {JiraCommits, JiraIssue, JiraPullRequests, JiraWorkLog} from "../../types/Jira";
import Commits = JiraCommits.Commits;
import Task = JiraIssue.Task;
import PullRequests = JiraPullRequests.PullRequests;
import WorkLogRoot = JiraWorkLog.WorkLogRoot;
import {Ref, ref} from "vue";
import {getCurrentInstance} from "vue";

export default class JiraTask extends ApiController {
    task: Task;
    private readonly _controller: JiraBaseController;

    commitData = ref<Commits | undefined>(undefined);
    pullRequestData = ref<PullRequests | undefined>(undefined);
    //private _workLogData = ref<WorkLogRoot | undefined>();

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
        [this.commitData.value, this.pullRequestData.value] = await Promise.all([
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
        console.log(this.commitData.value)
        getCurrentInstance()?.proxy?.$forceUpdate();
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
