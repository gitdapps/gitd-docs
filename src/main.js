import { createApp } from "vue";
import { createPinia } from "pinia";
import VueShortkey from "vue3-shortkey";

import router from "@/router";
import GitdApp from "@/components/gitd-app.vue";

const gitdApp = createApp(GitdApp);

gitdApp.use(VueShortkey);
gitdApp.use(router);
gitdApp.use(createPinia());

gitdApp.mount("#gitd-app");
