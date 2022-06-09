import ApiController from "./ApiController";
export default class JiraTask extends ApiController {
    _controller;
    task;
    commitData;
    pullRequestData;
    commentsData;
    transitionData;
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
        const applicationUrl = `rest/dev-status/latest/issue/detail?issueId=${this.task.id}&applicationType=${this._controller.applicationType}&dataType`;
        const issueBaseUrl = `rest/api/latest/issue/${this.task.key}`;
        [this.commitData, this.pullRequestData, this.commentsData, this.transitionData] = await Promise.all([
            ApiController.fetchJira(this._controller.url, `${applicationUrl}=repository`, 'GET', this._controller.credentials),
            ApiController.fetchJira(this._controller.url, `${applicationUrl}=pullrequest`, 'GET', this._controller.credentials),
            ApiController.fetchJira(this._controller.url, `${issueBaseUrl}/comment`, 'GET', this._controller.credentials),
            ApiController.fetchJira(this._controller.url, `${issueBaseUrl}/transitions`, 'GET', this._controller.credentials)
        ]);
    }
    async addWorkLog(seconds) {
        const result = await ApiController.fetchJira(this._controller.url, `rest/api/latest/issue/${this.task.key}/worklog`, 'POST', this._controller.credentials, 0 /* JSON */, {
            timeSpentSeconds: seconds
        });
        await this.updateSelf();
        return result;
    }
    async addComment(body) {
        const result = await ApiController.fetchJira(this._controller.url, `rest/api/latest/issue/${this.task.key}/comment`, 'POST', this._controller.credentials, 0 /* JSON */, {
            body
        });
        await this.updateSelf();
        return result;
    }
}
//# sourceMappingURL=JiraTask.js.map