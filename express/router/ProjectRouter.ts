import {Project} from "../../types/Jira";

const express = require('express')
const router = express.Router()
const ProjectScraper = require("../controller/ProjectScraper")

router.post('/open', (req: any, res: any) => {
    console.log(req.body)
    ProjectScraper.open(req.body.project as Project, req.body.issue)
})

export default router
