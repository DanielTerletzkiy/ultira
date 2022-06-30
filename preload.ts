// @ts-ignore
const electron = require('electron')
// @ts-ignore
window.ipcRenderer = electron.ipcRenderer
// @ts-ignore
window.electron = electron

window.addEventListener("DOMContentLoaded", () => {
    const replaceText = (selector: string, text: string) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
    };

    for (const type of ["chrome", "node", "electron"]) {
        // @ts-ignore
        replaceText(`${type}-version`, process.versions[type]);
    }
});
