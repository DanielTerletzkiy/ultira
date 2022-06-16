"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const ProjectScraper = require("../controller/ProjectScraper");
router.post('/open', (req, res) => {
    console.log(req.body);
    ProjectScraper.open(req.body.project, req.body.issue);
});
exports.default = router;
