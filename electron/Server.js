"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { createProxyMiddleware, fixRequestBody, } = require("http-proxy-middleware");
const ProjectScraper = require("./controller/ProjectScraper");
const SocketIO = require("./service/SocketIO");
const http = require("http");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    //delete api hindering headers
    delete req.headers["user-agent"];
    next();
});
//app.use("/api", Index);
let targetInstance;
app.post("/url", function (req, res) {
    targetInstance = req.headers["jira-host"];
    console.log("targetInstance: ", targetInstance);
    try {
        app.use("/", createProxyMiddleware({
            target: targetInstance,
            changeOrigin: true,
            protocolRewrite: "https",
            secure: false,
            onProxyReq: fixRequestBody,
        }));
    }
    catch (e) {
        res.status(400).send({ url: targetInstance });
    }
    res.status(200).send({ url: targetInstance });
});
const httpServer = http.createServer(app);
httpServer.listen(2343);
SocketIO.createInstance(httpServer);
exports.default = httpServer;
console.log("app ready");
