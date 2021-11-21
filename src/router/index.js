import Vue from "vue";
import VueRouter from "vue-router";
import Doc from "../views/Doc.vue";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/:owner/:repo/:path*",
    name: "Doc",
    component: Doc,
    props(route) {
      let {
        params: { owner, repo, path },
        query: { ref },
      } = route;

      return {
        owner,
        repository: repo,
        path,
        reference: ref,
      };
    },
  },
  {
    path: "*",
    name: "Home",
    component: Home,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});

export default router;
