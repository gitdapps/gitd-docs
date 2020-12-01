import Vue from "vue";
import VueRouter from "vue-router";
import Page from "../views/Page.vue";

Vue.use(VueRouter);

const routes = [
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
    name: "Page",
    component: Page,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
