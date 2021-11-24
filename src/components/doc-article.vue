<template>
  <article v-html="docHtml"></article>
</template>

<style scoped></style>

<script>
export default {
  name: "doc-article",
  props: {
    doc: Object,
  },
  computed: {
    docHtml() {
      return this.doc ? this.doc.html : "";
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
