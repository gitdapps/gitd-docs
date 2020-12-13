<template>
  <div class="doc">
    <sidebar id="sidebar"></sidebar>
    <page id="page" v-bind:content="pageContent"></page>
  </div>
</template>

<style scoped>
.doc {
  height: 100%;
  padding-bottom: 30px;
}
</style>

<script>
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
        let content = this.$store.state.content[owner][repo][ref][path];

        if (!Array.isArray(content)) {
          return content;
        } else {
          return undefined;
        }
      } catch (e) {
        return undefined;
      }
    },
  },
};
</script>
