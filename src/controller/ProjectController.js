import SocketClient from "../service/SocketIOClient";
import ApiController from "./ApiController";
export default class ProjectController extends ApiController {
    static subscribe(callback) {
        SocketClient.instance.on('project/scan/complete', callback);
    }
    static async open(project, issue) {
        return await ApiController.generic('http://localhost:2343/api/project/open', 'POST', undefined, {
            project, issue
        });
    }
    static async scrape(path) {
        return await ApiController.generic('http://localhost:2343/api/project/scrape/' + path, 'GET');
    }
}
//# sourceMappingURL=ProjectController.js.map