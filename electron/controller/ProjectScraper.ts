import { Project } from "../types/Jira";
import { chunk } from "lodash";

const Worker = require("worker_threads").Worker;
const path = require("path");
const GitShell = require("./GitShell");

module.exports = class ProjectScraper {

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
    return projects;
  }

  static async scrapeBranches(
    paths: Array<Project["path"]>
  ): Promise<Array<Partial<Project>>> {

    const pathChunks = chunk(paths, 10);

    const branches = [];
    for (const pathChunk of pathChunks) {
      const chunkPromise = [];
      for (const path of pathChunk) {
        chunkPromise.push(Promise.all([path, GitShell.getCurrentBranch(path), GitShell.getMasterBranch(path), GitShell.getCurrentChanges(path).catch(console.error)]));
      }
      branches.push(...await Promise.all(chunkPromise));
    }
    return branches.map(([path, branch, defaultBranch, changes]) => {
      return {
        path,
        branch,
        changes,
        defaultBranch
      };
    });
  }
};

export {};
