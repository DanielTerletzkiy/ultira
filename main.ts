const {app, BrowserWindow} = require("electron");
const path = require("path");
require("./Server");

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
        },
        icon: path.join(__dirname, 'public/favicon.ico')
    });

    win.maximize();

    win.loadFile("dist/index.html");

    win.webContents.on('new-window', function (e: Event, url: string) {
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
});
