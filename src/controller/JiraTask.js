import ApiController from "./ApiController";
export default class JiraTask extends ApiController {
    _task;
    _controller;
    _commitData;
    _pullRequestData;
    constructor(task, controller) {
        super();
        this._task = task;
        this._controller = controller;
        this.getConnectedData();
    }
    async getConnectedData() {
        const dataUrl = `rest/dev-status/latest/issue/detail?issueId=${this._task.id}&applicationType=bitbucket&dataType`;
        this._commitData = await ApiController.fetchJira(this._controller.url, `${dataUrl}=repository`, 'GET', this._controller.credentials);
        this._pullRequestData = await ApiController.fetchJira(this._controller.url, `${dataUrl}=pullrequest`, 'GET', this._controller.credentials);
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