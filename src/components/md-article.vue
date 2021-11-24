<template>
  <article id="md-article" v-html="contentHtml"></article>
</template>

<style scoped></style>

<script>
import _ from "lodash";
import marked from "marked";
import DOMPurify from "dompurify";

export default {
  name: "md-article",
  props: {
    mdContent: Object,
  },
  computed: {
    contentHtml() {
      if (!this.mdContent) {
        return "";
      }

      let baseUrl;

      if (this.mdContent.path.endsWith("index.md")) {
        // we're rendering an index page, so we'll need to specify baseUrl
        baseUrl = `${_.nth(this.mdContent.path.split("/"), -2)}/`;
      }

      let headings = [],
        html = DOMPurify.sanitize(
          marked(atob(this.mdContent.content), {
            baseUrl,
            headerPrefix: "heading-",
            walkTokens(token) {
              if (token.type === "heading") {
                headings.push(token);
              }
            },
          }),
          { ADD_TAGS: ["router-link"], ADD_ATTR: ["to"] }
        );

      return html;
    },
  },
  methods: {
    scrollToHash(hash) {
      this.$nextTick(() => {
        let el = document.querySelector(`#heading-${hash.substring(1)}`);

        if (el) {
          window.scroll({
            top: el.getBoundingClientRect().top + window.pageYOffset - 80,
            behavior: "smooth",
          });
        }
      });
    },
  },
  watch: {
    $route({ hash }) {
      this.scrollToHash(hash);
    },
  },
  updated() {
    this.scrollToHash(this.$route.hash);
  },
};
</script>
