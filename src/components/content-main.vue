<template>
  <main id="content-main">
    <main-menu />
    <router-view id="view" />
  </main>
</template>

<style scoped>
#content-main {
}
</style>

<script>
import MainMenu from "@/components/main-menu.vue";

export default {
  name: "content-main",
  props: {},
  components: {
    MainMenu,
  },
  methods: {},
};
</script>
