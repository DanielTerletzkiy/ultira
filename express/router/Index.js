"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProjectRouter_1 = __importDefault(require("./ProjectRouter"));
const express = require('express');
const router = express.Router();
router.use(express.json());
router.use('/project', ProjectRouter_1.default);
exports.default = router;
