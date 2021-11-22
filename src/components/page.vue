<template>
  <div id="page" v-html="contentHtml"></div>
</template>

<style>
#page {
  min-width: 40em;
  padding: 1em;
}
</style>

<script>
export default {
  name: "page",
  props: {
    contentHtml: String,
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
