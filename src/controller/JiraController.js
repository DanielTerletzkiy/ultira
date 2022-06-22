import ApiController from "./ApiController";
import JiraTask from "./JiraTask";
import { selectedIssue } from "../store/jira.store";
export default class JiraController extends ApiController {
    controller;
    issues = [];
    totalIssues = 0;
    constructor(baseController) {
        super();
        this.controller = baseController;
    }
    async getAllIssues() {
        const searchResult = await ApiController.fetchJira(this.controller.url, `rest/api/latest/search?maxResults=1000&jql=assignee=currentuser() OR reporter=currentuser() OR watcher = currentUser() ORDER BY updated desc`, 'GET', this.controller.credentials);
        if (this.issues.length > 0) {
            this.issues.forEach((issue) => {
                issue.updateSelf(issue.task.key === selectedIssue.value);
            });
        }
        for (const issue of searchResult.issues) {
            if (this.issues.length > 0 && this.issues.findIndex((x) => x.task.key === issue.key) > -1) {
                //return this.issues.find((x) => x.task.key === issue.key);
            }
            else {
                this.issues.push(await new JiraTask(issue, this.controller));
            }
        }
        this.totalIssues = searchResult.total;
        return { issues: this.issues, total: this.totalIssues };
    }
    async getImageBase64(url) {
        const urlObj = new URL(url);
        const response = await ApiController.fetchJira(this.controller.url, `${urlObj.pathname.substring(1)}${urlObj.search}`, 'GET', this.controller.credentials, 1 /* FILES */);
        const contentType = response.headers.get("content-type");
        switch (contentType) {
            case "image/svg+xml":
            case "image/svg+xml;charset=UTF-8": {
                const text = await response.text();
                return `data:image/svg+xml,${encodeURIComponent(text)}`;
            }
            default: {
                const buffer = await response.arrayBuffer();
                const bytes = new Uint8Array(buffer);
                const len = bytes.byteLength;
                let binary = "";
                for (let i = 0; i < len; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                return `data:image/jpeg;base64,${btoa(binary)}`;
            }
        }
    }
}
//# sourceMappingURL=JiraController.js.map