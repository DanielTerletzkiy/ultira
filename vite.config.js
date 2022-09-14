import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
var path = require("path");
var mode = undefined; //process.env.NODE_ENV; todo
console.log("NODE_ENV:", mode);
export default defineConfig({
    mode: mode,
    server: {
        port: 3000
    },
    plugins: [vue()],
    resolve: { dedupe: ["vue"] },
    base: mode === "production" ? "/".concat(path.resolve(__dirname, "./dist/"), "/") : ""
});
