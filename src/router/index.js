import Vue from "vue";
import VueRouter from "vue-router";
import DocView from "@/components/doc-view.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/:owner/:repo/:path*",
    name: "doc-view",
    component: DocView,
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
];

const router = new VueRouter({
  mode: "history",
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
