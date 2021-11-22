import Vue from "vue";
import Gitd from "./components/gitd.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

const boot = () => {
  new Vue({
    router,
    store,
    render: (h) => h(Gitd),
  }).$mount("#gitd-app");
};

boot();
