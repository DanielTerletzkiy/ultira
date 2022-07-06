"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Worker = require('worker_threads').Worker;
const path = require("path");
const SocketIO = require("../service/SocketIO");
module.exports = class ProjectScraper {
    static projects;
    static async scrape(startDirectory = 'PhpstormProjects') {
        console.log('starting worker on: ', __filename);
        const worker = new Worker(path.join(__dirname, "..", "worker/ProjectScrapperWorker.js"), {
            workerData: startDirectory
        });
        const projects = await new Promise((resolve, reject) => {
            worker.once('message', (message) => {
                resolve(message);
            });
        });
        projects.map(async (project) => {
            project.branch = await ProjectScraper.getBranch(project.path);
        });
        SocketIO.instance.emit('project/scan/complete', projects);
        ProjectScraper.projects = projects;
        return projects;
    }
    static async getBranch(path) {
        let branch = "NONE";
        try {
            const shell = require("shelljs");
            shell.config.execPath = shell.which('node').stdout;
            shell.cd(path);
            const child = shell.exec('git branch --show-current', { async: true, windowsHide: true });
            branch = await new Promise((resolve, reject) => {
                child.stdout.once('data', function (data) {
                    resolve(data.replace(/(\r\n|\n|\r)/gm, ""));
                });
                child.once('error', function (data) {
                    reject();
                });
            });
        }
        catch (e) {
            console.error(e);
        }
        return branch;
    }
    static async scrapeBranches(paths) {
        const projectBranches = [];
        for (const path of paths) {
            const branch = await ProjectScraper.getBranch(path);
            projectBranches.push({
                path: path,
                branch: branch
            });
        }
        SocketIO.instance.emit('branches/scan/complete', projectBranches);
        return projectBranches;
    }
    static open(project, issue) {
        try {
            const shell = require("shelljs");
            shell.config.execPath = shell.which('node').stdout;
            shell.cd(project.path);
            shell.exec(`git stash`, { windowsHide: true }); //sash current uncommitted files
            if (shell.exec(`git checkout ${issue}`, { windowsHide: true }).code !== 0) {
                shell.exec(`git checkout -b ${issue}`, { windowsHide: true });
            } //try to check out branch, create if necessary
            ProjectScraper.getBranch(project.path).then(branch => SocketIO.instance.emit('branches/scan/complete', [{
                    path: project.path,
                    branch,
                }]));
            shell.exec('phpstorm64 .', { windowsHide: true }); //open as project in current directory
            return true;
        }
        catch (e) {
            console.error('error: ', e);
            return false;
        }
    }
};
