const {
  createProxyMiddleware,
  fixRequestBody
} = require("http-proxy-middleware");
const SocketIO = require("./service/SocketIO");
const http = require("http");

const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

app.use(express.json());

let targetInstance: string;

app.post("/url", function(req: any, res: any) {
  targetInstance = req.headers["jira-host"] as string;
  console.log("targetInstance: ", targetInstance);

  app._router.stack.map((layer: any, i: number) => layer.regexp.fast_slash && layer.name === "<anonymous>" ? i : "").filter(String).forEach((i: number) => {
    app._router.stack.splice(i, 1);
  });

  try {
    app.use((req: any, res: any, next: any) => {
      //delete api hindering headers
      delete req.headers["user-agent"];
      next();
    });

    app.use(
      "/",
      createProxyMiddleware({
        target: targetInstance,
        changeOrigin: true,
        protocolRewrite: "https",
        secure: false,
        onProxyReq: fixRequestBody
      })
    );
  } catch (e) {
    res.status(400).send({ url: targetInstance });
  }

  res.status(200).send({ url: targetInstance });
});


let httpServer;
try {
  httpServer = http.createServer(app);
  httpServer.listen(2343);

  SocketIO.createInstance(httpServer);

  console.log("app ready");
} catch (e) {
}
export default httpServer;
