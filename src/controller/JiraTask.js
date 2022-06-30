import ApiController from "./ApiController";
export default class JiraTask extends ApiController {
    _controller;
    task;
    commitData;
    pullRequestData;
    commentsData;
    transitionData;
    loading = false;
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
        return this;
    }
    async getConnectedData() {
        this.loading = true;
        const applicationUrl = `rest/dev-status/latest/issue/detail?issueId=${this.task.id}&applicationType=${this._controller.applicationType}&dataType`;
        const issueBaseUrl = `rest/api/latest/issue/${this.task.key}`;
        let commitData;
        let pullRequestData;
        [commitData, pullRequestData, this.commentsData, this.transitionData] = await Promise.all([
            ApiController.fetchJira(this._controller.url, `${applicationUrl}=repository`, 'GET', this._controller.credentials),
            ApiController.fetchJira(this._controller.url, `${applicationUrl}=pullrequest`, 'GET', this._controller.credentials),
            ApiController.fetchJira(this._controller.url, `${issueBaseUrl}/comment`, 'GET', this._controller.credentials),
            ApiController.fetchJira(this._controller.url, `${issueBaseUrl}/transitions`, 'GET', this._controller.credentials)
        ]);
        if (((commitData && commitData?.detail.length > 0 && commitData?.detail[0].repositories.length > 0) &&
            (this.hasCommits)) ||
            !this.commitData) {
            this.commitData = Object.assign({}, commitData);
        }
        if (((pullRequestData && pullRequestData?.detail.length > 0 && pullRequestData?.detail[0].pullRequests.length > 0) &&
            (this.hasPullRequests)) ||
            !this.pullRequestData) {
            this.pullRequestData = Object.assign({}, pullRequestData);
        }
        this.loading = false;
    }
    async addWorkLog(seconds) {
        const result = await ApiController.fetchJira(this._controller.url, `rest/api/latest/issue/${this.task.key}/worklog`, 'POST', this._controller.credentials, 0 /* JSON */, {
            timeSpentSeconds: seconds
        });
        await this.updateSelf(true);
        return result;
    }
    async addComment(body) {
        const result = await ApiController.fetchJira(this._controller.url, `rest/api/latest/issue/${this.task.key}/comment`, 'POST', this._controller.credentials, 0 /* JSON */, {
            body
        });
        await this.updateSelf(true);
        return result;
    }
    get hasCommits() {
        return this.commitData && this.commitData?.detail.length > 0 && this.commitData?.detail[0].repositories.length > 0;
    }
    get commitsEmpty() {
        return this.commitData && this.commitData?.detail.length > 0 && this.commitData?.detail[0].repositories.length === 0;
    }
    get hasPullRequests() {
        return this.pullRequestData && this.pullRequestData?.detail.length > 0 && this.pullRequestData?.detail[0].pullRequests.length > 0;
    }
    get pullRequestsEmpty() {
        return this.pullRequestData && this.pullRequestData?.detail.length > 0 && this.pullRequestData?.detail[0].pullRequests.length === 0;
    }
}
//# sourceMappingURL=JiraTask.js.map