import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
var path = require("path");
var mode = process.env.NODE_ENV;
console.log("NODE_ENV:", mode);
export default defineConfig({
    mode: mode,
    plugins: [vue()],
    resolve: { dedupe: ["vue"] },
    base: mode === "production" ? "/".concat(path.resolve(__dirname, "./dist/"), "/") : ""
});
