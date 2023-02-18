import { ChangeStep, Project } from "../types/Jira";
import { JiraIssue as Task } from "../types/JiraIssue";
import { ChangeState } from "../types/ChangeState";
import SimpleGit from "../service/SimpleGit";
import shell from "shelljs";

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
    //SocketIO.instance.emit("branches/scan/complete", projectBranches);
    return projectBranches;
  }

  static async open(project: Project, issue: Task["key"], event: any) {
    console.log({ project });
    const changeStep = ({ step, state }: Partial<ChangeStep>) => {
      event.sender.send("result/change/step", [
        {
          step,
          path: project.path,
          state,
        } as ChangeStep,
      ]);
    };
    try {
      //start shell
      changeStep({ step: 0, state: ChangeState.Finished });
      //shell finished

      //go to project
      changeStep({ step: 1, state: ChangeState.Started });

      const git = SimpleGit(project.path);

      changeStep({ step: 1, state: ChangeState.Finished });
      //in project

      const masterBranch = await GitShell.getMasterBranch(project.path);
      console.log({ masterBranch });
      const master =
        masterBranch === "none" ? "master" : masterBranch.split("/").pop();
      console.log("change project: ", { master }, { issue }, { project });

      //update master and stash
      changeStep({ step: 2, state: ChangeState.Started });
      try {
        await git.stash();
        await git.checkout(master);
        await git.fetch();
        await git.pull();
      } catch (e) {
        console.error("fetch:", e);
        changeStep({ step: 2, state: ChangeState.Failed });
        return false;
      }
      changeStep({ step: 2, state: ChangeState.Finished });
      //finish update

      //goto branch
      changeStep({ step: 3, state: ChangeState.Started });
      try {
        await git.checkout(issue).catch(async () => {
          await git.checkoutLocalBranch(issue);
        });
      } catch (e) {
        console.error("checkout:", e);
        changeStep({ step: 3, state: ChangeState.Failed });
        return false;
      }
      changeStep({ step: 3, state: ChangeState.Finished });
      //went to branch

      this.scrapeBranches([project.path]).then((project) => {
        event.sender.send("result/scrape/branches", project[0]);
      });

      this.openWithIDE(project);
      return true;
    } catch (e) {
      console.error("error: ", e);
      return false;
    }
  }

  static openFile(project: Project, file: string) {
    try {
      this.openWithIDE(project, `${project.path}/${file}`);
      return true;
    } catch (e) {
      console.error("error: ", e);
      return false;
    }
  }

  static openWithIDE(project: Project, path?: string) {
    if (!project.ide) {
      return;
    }
    const shell = require("shelljs");
    const command = `"${project.ide.path}" ${path || project.path} &`;
    console.log({ command });
    shell.exec(command, {
      windowsHide: true,
      silent: true,
      async: true,
    });
  }
};

export {};
