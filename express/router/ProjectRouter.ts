import {Project} from "../../types/Jira";

const express = require('express')
const router = express.Router()
const ProjectScraper = require("../controller/ProjectScraper")

router.post('/open', (req: any, res: any) => {
    res.send(ProjectScraper.open(req.body.project as Project, req.body.issue))
})

router.get('/scrape/projects/:path', (req: any, res: any) => {
    ProjectScraper.scrape(req.params.path)
    res.send(true)
})

router.post('/scrape/branches/', (req: any, res: any) => {
    ProjectScraper.scrapeBranches(req.body)
    res.send(true)
})

export default router
