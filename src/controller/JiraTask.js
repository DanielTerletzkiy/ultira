import ApiController from "./ApiController";
export default class JiraTask extends ApiController {
    task;
    _controller;
    commitData;
    pullRequestData;
    constructor(task, controller) {
        super();
        this.task = task;
        this._controller = controller;
        this.getConnectedData();
    }
    async updateSelf() {
        const url = new URL(this.task.self);
        [this.task] = await Promise.all([
            ApiController.fetchJira(this._controller.url, `${url.pathname.replace(/\//, '')}`, 'GET', this._controller.credentials),
            this.getConnectedData()
        ]);
        return self;
    }
    async getConnectedData() {
        const dataUrl = `rest/dev-status/latest/issue/detail?issueId=${this.task.id}&applicationType=bitbucket&dataType`;
        [this.commitData, this.pullRequestData] = await Promise.all([
            ApiController.fetchJira(this._controller.url, `${dataUrl}=repository`, 'GET', this._controller.credentials),
            ApiController.fetchJira(this._controller.url, `${dataUrl}=pullrequest`, 'GET', this._controller.credentials)
        ]);
    }
    async addWorkLog(seconds) {
        const result = await ApiController.fetchJira(this._controller.url, `rest/api/latest/issue/${this.task.key}/worklog`, 'POST', this._controller.credentials, {
            timeSpentSeconds: seconds
        });
        await this.updateSelf();
        return result;
    }
}
//# sourceMappingURL=JiraTask.js.map