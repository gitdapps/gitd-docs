import { createApp } from "vue";
import GitdApp from "@/components/gitd-app.vue";
import router from "@/router";

const app = createApp(GitdApp);

app.use(router);

app.mount("#gitd-app");
