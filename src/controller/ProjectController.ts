import SocketClient from "../service/SocketIOClient";
import { ChangeStep, Project } from "../../types/Jira";
import ApiController from "./ApiController";
import { JiraIssue as Task } from "../../types/JiraIssue";
import store, { changeSteps } from "../store/jira.store";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export default class ProjectController extends ApiController {
  static subscribe(callback: (data: Array<Project>) => void) {
    ipcRenderer.on("result/scrape/directory", (event, arg) => callback(arg));
  }

  static subscribeBranches(callback: (data: Array<Project>) => void) {
    ipcRenderer.on("result/scrape/branches", (event, arg) => callback(arg));
  }

  static subscribeChangeStep(callback: (data: Array<ChangeStep>) => void) {
    ipcRenderer.on("result/change/step", (event, arg) => callback(arg));
  }

  static clearChangeSteps() {
    // @ts-ignore
    store.replaceState(Object.assign(store.state, { changeSteps: [] }));
    console.log(store.state.changeSteps);
  }

  static open(project: Project, issue: Task["key"]) {
    return ipcRenderer.send("open/project", { path: project.path, issue });
  }

  static openFile(project: Project, file: string) {
    console.log(project, file);
    return ipcRenderer.send("open/file", { path: project.path, file });
  }

  static scrape(path: Project["path"]) {
    return ipcRenderer.send("scrape/directory", { path });
  }

  static async scrapeBranches(projectPaths: Array<Project["path"]>) {
    return ipcRenderer.send("scrape/branches", { projectPaths });

  }
}
