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
    path: "/settings",
    name: "Settings",
    // route level code-splitting
    // this generates a separate chunk (settings.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "settings" */ "../views/Settings.vue"),
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
