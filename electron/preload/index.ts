// @ts-ignore
const electron = require("electron");
// @ts-ignore
window.ipcRenderer = electron.ipcRenderer;
// @ts-ignore
window.electron = electron;

// @ts-ignore
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector: string, text: string) => {
    // @ts-ignore
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    // @ts-ignore
    replaceText(`${type}-version`, process.versions[type]);
  }
});
