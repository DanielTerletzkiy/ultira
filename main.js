"use strict";
// @ts-ignore
const { app, BrowserWindow } = require("electron");
const path = require("path");
require("./JiraProxy");
function createWindow() {
    const win = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
        },
        frame: false,
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#242832',
            symbolColor: '#8e6bf3',
        }
    });
    win.loadFile("dist/index.html");
}
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
});
//# sourceMappingURL=main.js.map