const {createProxyMiddleware} = require("http-proxy-middleware");

const express = require('express');
const app = express();

const cors = require('cors')
app.use(cors())

app.use(express.json())

let targetInstance: string;

app.post("/url", function (req: any, res: any) {
    targetInstance = req.headers['jira-host'] as string;
    console.log('targetInstance: ', targetInstance)

    try {
        app.use('/rest', createProxyMiddleware({
            target: targetInstance,
            changeOrigin: true,
            protocolRewrite: "https",
            secure: false,
        }));
    } catch (e) {
        res.status(400).json({url: targetInstance});
    }

    res.status(200).json({url: targetInstance});
});

app.listen(2343);
module.exports = app;
