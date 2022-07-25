import ApiController from "./ApiController";
const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;
export default class ProjectController extends ApiController {
    static subscribe(callback) {
        ipcRenderer.on("result/scrape/directory", (event, arg) => callback(arg));
    }
    static subscribeBranches(callback) {
        ipcRenderer.on("result/scrape/branches", (event, arg) => callback(arg));
    }
    static open(project, issue) {
        return ipcRenderer.send("open/project", { path: project.path, issue });
    }
    static openFile(project, file) {
        console.log(project, file);
        return ipcRenderer.send("open/file", { path: project.path, file });
    }
    static scrape(path) {
        return ipcRenderer.send("scrape/directory", { path });
    }
    static async scrapeBranches(projectPaths) {
        return ipcRenderer.send("scrape/branches", { projectPaths });
    }
}
//# sourceMappingURL=ProjectController.js.map