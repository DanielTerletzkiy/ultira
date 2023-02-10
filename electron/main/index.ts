// @ts-ignore
const { app, BrowserWindow } = require("electron");
const path = require("path");
import { join } from "node:path";

const expressServer = require("../../electron/Server");
require("../../electron/router/ProjectRouter");


process.env.DIST_ELECTRON = join(__dirname, "..");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

let win;
const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

function createWindow() {
  win = new BrowserWindow({
    frame: false,
    // @ts-ignore
    icon: join(process.env.PUBLIC, "favicon.ico"),
    titleBarOverlay: {
      color: "#242832",
      symbolColor: "#A8B2FF"
    },
    titleBarStyle: "customButtonsOnHover",
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  require("@electron/remote/main").initialize();
  require("@electron/remote/main").enable(win.webContents);


  win.maximize();
  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  win.webContents.on("new-window", function(e: any, url: string) {
    e.preventDefault();
    require("electron").shell.openExternal(url);
  });
}

app.setUserTasks([]);

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
  try {
    expressServer.close();
  } catch (e) {
  }
});
