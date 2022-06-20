"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const ProjectScraper = require("../controller/ProjectScraper");
router.post('/open', (req, res) => {
    res.send(ProjectScraper.open(req.body.project, req.body.issue));
});
router.get('/scrape/:path', (req, res) => {
    ProjectScraper.scrape(req.params.path);
    res.send(true);
});
exports.default = router;
