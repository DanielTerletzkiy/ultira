import ApiController from "./ApiController";
import JiraTask from "./JiraTask";
import { currentIssueKey } from "../store/jira.store";
import { ref } from "vue";
export default class JiraController extends ApiController {
    static controller;
    static issues = ref([]);
    static totalIssues = ref(0);
    static setBase(baseController) {
        JiraController.controller = baseController;
    }
    static async getAllIssues() {
        const searchResult = await ApiController.fetchJira(JiraController.controller.url, `rest/api/latest/search?maxResults=1000&jql=assignee=currentuser() OR reporter=currentuser() OR watcher = currentUser() ORDER BY updated desc`, 'GET', JiraController.controller.credentials);
        if (JiraController.issues.value.length > 0) {
            JiraController.issues.value.forEach((issue) => {
                issue.updateSelf(issue.task.key === currentIssueKey.value);
            });
        }
        for (const issue of searchResult.issues) {
            if (JiraController.issues.value.length > 0 && JiraController.issues.value.findIndex((x) => x.task.key === issue.key) > -1) {
                //return this.issues.find((x) => x.task.key === issue.key);
            }
            else {
                JiraController.issues.value.push(await new JiraTask(issue, JiraController.controller));
            }
        }
        JiraController.totalIssues = searchResult.total;
        return { issues: JiraController.issues.value, total: JiraController.totalIssues };
    }
    static async getImageBase64(url) {
        const urlObj = new URL(url);
        const response = await ApiController.fetchJira(JiraController.controller.url, `${urlObj.pathname.substring(1)}${urlObj.search}`, 'GET', JiraController.controller.credentials, 1 /* FILES */);
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
    static get issueKeys() {
        return JiraController.issues.value.map((issue) => issue.task.key);
    }
}
//# sourceMappingURL=JiraController.js.map