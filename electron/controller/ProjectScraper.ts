import { Project } from "../../types/Jira";
import shell from "shelljs";
import { JiraIssue as Task } from "../../types/JiraIssue";

const Worker = require("worker_threads").Worker;
const path = require("path");
const SocketIO = require("../service/SocketIO");
const GitShell = require("./GitShell");

module.exports = class ProjectScraper {
  static projects: Array<Project>;

  static async scrape(startDirectory: string = "PhpstormProjects") {
    const worker = new Worker(
      path.join(__dirname, "..", "worker/ProjectScrapperWorker.js"),
      {
        workerData: startDirectory
      }
    );
    let projects = (await new Promise((resolve, reject) => {
      worker.once("message", (message: Array<Project>) => {
        const projects = message.map((object) => object);
        resolve(projects);
      });
    })) as Array<Project>;
    projects = await Promise.all(
      projects.map(async (project) => {
        project.branch = await GitShell.getCurrentBranch(project.path);
        return project;
      })
    );
    //SocketIO.instance.emit("project/scan/complete", projects);
    ProjectScraper.projects = projects;
    return projects;
  }

  static async scrapeBranches(paths: Array<Project["path"]>) {
    const projectBranches: Array<{
      path: Project["path"];
      branch: Project["branch"];
      changes: Project["changes"];
    }> = [];
    for (const path of paths) {
      const branch = await GitShell.getCurrentBranch(path);
      const changes = await GitShell.getCurrentChanges(path);
      projectBranches.push({
        path,
        branch,
        changes
      });
    }
    //SocketIO.instance.emit("branches/scan/complete", projectBranches);
    return projectBranches;
  }

  static open(path: Project["path"], issue: Task["key"], event?: any) {
    try {
      const shell = require("shelljs");
      shell.config.execPath = shell.which("node").stdout;
      shell.cd(path);

      const masterBranch = GitShell.getMasterBranch(path);
      shell.exec(`git fetch && git pull origin ${masterBranch}`, { windowsHide: true }); //update master
      shell.exec(`git stash`, { windowsHide: true }); //sash current uncommitted files
      if (
        shell.exec(`git checkout ${issue}`, { windowsHide: true }).code !== 0
      ) {
        shell.exec(`git checkout -b ${issue}`, { windowsHide: true });
      } //try to check out branch, create if necessary
      shell.exec(`git merge ${masterBranch}`, { windowsHide: true }); //merge master
      if (event) {
        Promise.all([
          new Promise(resolve => GitShell.getCurrentBranch(path).then(resolve)),
          new Promise(resolve => GitShell.getCurrentChanges(path).then(resolve))
        ])
          .then(data => {
            event.sender.send("result/scrape/branches", [{
              path: path,
              branch: data[0],
              changes: data[1]
            }]);
          });
      }
      // shell.exec("phpstorm64 .", { windowsHide: true }); //open as project in current directory
      return true;
    } catch (e) {
      console.error("error: ", e);
      return false;
    }
  }

  static openFile(path: string, file: string) {
    try {
      const shell = require("shelljs");
      shell.config.execPath = shell.which("node").stdout;
      shell.cd(path);
      shell.exec("phpstorm64 " + file, { windowsHide: true }); //open as project in current directory
      return true;
    } catch (e) {
      console.error("error: ", e);
      return false;
    }
  }
};

export {};
