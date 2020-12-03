import Vue from "vue";
import VueRouter from "vue-router";
import Blob from "../views/Blob.vue";
import Repo from "../views/Repo.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/:owner/:repo",
    name: "Repo",
    component: Repo,
  },
  {
    path: "/:owner/:repo/blob/:ref?",
    name: "RepoWithRef",
    component: Repo,
  },
  {
    path: "/:owner/:repo/blob/:ref/:path*",
    name: "Blob",
    component: Blob,
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
    path: "/",
    name: "Home",
    // route level code-splitting
    // this generates a separate chunk (home.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue"),
  },
  {
    path: "*",
    redirect: "/",
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
