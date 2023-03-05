import { ChangeStep, Project } from "../types/Jira";
import { ChangeState } from "../types/ChangeState";
import { SimpleGit as GitType } from "simple-git";
import SimpleGit from "../service/SimpleGit";

const GitShell = require("./GitShell");
const ProjectScraper = require("./ProjectScraper");

const projectActions = class ProjectActions {
  private project: Project;
  private event: any;
  private git!: GitType;

  public constructor(project: Project, event: any) {
    this.project = project;
    this.event = event;
    this.createGitInstance();
    this.changeStep(0, ChangeState.Finished);
  }

  private changeStep(step: ChangeStep["step"], state: ChangeStep["state"]) {
    this.event.sender.send("result/change/step", [
      {
        step,
        path: this.project.path,
        state
      } as ChangeStep
    ]);
  }

  public setLoading(loading: boolean | string, type: string) {
    //TODO add proper types
    this.event.sender.send("loading", {
        [type]: loading
      }
    );
    setTimeout(() => {
      this.resetLoading(type);
    }, 20000);
  }

  private resetLoading(type: string) {
    //TODO add proper types
    this.event.sender.send("loading", {
        [type]: ""
      }
    );
  }

  private createGitInstance() {
    this.changeStep(1, ChangeState.Started);
    this.git = SimpleGit(this.project.path);
    this.changeStep(1, ChangeState.Finished);
  }

  private scrapeProject() {
    ProjectScraper.scrapeBranches([this.project.path]).then(
      (projects: Project[]) => {
        const project = projects[0];
        // @ts-ignore
        delete project.changes?.isClean;
        this.event.sender.send("result/scrape/branches", [project]);
      }
    );
  }

  public async getMasterBranch() {
    const masterBranch = this.project.defaultBranch || await GitShell.getMasterBranch(this.project.path);
    return masterBranch === "none" ? "master" : masterBranch.split("/").pop();
  }

  public async pullMaster() {
    const master = await this.getMasterBranch();
    this.changeStep(2, ChangeState.Started);
    try {
      await this.git.stash();
      await this.git.checkout(master);
      await this.git.fetch();
      await this.git.pull();
    } catch (e) {
      console.error("fetch:", e);
      this.changeStep(2, ChangeState.Failed);
      throw e;
    }
    this.changeStep(2, ChangeState.Finished);
  }

  public async pull() {
    this.changeStep(2, ChangeState.Started);
    try {
      await this.git.fetch();
      await this.git.pull();
    } catch (e) {
      console.error("fetch:", e);
      this.changeStep(2, ChangeState.Failed);
      throw e;
    }
    this.changeStep(2, ChangeState.Finished);
  }

  public async push() {
    this.changeStep(2, ChangeState.Started);
    try {
      await this.git.fetch();
      await this.git.push();
    } catch (e) {
      console.error("fetch:", e);
      this.changeStep(2, ChangeState.Failed);
      throw e;
    }
    this.changeStep(2, ChangeState.Finished);
  }

  public async updateWithDefault() {
    const master = await this.getMasterBranch();
    this.changeStep(2, ChangeState.Started);
    try {
      await this.git.fetch();
      await this.git.pull("origin", master);
    } catch (e) {
      console.error("fetch:", e);
      this.changeStep(2, ChangeState.Failed);
      throw e;
    }
    this.changeStep(2, ChangeState.Finished);
  }

  public async changeBranch(branch: string) {
    this.changeStep(3, ChangeState.Started);
    try {
      await this.git.checkout(branch).catch(async () => {
        await this.git.checkoutLocalBranch(branch);
      });
    } catch (e) {
      console.error("checkout:", e);
      this.changeStep(3, ChangeState.Failed);
      throw e;
    }
    this.changeStep(3, ChangeState.Finished);
  }

  public openFile(file: string) {
    try {
      console.log(`${this.project.path}/${file}`);
      this.openWithIDE(`${this.project.path}/${file}`);
      return true;
    } catch (e) {
      console.error("error: ", e);
      throw e;
    }
  }

  public openWithIDE(path?: string) {
    if (!this.project.ide) {
      return;
    }
    const shell = require("shelljs");
    const command = `"${this.project.ide.path}" ${path || this.project.path} &`;
    shell.exec(command, {
      windowsHide: true,
      silent: true,
      async: true
    });
  }

  public async changeBranchSequence(branch: string) {
    this.setLoading(this.project.path, "project");
    try {
      await this.pullMaster();
      await this.changeBranch(branch);
      this.scrapeProject();
      this.openWithIDE();
    } catch (e) {
      console.error("error: ", e);
    }
    this.resetLoading("project");
  }

  public async changeDefault() {
    this.setLoading(this.project.path, "project");
    await this.pullMaster().catch();
    this.scrapeProject();
    this.resetLoading("project");
  }

  public async update() {
    this.setLoading(this.project.path, "project");
    await this.updateWithDefault().catch();
    this.scrapeProject();
    this.resetLoading("project");
  }

  public async updateCurrent() {
    this.setLoading(this.project.path, "project");
    await this.pull().catch();
    this.scrapeProject();
    this.resetLoading("project");
  }

  public async pushCurrent() {
    this.setLoading(this.project.path, "project");
    await this.push().catch();
    this.scrapeProject();
    this.resetLoading("project");
  }
};

module.exports = projectActions;
export default projectActions;
