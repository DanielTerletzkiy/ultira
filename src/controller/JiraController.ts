import ApiController, { FetchContentType } from "./ApiController";
import JiraBaseController from "./JiraBaseController";
import JiraTask from "../model/JiraTask";
import { currentIssueKey, maxResults } from "../store/jira.store";
import { ref, Ref } from "vue";
import { JiraIssue as Task, User } from "../../types/JiraIssue";

export default class JiraController extends ApiController {
  static controller: JiraBaseController;
  static issues: Ref<Array<JiraTask>> = ref([]);
  static totalIssues: Ref<number> = ref(0);
  static myself: Ref<User | undefined> = ref();

  static setBase(baseController: JiraBaseController) {
    JiraController.controller = baseController;
  }

  static async getAllIssues(): Promise<any> {
    const searchResult = await ApiController.fetchJira(
      JiraController.controller.url,
      `rest/api/latest/search?maxResults=${maxResults.value}&expand=names,editmeta,changelog&jql=assignee=currentuser() OR reporter=currentuser() OR watcher = currentUser() ORDER BY updated desc`,
      "GET",
      JiraController.controller.credentials
    );

    if (JiraController.issues.value.length > 0) {
      JiraController.issues.value.forEach((issue) => {
        issue.updateSelf(issue.task.key === currentIssueKey.value);
      });
    }

    for (const issue of searchResult.issues) {
      if (
        JiraController.issues.value.length > 0 &&
        JiraController.issues.value.findIndex((x) => x.task.key === issue.key) >
          -1
      ) {
        //return this.issues.find((x) => x.task.key === issue.key);
      } else {
        JiraController.issues.value.push(
          await new JiraTask(issue, JiraController.controller)
        );
        JiraController.issues.value.find((x)=>x.task.key === issue.key)?.updateSelf(true);
      }
    }

    JiraController.totalIssues = searchResult.total;
    return {
      issues: JiraController.issues.value,
      total: JiraController.totalIssues,
    };
  }

  static clearIssues() {
    JiraController.issues.value = [];
  }

  static async getImageBase64(url: string): Promise<string> {
    const urlObj = new URL(url);

    const response = await ApiController.fetchJira(
      JiraController.controller.url,
      `${urlObj.pathname.substring(1)}${urlObj.search}`,
      "GET",
      JiraController.controller.credentials,
      FetchContentType.FILES
    );

    return URL.createObjectURL(response);
  }

  static async getMyself() {
    this.myself.value = await ApiController.fetchJira(
      JiraController.controller.url,
      `rest/api/latest/myself`,
      "GET",
      JiraController.controller.credentials
    );
    return this.myself;
  }

  static get issueKeys(): Array<Task["key"]> {
    return JiraController.issues.value.map((issue) => issue.task.key);
  }
}
