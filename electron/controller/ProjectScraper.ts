import { ChangeStep, Project } from "../types/Jira";
import { JiraIssue as Task } from "../types/JiraIssue";
import { ChangeState } from "../types/ChangeState";
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

  static async open(path: Project["path"], issue: Task["key"], event: any) {

    const windowsHide = true;
    const changeStep = ({ step, state }: Partial<ChangeStep>) => {
      event.sender.send("result/change/step", [{
        step, path, state
      } as ChangeStep]);
    };
    try {

      let shell;
      //start shell
      try {
        changeStep({ step: 0, state: ChangeState.Started });
        shell = require("shelljs");
        //shell.config.execPath = shell.which("node").stdout;
        //console.log("node path", shell.which("node").stdout);
      } catch (e) {
        console.error("start shell:", e);
        changeStep({ step: 0, state: ChangeState.Failed });
        return false;
      }
      changeStep({ step: 0, state: ChangeState.Finished });
      //shell finished

      //go to project
      try {
        changeStep({ step: 1, state: ChangeState.Started });
        shell.cd(path);
      } catch (e) {
        console.error("goto project:", e);
        changeStep({ step: 1, state: ChangeState.Failed });
        return false;
      }
      changeStep({ step: 1, state: ChangeState.Finished });
      //in project

      const masterBranch = (await GitShell.getMasterBranch(path)).replace("/", " ");
      console.log("change project: ", masterBranch, issue, path, !!event);

      //update master and stash
      changeStep({ step: 2, state: ChangeState.Started });
      try {
        shell.exec(`git fetch && git pull ${masterBranch}`, { windowsHide }); //update master
        shell.exec(`git stash`, { windowsHide }); //sash current uncommitted files
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
        const status = shell.exec(`git checkout ${issue}`, { windowsHide });
        console.log(`git checkout ${issue}`, "stdout:", status.stdout, "stderr:", status.stderr, "code:", status.code);
        console.log(shell.exec(`echo "$PWD"`, { windowsHide }));
        if (status.code !== 0) {
          const status = shell.exec(`git checkout -b ${issue}`, { windowsHide });
          console.log(`git checkout -b ${issue}`, "stdout:", status.stdout, "stderr:", status.stderr, "code:", status.code);
        } //try to check out branch, create if necessary
      } catch (e) {
        console.error("checkout:", e);
        changeStep({ step: 3, state: ChangeState.Failed });
        return false;
      }
      changeStep({ step: 3, state: ChangeState.Finished });
      //went to branch


      //merge master
      changeStep({ step: 4, state: ChangeState.Started });
      try {
        shell.exec(`git merge ${masterBranch}`, { windowsHide }); //merge master
      } catch (e) {
        console.error("merge:", e);
        changeStep({ step: 4, state: ChangeState.Failed });
        return false;
      }
      changeStep({ step: 4, state: ChangeState.Finished });
      //merged master

      Promise.all([
        new Promise(resolve => GitShell.getCurrentBranch(path).then(resolve)),
        new Promise(resolve => GitShell.getCurrentChanges(path).then(resolve))
      ])
        .then(data => {
          event.sender.send("result/scrape/branches", [{
            path: path,
            branch: data[0],
            changes: data[1]
          } as Project]);
        });
      // shell.exec("phpstorm64 .", { windowsHide }); //open as project in current directory
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
