<template>
  <main>
    <doc-menu />
    <doc-article v-bind:doc="doc" />
  </main>
</template>

<style scoped>
main {
  height: 100vh;
  overflow: scroll;
}
</style>

<script setup>
import _ from "lodash";
import { computed } from "vue";
import { useRouter } from "vue-router";

import DocMenu from "@/components/doc-menu.vue";
import DocArticle from "@/components/doc-article.vue";
import { useGithubStore } from "@/stores/github";

const props = defineProps({
    owner: String,
    repository: String,
    path: String,
    reference: String,
  }),
  router = useRouter(),
  githubStore = useGithubStore(),
  doc = computed(() => {
    let { owner, repository: repo, reference: ref, path } = props;
    try {
      if (!ref) {
        // fall back to repo default branch if ref not specified
        ref = `heads/${githubStore.repos[owner][repo].default_branch}`;
      }
      return githubStore.docs[owner][repo][ref][path];
    } catch (e) {
      return null;
    }
  });

// files = computed(() => {
//   let { owner, repository: repo, reference: ref, path } = this;

//   try {
//     if (!ref) {
//       // fall back to repo default branch if ref not specified
//       ref = `heads/${this.$store.state.repos[owner][repo].default_branch}`;
//     }

//     let content = this.$store.state.content[owner][repo][ref][path];

//     if (!Array.isArray(content)) {
//       return [];
//     }

//     return content.filter(
//       ({ type, name }) => type === "file" && name !== "index.md"
//     );
//   } catch (e) {
//     return undefined;
//   }
// });

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
</script>
