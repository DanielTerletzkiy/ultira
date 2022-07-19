import SocketClient from "../service/SocketIOClient";
import ApiController from "./ApiController";
export default class ProjectController extends ApiController {
    static subscribe(callback) {
        SocketClient.instance.on("project/scan/complete", callback);
    }
    static subscribeBranches(callback) {
        SocketClient.instance.on("branches/scan/complete", callback);
    }
    static async open(project, issue) {
        return await ApiController.generic("http://localhost:2343/api/project/open", "POST", undefined, {
            project,
            issue,
        });
    }
    static async openFile(project, file) {
        return await ApiController.generic("http://localhost:2343/api/project/open/file", "POST", undefined, {
            project,
            file,
        });
    }
    static async scrape(path) {
        return await ApiController.generic("http://localhost:2343/api/project/scrape/projects/" + path, "GET");
    }
    static async scrapeBranches(paths) {
        return await ApiController.generic("http://localhost:2343/api/project/scrape/branches", "POST", undefined, paths);
    }
}
//# sourceMappingURL=ProjectController.js.map