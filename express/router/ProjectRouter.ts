import Project from "../../src/model/Project";

const express = require("express");
const router = express.Router();
const ProjectScraper = require("../controller/ProjectScraper");

router.post("/open", (req: any, res: any) => {
  res.send(ProjectScraper.open(req.body.project as Project, req.body.issue));
});

router.post("/open/file", (req: any, res: any) => {
  res.send(ProjectScraper.openFile(req.body.project as Project, req.body.file));
});

router.get("/scrape/projects/:path", (req: any, res: any) => {
  ProjectScraper.scrape(req.params.path);
  res.send(true);
});

router.post("/scrape/branches/", async (req: any, res: any) => {
  res.send(await ProjectScraper.scrapeBranches(req.body));
});

module.exports = router;
