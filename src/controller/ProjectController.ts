import SocketClient from "../service/SocketIOClient";
import { JiraIssue, Project } from "../../types/Jira";
import ApiController from "./ApiController";
import Task = JiraIssue.Task;

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export default class ProjectController extends ApiController {
  static subscribe(callback: (data: Array<Project>) => void) {
    ipcRenderer.on("result/scrape/directory", (event, arg) => callback(arg));
  }

  static subscribeBranches(callback: (data: Array<Project>) => void) {
    ipcRenderer.on("result/scrape/branches", (event, arg) => callback(arg));
  }

  static open(project: Project, issue: Task["key"]) {
    return ipcRenderer.send("open/project", { path: project.path, issue });
  }

  static openFile(project: Project, file: string) {
    console.log(project, file)
    return ipcRenderer.send("open/file", { path: project.path, file });
  }

  static scrape(path: Project["path"]) {
    return ipcRenderer.send("scrape/directory", { path });
  }

  static async scrapeBranches(projectPaths: Array<Project["path"]>) {
    return ipcRenderer.send("scrape/branches", { projectPaths });

  }
}
