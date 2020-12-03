<template>
  <div class="blob">
    <sidebar></sidebar>
    <div class="page" v-html="compiledMarkdown"></div>
  </div>
</template>

<style scoped>
.page {
  box-shadow: 0px 0px 3px 0px #aaa;
  height: 100%;
  width: 900px;
  margin: auto;
  padding: 30px;
  background: white;
  overflow: hidden;
}
</style>

<script>
import marked from "marked";
import DOMPurify from "dompurify";

import Sidebar from "@/components/Sidebar.vue";

export default {
  name: "Blob",
  components: {
    Sidebar,
  },
  data: () => ({
    compiledMarkdown: "",
  }),
  async mounted() {
    let owner = this.$route.params.owner,
      repo = this.$route.params.repo,
      ref = this.$route.params.ref,
      path = this.$route.params.path,
      { content } = await this.$store.dispatch("content/fetchContent", {
        owner,
        repo,
        ref,
        path,
      });

    this.compiledMarkdown = DOMPurify.sanitize(marked(atob(content)));
  },
};
</script>
