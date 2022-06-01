// @ts-ignore
const {app, BrowserWindow} = require("electron");
const path = require("path");
require("./JiraProxy");

function createWindow() {
    const win = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
            contextIsolation: false,
        },
        frame: false,
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#242832',
            symbolColor: '#94cdff',
        }
    });

    win.loadFile("dist/index.html");

    win.webContents.on('new-window', function (e: Event, url: string) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    });
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
