import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

// const clientId = "6cec68d5949ad85f6574";
// const code = new URLSearchParams(location.search).get("code");
// const serverRoot =
//   "https://isaiahsimpson-gitdapps-gitd-docs-wpw6gqwr2vjqw-5000.githubpreview.dev";

const boot = () => {
  // history.replaceState &&
  //   history.replaceState(
  //     null,
  //     "",
  //     location.pathname +
  //       location.search.replace(/[?&]code=[^&]+/, "").replace(/^&/, "?")
  //   );

  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount("#app");
};

// if (!localStorage.getItem("githubAccessToken") && !code) {
//   window.location = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,read:user,read:discussion,write:discussion`;
// }

// if (code) {
//   fetch(`${serverRoot}/github-access-token?code=${code}`).then(boot);
// } else {
boot();
// }
