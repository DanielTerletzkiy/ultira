"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const ProjectScraper = require("../controller/ProjectScraper");
router.post("/open", (req, res) => {
    res.send(ProjectScraper.open(req.body.project, req.body.issue));
});
router.post("/open/file", (req, res) => {
    res.send(ProjectScraper.openFile(req.body.project, req.body.file));
});
router.get("/scrape/projects/:path", (req, res) => {
    ProjectScraper.scrape(req.params.path);
    res.send(true);
});
router.post("/scrape/branches/", async (req, res) => {
    res.send(await ProjectScraper.scrapeBranches(req.body));
});
module.exports = router;
