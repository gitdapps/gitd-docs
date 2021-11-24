import Vue from "vue";
import VueShortkey from "vue-shortkey";
import GitdApp from "./components/gitd-app.vue";
import router from "./router";
import store from "./store/root.js";

Vue.config.productionTip = false;

const boot = () => {
  new Vue({
    router,
    store,
    render: (h) => h(GitdApp),
  }).$mount("#gitd-app");
};

Vue.use(VueShortkey);

boot();
