import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const path = require("path");
const mode = undefined//process.env.NODE_ENV; todo

console.log("NODE_ENV:", mode);

export default defineConfig({
  mode: mode,
  plugins: [vue()],
  resolve: { dedupe: ["vue"] },
  base: mode === "production" ? `/${path.resolve(__dirname, "./dist/")}/` : "",
});
