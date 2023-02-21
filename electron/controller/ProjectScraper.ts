import { Project } from "../types/Jira";

const Worker = require("worker_threads").Worker;
const path = require("path");
const GitShell = require("./GitShell");

module.exports = class ProjectScraper {
  static projects: Array<Project>;

  static async scrape(startDirectory: string = "PhpstormProjects") {
    const worker = new Worker(
      path.join(__dirname, "..", "worker/ProjectScrapperWorker.js"),
      {
        workerData: startDirectory,
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

  static async scrapeBranches(
    paths: Array<Project["path"]>
  ): Promise<Array<Partial<Project>>> {
    const projectBranches: Array<{
      path: Project["path"];
      branch: Project["branch"];
      changes: Project["changes"];
      defaultBranch: Project["defaultBranch"];
    }> = [];
    for (const path of paths) {
      const branch = await GitShell.getCurrentBranch(path);
      const defaultBranch = await GitShell.getMasterBranch(path);
      const changes = await GitShell.getCurrentChanges(path).catch();
      projectBranches.push({
        path,
        branch,
        defaultBranch: defaultBranch.split("/").pop(),
        changes: changes || null,
      });
    }

    return projectBranches;
  }
};

export {};
