import ApiController from "./ApiController";
import { ref } from "vue";
export default class JiraTask extends ApiController {
    _task;
    _controller;
    _commitData = ref();
    _pullRequestData = ref();
    _workLogData = ref();
    constructor(task, controller) {
        super();
        this._task = task;
        this._controller = controller;
        this.getConnectedData();
    }
    async updateSelf() {
        const url = new URL(this._task.self);
        [this._task] = await Promise.all([
            ApiController.fetchJira(this._controller.url, `${url.pathname.replace(/\//, '')}`, 'GET', this._controller.credentials),
            this.getConnectedData()
        ]);
        return self;
    }
    async getConnectedData() {
        const dataUrl = `rest/dev-status/latest/issue/detail?issueId=${this._task.id}&applicationType=bitbucket&dataType`;
        [/*this._workLogData.value,*/ this._commitData.value, this._pullRequestData.value] = await Promise.all([
            /*ApiController.fetchJira(
                this._controller.url,
                `rest/api/latest/issue/${this._task.key}/worklog`,
                'GET',
                this._controller.credentials),*/
            ApiController.fetchJira(this._controller.url, `${dataUrl}=repository`, 'GET', this._controller.credentials),
            ApiController.fetchJira(this._controller.url, `${dataUrl}=pullrequest`, 'GET', this._controller.credentials)
        ]);
    }
    async addWorkLog(seconds) {
        const result = await ApiController.fetchJira(this._controller.url, `rest/api/latest/issue/${this._task.key}/worklog`, 'POST', this._controller.credentials, {
            timeSpentSeconds: seconds
        });
        await this.updateSelf();
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