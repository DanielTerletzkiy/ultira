import ApiController, { FetchContentType } from "./ApiController";
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
    }
    async updateSelf(updateConnected) {
        const url = new URL(this.task.self);
        [this.task] = await Promise.all([
            ApiController.fetchJira(this._controller.url, `${url.pathname.replace(/\//, '')}`, 'GET', this._controller.credentials),
            updateConnected ? this.getConnectedData() : null
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
        const result = await ApiController.fetchJira(this._controller.url, `rest/api/latest/issue/${this.task.key}/worklog`, 'POST', this._controller.credentials, FetchContentType.JSON, {
            timeSpentSeconds: seconds
        });
        await this.updateSelf(true);
        return result;
    }
    async addComment(body) {
        const result = await ApiController.fetchJira(this._controller.url, `rest/api/latest/issue/${this.task.key}/comment`, 'POST', this._controller.credentials, FetchContentType.JSON, {
            body
        });
        await this.updateSelf(true);
        return result;
    }
}
//# sourceMappingURL=JiraTask.js.map