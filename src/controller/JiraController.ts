import ApiController, {FetchContentType} from "./ApiController";
import JiraBaseController from "./JiraBaseController";
import JiraTask from "./JiraTask";
import {JiraIssue} from "../../types/Jira";
import Task = JiraIssue.Task;
import {selectedIssue} from "../store/jira.store";
import {raw} from "concurrently/dist/src/defaults";

export default class JiraController extends ApiController {
    controller: JiraBaseController;
    issues: Array<JiraTask> = [];
    totalIssues: number = 0;

    constructor(baseController: JiraBaseController) {
        super();
        this.controller = baseController;
    }

    async getAllIssues(): Promise<any> {
        const searchResult = await ApiController.fetchJira(
            this.controller.url,
            `rest/api/latest/search?maxResults=1000&jql=assignee=currentuser() OR reporter=currentuser() ORDER BY updated desc`,
            'GET',
            this.controller.credentials);

        if (this.issues.length > 0) {
            this.issues.forEach((issue) => {
                issue.updateSelf(issue.task.key === selectedIssue.value)
            });
        }

        for (const issue of searchResult.issues) {
            if (this.issues.length > 0 && this.issues.findIndex((x) => x.task.key === issue.key) > -1) {
                //return this.issues.find((x) => x.task.key === issue.key);
            } else {
                this.issues.push(await new JiraTask(issue, this.controller))
            }
        }

        console.log(this.issues)

        this.totalIssues = searchResult.total;
        return {issues: this.issues, total: this.totalIssues};
    }

    async getImageBase64(url: string): Promise<string> {
        const urlObj = new URL(url);

        const response = await ApiController.fetchJira(
            this.controller.url,
            `${urlObj.pathname.substring(1)}${urlObj.search}`,
            'GET',
            this.controller.credentials, FetchContentType.FILES)

        const contentType = response.headers.get("content-type");

        switch (contentType) {
            case "image/svg+xml":
            case "image/svg+xml;charset=UTF-8": {
                const text = await response.text()
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
