const {createProxyMiddleware, fixRequestBody} = require("http-proxy-middleware");
const ProjectScraper = require('./controller/ProjectScraper');

const express = require('express');
const app = express();

const cors = require('cors')
app.use(cors())

app.use(express.json())

app.use((req: any, res: any, next: any) => {
    //delete api hindering headers
    delete req.headers['user-agent']
    next()
})

let targetInstance: string;

app.post("/url", function (req: any, res: any) {
    targetInstance = req.headers['jira-host'] as string;
    console.log('targetInstance: ', targetInstance)

    try {
        app.use('/', createProxyMiddleware({
            target: targetInstance,
            changeOrigin: true,
            protocolRewrite: "https",
            secure: false,
            onProxyReq: fixRequestBody,
        }));
    } catch (e) {
        res.status(400).json({url: targetInstance});
    }

    res.status(200).json({url: targetInstance});
});

(async () => {
    console.log('started app')
    console.log(await ProjectScraper.scrape());
})()

app.listen(2343);
module.exports = app;

