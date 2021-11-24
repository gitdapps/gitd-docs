<template>
  <main>
    <doc-menu />
    <doc-article v-bind:doc="doc"></doc-article>
  </main>
</template>

<style scoped>
main {
  height: 100vh;
  overflow: scroll;
}
</style>

<script>
import _ from "lodash";

import router from "@/router";
import DocMenu from "@/components/doc-menu.vue";
import DocArticle from "@/components/doc-article.vue";

document.addEventListener("click", (e) => {
  if (_.includes(document.querySelectorAll(".page a"), e.target)) {
    let href = e.target.getAttribute("href");

    if (!href.includes("//")) {
      router.push(e.target.getAttribute("href"));
    } else {
      window.open(href, "_blank");
    }

    e.preventDefault();
  }
});

export default {
  name: "doc-view",
  props: {
    owner: String,
    repository: String,
    path: String,
    reference: String,
  },
  components: {
    DocMenu,
    DocArticle,
  },
  computed: {
    doc() {
      let { owner, repository: repo, reference: ref, path } = this;

      try {
        if (!ref) {
          // fall back to repo default branch if ref not specified
          ref = `heads/${this.$store.state.repos[owner][repo].default_branch}`;
        }

        return this.$store.state.docs[owner][repo][ref][path];
      } catch (e) {
        return null;
      }
    },
    files() {
      let { owner, repository: repo, reference: ref, path } = this;

      try {
        if (!ref) {
          // fall back to repo default branch if ref not specified
          ref = `heads/${this.$store.state.repos[owner][repo].default_branch}`;
        }

        let content = this.$store.state.content[owner][repo][ref][path];

        if (!Array.isArray(content)) {
          return [];
        }

        return content.filter(
          ({ type, name }) => type === "file" && name !== "index.md"
        );
      } catch (e) {
        return undefined;
      }
    },
  },
};
</script>
