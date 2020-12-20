<template>
  <div class="page" v-html="pageHtml"></div>
</template>

<style>
.page {
  border-radius: 2px;
  box-shadow: 0px 0px 3px 0px #aaa;
  width: 900px;
  margin: auto;
  padding: 30px;
  background: white;
  overflow: hidden;
}
</style>

<script>
import _ from "lodash";
import marked from "marked";
import DOMPurify from "dompurify";

export default {
  name: "Page",
  props: {
    content: Object,
  },
  updated() {
    this.$nextTick(() => {
      let el = document.querySelector(
        `#heading-${this.$route.hash.substring(1)}`
      );

      if (el) {
        window.scroll({
          top: el.getBoundingClientRect().top + window.pageYOffset - 80,
          behavior: "smooth",
        });
      }
    });
  },
  computed: {
    pageHtml() {
      if (this.content) {
        let baseUrl;

        if (this.content.path.endsWith("index.md")) {
          // we're rendering an index page, so we'll need to specify baseUrl
          baseUrl = `${_.nth(this.content.path.split("/"), -2)}/`;
        }

        return DOMPurify.sanitize(
          marked(atob(this.content.content), {
            baseUrl,
            headerPrefix: "heading-",
          })
        );
      }

      return "";
    },
  },
};
</script>
