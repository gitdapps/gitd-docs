import Vue from "vue";
import VueRouter from "vue-router";
import Doc from "../views/Doc.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/:owner/:repo/:ref?/:path*",
    name: "Doc",
    component: Doc,
    props(route) {
      let {
        params: { owner, repo, ref, path },
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
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
