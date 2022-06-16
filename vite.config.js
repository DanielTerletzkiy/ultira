import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
var path = require("path");
var mode = process.env.APP_ENV;
console.log('APP_ENV:', mode);
// https://vitejs.dev/config/
export default defineConfig({
    mode: mode,
    plugins: [vue()],
    resolve: { dedupe: ['vue'] },
    base: mode === 'production' ? "/".concat(path.resolve(__dirname, "./dist/"), "/") : '',
    server: {
        proxy: {
            '/api': 'http://localhost:2343'
        }
    }
});
