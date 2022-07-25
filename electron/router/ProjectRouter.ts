import Project from "../../src/model/Project";
import { JiraIssue } from "../../types/Jira";
import Task = JiraIssue.Task;

const { ipcMain } = require("electron");

const ProjectScraper = require("../controller/ProjectScraper");

ipcMain.on(
  "open/project",
  (event: any, arg: { path: string; issue: Task["key"] }) => {
    event.sender.send(
      "result/open/project",
      ProjectScraper.open(arg.path, arg.issue, event)
    );
  }
);

ipcMain.on(
  "open/file",
  (event: any, arg: { path: string; file: string }) => {
    event.sender.send(
      "result/open/file",
      ProjectScraper.openFile(arg.path, arg.file)
    );
  }
);

ipcMain.on("scrape/directory", async (event: any, arg: { path: string }) => {
    const result = await ProjectScraper.scrape(arg.path);
    event.sender.send("result/scrape/directory", result);
});

ipcMain.on("scrape/branches", async (event: any, arg: { projectPaths: Array<Project['path']> }) => {
    const result = await ProjectScraper.scrapeBranches(arg.projectPaths);
    event.sender.send("result/scrape/branches", result);
});
