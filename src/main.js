import { createApp } from "vue";
import { createPinia } from "pinia";

import router from "@/router";
import GitdApp from "@/components/gitd-app.vue";

const app = createApp(GitdApp);

app.use(router);
app.use(createPinia());

app.mount("#gitd-app");
