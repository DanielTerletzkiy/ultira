import { Project } from "../types/Jira";
import { JiraIssue as Task } from "../types/JiraIssue";
import ProjectActions from "../controller/ProjectActions";

const { ipcMain } = require("electron");

const ProjectScraper = require("../controller/ProjectScraper");

ipcMain.on(
  "project/change",
  async (event: any, arg: { project: string; issue: Task["key"] }) => {
    const project: Project = JSON.parse(arg.project);
    const controller = new ProjectActions(project, event);
    const res = await controller.changeBranchSequence(arg.issue).catch();

    event.sender.send("result/project/change", res);
  }
);

ipcMain.on(
  "project/change/default",
  async (event: any, arg: { project: string; }) => {
    const project: Project = JSON.parse(arg.project);
    const controller = new ProjectActions(project, event);
    const res = await controller.changeDefault().catch();

    event.sender.send("result/project/change", res);
  }
);

ipcMain.on(
  "project/update",
  async (event: any, arg: { project: string; }) => {
    const project: Project = JSON.parse(arg.project);
    const controller = new ProjectActions(project, event);
    await controller.update().catch();

    event.sender.send("result/project/update", true);
  }
);

ipcMain.on(
  "project/open",
  async (event: any, arg: { project: string; }) => {
    const project: Project = JSON.parse(arg.project);
    const controller = new ProjectActions(project, event);
    controller.openWithIDE();

    event.sender.send("result/project/open", true);
  }
);

ipcMain.on(
  "project/file",
  async (event: any, arg: { project: string; file: string }) => {
    const project: Project = JSON.parse(arg.project);
    const controller = new ProjectActions(project, event);
    const res = controller.openFile(arg.file);

    event.sender.send("result/project/file", res);
  }
);

ipcMain.on("scrape/directory", async (event: any, arg: { path: string }) => {
  const result = await ProjectScraper.scrape(arg.path);
  event.sender.send("result/scrape/directory", result);
});

ipcMain.on(
  "scrape/branches",
  async (event: any, arg: { projectPaths: Array<Project["path"]> }) => {
    event.sender.send("loading", {projects: true});
    let result = await ProjectScraper.scrapeBranches(arg.projectPaths);
    result = result.map((result: Partial<Project>) => {
      // @ts-ignore
      delete result.changes?.isClean;
      return result;
    });
    event.sender.send("result/scrape/branches", result);
    event.sender.send("loading", {projects: false});
  }
);
