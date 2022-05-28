import ApiController from "./ApiController";
export default class JiraTask extends ApiController {
    _task;
    _controller;
    _commitData;
    _pullRequestData;
    _workLogData;
    constructor(task, controller) {
        super();
        this._task = task;
        this._controller = controller;
        this.getConnectedData();
    }
    async _updateSelf() {
        const url = new URL(this._task.self);
        [this._task] = await Promise.all([
            ApiController.fetchJira(this._controller.url, `${url.pathname.replace(/\//, '')}`, 'GET', this._controller.credentials),
            this.getConnectedData()
        ]);
    }
    async getConnectedData() {
        const dataUrl = `rest/dev-status/latest/issue/detail?issueId=${this._task.id}&applicationType=bitbucket&dataType`;
        [this._workLogData, this._commitData, this._pullRequestData] = await Promise.all([
            ApiController.fetchJira(this._controller.url, `rest/api/latest/issue/${this._task.key}/worklog`, 'GET', this._controller.credentials),
            ApiController.fetchJira(this._controller.url, `${dataUrl}=repository`, 'GET', this._controller.credentials),
            ApiController.fetchJira(this._controller.url, `${dataUrl}=pullrequest`, 'GET', this._controller.credentials)
        ]);
    }
    async addWorkLog(seconds) {
        const result = await ApiController.fetchJira(this._controller.url, `rest/api/latest/issue/${this._task.key}/worklog`, 'POST', this._controller.credentials, {
            timeSpentSeconds: seconds
        });
        await this._updateSelf();
        return result;
    }
    get commitData() {
        return this._commitData;
    }
    get pullRequestData() {
        return this._pullRequestData;
    }
    get task() {
        return this._task;
    }
}
//# sourceMappingURL=JiraTask.js.map