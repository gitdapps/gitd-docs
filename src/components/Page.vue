<template>
  <div class="page" v-html="pageHtml"></div>
</template>

<style scoped>
.page {
  border-radius: 2px;
  box-shadow: 0px 0px 3px 0px #aaa;
  width: 900px;
  margin: auto;
  padding: 30px;
  background: white;
  overflow: hidden;
  min-height: 100%;
  margin-bottom: 30px;
}
</style>

<script>
import marked from "marked";
import DOMPurify from "dompurify";

export default {
  name: "Page",
  props: {
    content: Object,
  },
  computed: {
    pageHtml() {
      if (this.content) {
        return DOMPurify.sanitize(marked(atob(this.content.content)));
      }

      return "";
    },
  },
};
</script>
