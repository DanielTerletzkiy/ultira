import SocketClient from "../service/SocketIOClient";
import { ChangeStep, Project } from "../../types/Jira";
import ApiController from "./ApiController";
import { JiraIssue as Task } from "../../types/JiraIssue";
import store, { changeSteps } from "../store/jira.store";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export default class ProjectController extends ApiController {

  static subscribeLoading(callback: (data: { loading: boolean, type: string }) => void) {
    ipcRenderer.on("loading", (event, arg) => callback(arg));
  }

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

  static changeBranch(project: Project, issue: Task["key"]) {
    return ipcRenderer.send("project/change", { project: JSON.stringify(project), issue });
  }

  static changeDefault(project: Project) {
    return ipcRenderer.send("project/change/default", { project: JSON.stringify(project) });
  }

  static update(project: Project) {
    return ipcRenderer.send("project/update", { project: JSON.stringify(project) });
  }

  static open(project: Project) {
    return ipcRenderer.send("project/open", { project: JSON.stringify(project) });
  }

  static openFile(project: Project, file: string) {
    return ipcRenderer.send("project/file", { project: JSON.stringify(project), file });
  }

  static scrape(path: Project["path"]) {
    return ipcRenderer.send("scrape/directory", { path });
  }

  static async scrapeBranches(projectPaths: Array<Project["path"]>) {
    return ipcRenderer.send("scrape/branches", { projectPaths });

  }
}
