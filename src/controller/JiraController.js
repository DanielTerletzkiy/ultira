import ApiController from "./ApiController";
import JiraTask from "./JiraTask";
export default class JiraController extends ApiController {
    controller;
    issues = [];
    totalIssues = 0;
    constructor(baseController) {
        super();
        this.controller = baseController;
    }
    async getAllIssues() {
        const searchResult = await ApiController.fetchJira(this.controller.url, `rest/api/latest/search?jql=assignee=currentuser() OR reporter=currentuser() ORDER BY updated desc`, 'GET', this.controller.credentials);
        //TODO make it better
        if (this.issues) {
            searchResult.issues.filter((issue) => this.issues.find((e) => e.task.key === issue.key)?.updateSelf());
        }
        if (this.issues.length !== searchResult.issues.length) {
            this.issues = searchResult.issues.map((issue) => {
                if (!this.issues.find((e) => e.task.key === issue.key)) {
                    return new JiraTask(issue, this.controller);
                }
            });
        }
        this.totalIssues = searchResult.total;
        return { issues: this.issues, total: this.totalIssues };
    }
    async getImageBase64(url) {
        console.log(url);
        const urlObj = new URL(url);
        console.log(urlObj.pathname, urlObj.search);
        const result = await ApiController.fetchJira(this.controller.url, `${urlObj.pathname.substring(1)}${urlObj.search}`, 'GET', this.controller.credentials, 1 /* FILES */);
        const buffer = await result.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        let binary = "";
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return `data:image/jpeg;base64,${btoa(binary)}`;
    }
}
//# sourceMappingURL=JiraController.js.map