<template>
  <main>
    <doc-menu />
    <md-article v-bind:md-content="mdContent"></md-article>
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
import MdArticle from "@/components/md-article.vue";

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
    MdArticle,
  },
  computed: {
    mdContent() {
      let { owner, repository: repo, reference: ref, path } = this;

      try {
        if (!ref) {
          // fall back to repo default branch if ref not specified
          ref = `heads/${this.$store.state.repos[owner][repo].default_branch}`;
        }

        let mdContent = this.$store.state.content[owner][repo][ref][path];

        if (Array.isArray(mdContent)) {
          // we're dealing with a directory, try to use the index.md file
          mdContent = this.$store.state.content[owner][repo][ref][
            mdContent.find(({ path }) => path.endsWith("index.md")).path
          ];
        }

        return mdContent;
      } catch (e) {
        return undefined;
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
