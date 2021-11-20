<template>
  <div class="page" v-html="contentHtml"></div>
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
