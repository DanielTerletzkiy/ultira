import SocketClient from "../service/SocketIOClient";
import Project from "../model/Project";
import { JiraIssue } from "../../types/Jira";
import ApiController from "./ApiController";
import Task = JiraIssue.Task;

export default class ProjectController extends ApiController {
  static subscribe(callback: (data: Array<Project>) => void) {
    SocketClient.instance.on("project/scan/complete", callback);
  }

  static subscribeBranches(callback: (data: Array<Project>) => void) {
    SocketClient.instance.on("branches/scan/complete", callback);
  }

  static async open(project: Project, issue: Task["key"]) {
    return await ApiController.generic(
      "http://localhost:2343/api/project/open",
      "POST",
      undefined,
      {
        project,
        issue,
      }
    );
  }

  static async scrape(path: Project["path"]) {
    return await ApiController.generic(
      "http://localhost:2343/api/project/scrape/projects/" + path,
      "GET"
    );
  }

  static async scrapeBranches(paths: Array<Project["path"]>) {
    return await ApiController.generic(
      "http://localhost:2343/api/project/scrape/branches",
      "POST",
      undefined,
      paths
    );
  }
}
