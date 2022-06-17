import SocketClient from "../service/SocketIOClient";
import {JiraIssue, Project} from "../../types/Jira";
import ApiController from "./ApiController";
import Task = JiraIssue.Task;

export default class ProjectController extends ApiController {
    static subscribe(callback: (data: Array<Project>) => void) {
        SocketClient.instance.on('project/scan/complete', callback)
    }

    static async open(project: Project, issue: Task['key']) {
        return await ApiController.generic('http://localhost:2343/api/project/open', 'POST', undefined, {
            project, issue
        })
    }
}
