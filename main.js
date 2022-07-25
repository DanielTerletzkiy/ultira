"use strict";
// @ts-ignore
const { app, BrowserWindow } = require("electron");
const path = require("path");
const expressServer = require("./electron/Server");
require("./electron/router/ProjectRouter");
let win;
function createWindow() {
    win = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
        frame: false,
        titleBarStyle: "customButtonsOnHover",
        titleBarOverlay: {
            color: "#242832",
            symbolColor: "#A8B2FF"
        },
        icon: path.join(__dirname, "public/favicon.ico")
    });
    require('@electron/remote/main').initialize();
    require('@electron/remote/main').enable(win.webContents);
    win.maximize();
    if (process.env["NODE_ENV"] === "development") {
        win.loadURL("http://localhost:3000");
    }
    else {
        win.loadFile("dist/index.html");
    }
    win.webContents.on("new-window", function (e, url) {
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
    }
    catch (e) {
    }
});
//# sourceMappingURL=main.js.map