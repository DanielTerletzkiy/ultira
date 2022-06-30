"use strict";
// @ts-ignore
const { app, BrowserWindow } = require("electron");
const path = require("path");
const expressServer = require("./express/Server");
function createWindow() {
    const win = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
            contextIsolation: false,
        },
        frame: false,
        titleBarStyle: 'customButtonsOnHover',
        titleBarOverlay: {
            color: '#242832',
            symbolColor: '#A8B2FF',
        },
        icon: path.join(__dirname, 'public/favicon.ico')
    });
    win.maximize();
    win.loadFile("dist/index.html");
    win.webContents.on('new-window', function (e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
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