"use strict";
const { createProxyMiddleware, fixRequestBody } = require("http-proxy-middleware");
const ProjectScraper = require('./controller/ProjectScraper');
const SocketIO = require('./service/SocketIO');
const http = require('http');
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    //delete api hindering headers
    delete req.headers['user-agent'];
    next();
});
let targetInstance;
app.post("/url", function (req, res) {
    targetInstance = req.headers['jira-host'];
    console.log('targetInstance: ', targetInstance);
    try {
        app.use('/', createProxyMiddleware({
            target: targetInstance,
            changeOrigin: true,
            protocolRewrite: "https",
            secure: false,
            onProxyReq: fixRequestBody,
        }));
    }
    catch (e) {
        res.status(400).json({ url: targetInstance });
    }
    res.status(200).json({ url: targetInstance });
});
(async () => {
    console.log('started app');
    console.log(await ProjectScraper.scrape('Documents'));
})();
const httpServer = http.createServer(app);
httpServer.listen(2343);
SocketIO.createInstance(httpServer);
module.exports = httpServer;
console.log('app ready');
//# sourceMappingURL=Server.js.map