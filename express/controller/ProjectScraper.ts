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
        projects.map((project) => {
            project.branch = ProjectScraper.getBranch(project.path)
        })
        SocketIO.instance.emit('project/scan/complete', projects);
        ProjectScraper.projects = projects;
        return projects;
    }

    static getBranch(path: Project['path']): string {
        let branch = "NONE";
        try {
            const shell = require("shelljs");
            shell.config.execPath = shell.which('node').stdout
            shell.cd(path);
            branch = shell.exec('git branch --show-current').replace(/(\r\n|\n|\r)/gm, "");
        } catch (e) {
            console.error(e)
        }
        return branch;
    }

    static scrapeBranches(paths: Array<Project['path']>) {
        const projectBranches: Array<{ path: Project['path'], branch: Project['branch'] }> = [];
        paths.forEach((path) => {
            projectBranches.push({
                path: path,
                branch: ProjectScraper.getBranch(path)
            })
        })
        SocketIO.instance.emit('branches/scan/complete', projectBranches);
        return projectBranches;
    }

    static open(project: Project, issue: Task['key']) {
        try {
            const shell = require("shelljs");
            shell.config.execPath = shell.which('node').stdout
            shell.cd(project.path);
            shell.exec(`git stash`) //sash current uncommitted files
            if (shell.exec(`git checkout ${issue}`).code !== 0) {
                shell.exec(`git checkout -b ${issue}`)
            } //try to check out branch, create if necessary
            shell.exec('phpstorm64 .') //open as project in current directory
            return true;
        } catch (e) {
            console.error('error: ', e)
            return false
        }
    }
}
