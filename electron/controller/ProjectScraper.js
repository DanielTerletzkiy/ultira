"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Project_1 = __importDefault(require("../../src/model/Project"));
const Worker = require("worker_threads").Worker;
const path = require("path");
const SocketIO = require("../service/SocketIO");
const GitShell = require("./GitShell");
module.exports = class ProjectScraper {
    static projects;
    static async scrape(startDirectory = "PhpstormProjects") {
        const worker = new Worker(path.join(__dirname, "..", "worker/ProjectScrapperWorker.js"), {
            workerData: startDirectory,
        });
        let projects = (await new Promise((resolve, reject) => {
            worker.once("message", (message) => {
                const projects = message.map((object) => new Project_1.default(object));
                resolve(projects);
            });
        }));
        projects = await Promise.all(projects.map(async (project) => {
            project.branch = await GitShell.getCurrentBranch(project.path);
            return project;
        }));
        //SocketIO.instance.emit("project/scan/complete", projects);
        ProjectScraper.projects = projects;
        return projects;
    }
    static async scrapeBranches(paths) {
        const projectBranches = [];
        for (const path of paths) {
            const branch = await GitShell.getCurrentBranch(path);
            const changes = await GitShell.getCurrentChanges(path);
            projectBranches.push({
                path,
                branch,
                changes,
            });
        }
        //SocketIO.instance.emit("branches/scan/complete", projectBranches);
        return projectBranches;
    }
    static open(project, issue) {
        try {
            const shell = require("shelljs");
            shell.config.execPath = shell.which("node").stdout;
            shell.cd(project.path);
            shell.exec(`git stash`, { windowsHide: true }); //sash current uncommitted files
            if (shell.exec(`git checkout ${issue}`, { windowsHide: true }).code !== 0) {
                shell.exec(`git checkout -b ${issue}`, { windowsHide: true });
            } //try to check out branch, create if necessary
            Promise.all([
                new Promise(resolve => GitShell.getCurrentBranch(project.path).then(resolve)),
                new Promise(resolve => GitShell.getCurrentChanges(project.path).then(resolve)),
            ])
                .then(data => {
                /*SocketIO.instance.emit("branches/scan/complete", [ TODO
                  {
                    path: project.path,
                    branch: data[0],
                    changes: data[1],
                  },
                ])*/
            });
            shell.exec("phpstorm64 .", { windowsHide: true }); //open as project in current directory
            return true;
        }
        catch (e) {
            console.error("error: ", e);
            return false;
        }
    }
    static openFile(project, file) {
        try {
            const shell = require("shelljs");
            shell.config.execPath = shell.which("node").stdout;
            shell.cd(project.path);
            shell.exec("phpstorm64 " + file, { windowsHide: true }); //open as project in current directory
            return true;
        }
        catch (e) {
            console.error("error: ", e);
            return false;
        }
    }
};
