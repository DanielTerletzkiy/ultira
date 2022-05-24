import { createApp } from 'vue';
import vuelize from "vuelize/src/index";
// @ts-ignore
import { vLongpress } from "@nanogiants/vue3-longpress";
import App from './App.vue';
createApp(App)
    .use(vuelize)
    .directive('use-longpress', vLongpress)
    .mount('#app');
//# sourceMappingURL=main.js.map