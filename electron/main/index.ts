// @ts-ignore
import { UpdateDownloadedEvent, UpdateInfo } from "electron-updater";

const { app, BrowserWindow } = require("electron");
import { join } from "node:path";
import { ProgressInfo } from "electron-builder";

const log = require("electron-log");
const { autoUpdater } = require("electron-updater");

const expressServer = require("../../electron/Server.js");
require("../../electron/router/ProjectRouter.js");

process.env.DIST_ELECTRON = join(__dirname, "..");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.SPLASH = join(process.env.DIST_ELECTRON, "../splash");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

// @ts-ignore
let win: BrowserWindow;
const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL as string;
console.log("url", url);
const indexHtml = join(process.env.DIST, "index.html");

function createWindow() {
  win = new BrowserWindow({
    show: false,
    frame: false,
    // @ts-ignore
    icon: join(process.env.PUBLIC, "favicon.ico"),
    titleBarOverlay: {
      color: "#242832",
      symbolColor: "#A8B2FF",
    },
    titleBarStyle: "customButtonsOnHover",
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
      // @ts-ignore
      enableRemoteModule: true,
    },
  });

  require("@electron/remote/main").initialize();
  require("@electron/remote/main").enable(win.webContents);

  const splash = new BrowserWindow({
    width: 450,
    height: 450,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
  });
  splash.loadFile(`${process.env.SPLASH}/index.html`);

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(url);
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  win.webContents.on("did-finish-load", () => {
    splash.destroy();
    win.show();
    win.maximize();
  });

  win.webContents.on("new-window", function (e: any, url: string) {
    e.preventDefault();
    require("electron").shell.openExternal(url);
  });
}

function sendStatusToWindow(text: string) {
  log.info(text);
  // @ts-ignore
  if (win) {
    win.webContents.send("message", text);
  }
}

app.setUserTasks([]);

app.whenReady().then(() => {
  autoUpdater.checkForUpdatesAndNotify();
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
    console.error(e);
  }
});

autoUpdater.on("checking-for-update", () => {
  sendStatusToWindow("Checking for update...");
});
autoUpdater.on("update-available", (info: UpdateInfo) => {
  sendStatusToWindow("Update available.");
});
autoUpdater.on("update-not-available", (info: UpdateInfo) => {
  sendStatusToWindow("Update not available.");
});
autoUpdater.on("error", (err: Error) => {
  sendStatusToWindow("Error in auto-updater. " + err);
});
autoUpdater.on("download-progress", (progressObj: ProgressInfo) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + " - Downloaded " + progressObj.percent + "%";
  log_message =
    log_message +
    " (" +
    progressObj.transferred +
    "/" +
    progressObj.total +
    ")";
  sendStatusToWindow(log_message);
});
autoUpdater.on("update-downloaded", (info: UpdateDownloadedEvent) => {
  sendStatusToWindow("Update downloaded");
});
