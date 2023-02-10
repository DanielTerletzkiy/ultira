import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// @ts-ignore
import electron from "vite-plugin-electron";
// @ts-ignore
import renderer from "vite-plugin-electron-renderer";
import { rmSync } from "node:fs";
// @ts-ignore
import pkg from "./package.json";

const path = require("path");
const mode = undefined;//process.env.NODE_ENV; todo

console.log("NODE_ENV:", mode);

export default defineConfig(({ command }) => {

  rmSync("dist-electron", { recursive: true, force: true });

  const isServe = command === "serve";
  const isBuild = command === "build";
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG;

  return {
    mode: mode,
    server: {
      port: 3000
    },
    plugins: [
      vue(),
      electron([
        {
          // Main-Process entry file of the Electron App.
          entry: "electron/main/index.ts",
          onstart(options) {
            if (process.env.VSCODE_DEBUG) {
              console.log(/* For `.vscode/.debug.script.mjs` */"[startup] Electron App");
            } else {
              options.startup();
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: "dist-electron/main",
              rollupOptions: {
                external: Object.keys("dependencies" in pkg ? pkg.dependencies : {})
              }
            }
          }
        },
        {
          entry: "electron/preload/index.ts",
          onstart(options) {
            // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
            // instead of restarting the entire Electron App.
            options.reload();
          },
          vite: {
            build: {
              sourcemap: sourcemap ? "inline" : undefined, // #332
              minify: isBuild,
              outDir: "dist-electron/preload",
              rollupOptions: {
                external: Object.keys("dependencies" in pkg ? pkg.dependencies : {})
              }
            }
          }
        }
      ]),
      // Use Node.js API in the Renderer-process
      renderer({
        nodeIntegration: true
      })
    ],
    resolve: { dedupe: ["vue"] },
    base: mode === "production" ? `/${path.resolve(__dirname, "./dist/")}/` : ""
  };
});
