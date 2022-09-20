import ApiController from "../controller/ApiController";
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
        this.getConnectedData();
    }
    async updateSelf(updateConnected) {
        const url = new URL(this.task.self);
        let task;
        [task] = await Promise.all([
            ApiController.fetchJira(this._controller.url, `${url.pathname.replace(/\//, "")}`, "GET", this._controller.credentials),
            updateConnected ? this.getConnectedData() : null
        ]);
        this.task = Object.assign({}, task);
        if (this.task.fields.status.name !== task.fields.status.name) {
            this.getConnectedData();
        }
        return this;
    }
    async getConnectedData() {
        console.log("get connected data", this.task.key);
        this.loading = true;
        const applicationUrl = `rest/dev-status/latest/issue/detail?issueId=${this.task.id}&applicationType=${this._controller.applicationType}&dataType`;
        const issueBaseUrl = `rest/api/latest/issue/${this.task.key}`;
        let commitData = undefined, pullRequestData = undefined, commentsData = undefined, transitionData = undefined;
        [commitData, pullRequestData, commentsData, transitionData] =
            await Promise.all([
                ApiController.fetchJira(this._controller.url, `${applicationUrl}=repository`, "GET", this._controller.credentials),
                ApiController.fetchJira(this._controller.url, `${applicationUrl}=pullrequest`, "GET", this._controller.credentials),
                ApiController.fetchJira(this._controller.url, `${issueBaseUrl}/comment`, "GET", this._controller.credentials),
                ApiController.fetchJira(this._controller.url, `${issueBaseUrl}/transitions`, "GET", this._controller.credentials)
            ]);
        if ((commitData &&
            commitData?.detail.length > 0 &&
            commitData?.detail[0].repositories.length > 0 &&
            this.hasCommits) ||
            this.commitsEmpty ||
            !this.commitData) {
            this.commitData = Object.assign({}, commitData);
        }
        if ((pullRequestData &&
            pullRequestData?.detail.length > 0 &&
            pullRequestData?.detail[0].pullRequests.length > 0 &&
            this.hasPullRequests) ||
            this.pullRequestsEmpty ||
            !this.pullRequestData) {
            this.pullRequestData = Object.assign({}, pullRequestData);
        }
        if (commentsData) {
            this.commentsData = Object.assign(commentsData);
        }
        if (transitionData) {
            this.transitionData = Object.assign(transitionData);
        }
        this.loading = false;
    }
    async addWorkLog(seconds) {
        const result = await ApiController.fetchJira(this._controller.url, `rest/api/latest/issue/${this.task.key}/worklog`, "POST", this._controller.credentials, 0 /* JSON */, {
            timeSpentSeconds: seconds
        });
        await this.updateSelf(true);
        return result;
    }
    async addComment(body) {
        const result = await ApiController.fetchJira(this._controller.url, `rest/api/latest/issue/${this.task.key}/comment`, "POST", this._controller.credentials, 0 /* JSON */, {
            body
        });
        await this.updateSelf(true);
        return result;
    }
    async updateTransition(id) {
        try {
            await ApiController.fetchJira(this._controller.url, `rest/api/latest/issue/${this.task.key}/transitions`, "POST", this._controller.credentials, 0 /* JSON */, {
                transition: { id }
            });
        }
        catch (e) {
            console.warn(e);
        }
        await this.updateSelf(true);
        return true;
    }
    get hasCommits() {
        return (this.commitData &&
            this.commitData?.detail.length > 0 &&
            this.commitData?.detail[0].repositories.length > 0);
    }
    get commitsEmpty() {
        return (this.commitData &&
            (this.commitData?.detail.length > 0 &&
                this.commitData?.detail[0].repositories.length === 0) ||
            (this.commitData?.errors &&
                this.commitData?.errors.length > 0));
    }
    get hasPullRequests() {
        return (this.pullRequestData &&
            this.pullRequestData?.detail.length > 0 &&
            this.pullRequestData?.detail[0].pullRequests.length > 0);
    }
    get pullRequestsEmpty() {
        return (this.pullRequestData &&
            (this.pullRequestData?.detail.length > 0 &&
                this.pullRequestData?.detail[0].pullRequests.length === 0) ||
            (this.pullRequestData?.errors &&
                this.pullRequestData?.errors.length > 0));
    }
}
//# sourceMappingURL=JiraTask.js.map