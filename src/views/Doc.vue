<template>
  <div class="doc">
    <sidebar id="sidebar" v-bind:headings="pageHeadings"></sidebar>
    <page id="page" v-bind:content="pageContent"></page>
    <div id="btm-spacer"></div>
  </div>
</template>

<style scoped>
.doc {
  height: 100%;
  padding-bottom: 30px;
  margin-bottom: 300px;
}

#btm-spacer {
  height: 100%;
}
</style>

<script>
import marked from "marked";

import Sidebar from "@/components/Sidebar.vue";
import Page from "@/components/Page.vue";

export default {
  name: "Doc",
  props: {
    owner: String,
    repository: String,
    path: String,
    reference: String,
  },
  components: {
    Sidebar,
    Page,
  },
  computed: {
    pageContent() {
      let { owner, repository: repo, reference: ref, path } = this;

      try {
        if (!ref) {
          // fall back to repo default branch if ref not specified
          ref = `heads/${this.$store.state.repos[owner][repo].default_branch}`;
        }

        let content = this.$store.state.content[owner][repo][ref][path];

        if (Array.isArray(content)) {
          // we're dealing with a directory, try to use the index.md file
          content = this.$store.state.content[owner][repo][ref][
            content.find(({ path }) => path.endsWith("index.md")).path
          ];
        }

        return content;
      } catch (e) {
        return undefined;
      }
    },
    pageHeadings() {
      try {
        return marked
          .lexer(atob(this.pageContent.content))
          .filter((e) => e.type === "heading");
      } catch (e) {
        return undefined;
      }
    },
  },
};
</script>
