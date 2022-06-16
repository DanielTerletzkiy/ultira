import {JiraIssue, Project} from "../../types/Jira";
import Task = JiraIssue.Task;

const Worker = require('worker_threads').Worker;
const path = require("path");
const SocketIO = require("../service/SocketIO");

module.exports = class ProjectScraper {
    static projects: Array<Project>;

    static async scrape(startDirectory: string = 'PhpstormProjects') {
        console.log('starting worker on: ', __filename)
        const worker = new Worker(path.join(__dirname, "..", "worker/ProjectScrapperWorker.js"), {
            workerData: startDirectory
        });
        const projects = await new Promise((resolve, reject) => {
            worker.once('message', (message: Array<Project>) => {
                resolve(message)
            })
        }) as Array<Project>;
        SocketIO.instance.emit('project/scan/complete', projects);
        ProjectScraper.projects = projects;
        return projects;
    }

    static open(project: Project, issue: Task['key']) {
        const shell = require("shelljs");
        shell.cd(project.path);
        shell.exec(`git stash`)
        shell.exec(`git checkout ${issue}`)
        shell.exec('phpstorm64 .')

    }
}
