import ProjectRouter from "./ProjectRouter";

const express = require("express");
const router = express.Router();
router.use(express.json());

router.use("/project", ProjectRouter);

export default router;
