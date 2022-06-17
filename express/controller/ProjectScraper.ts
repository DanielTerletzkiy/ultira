import {JiraIssue, Project} from "../../types/Jira";
import Task = JiraIssue.Task;
import shell from "shelljs";

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
        shell.config.execPath = shell.which('node').stdout
        shell.cd(project.path);
        shell.exec(`git stash`) //sash current uncommitted files
        if (shell.exec(`git checkout ${issue}`).code !== 0) {
            shell.exec(`git checkout -b ${issue}`)
        } //try to check out branch, create if necessary
        shell.exec('phpstorm64 .') //open as project in current directory

    }
}
