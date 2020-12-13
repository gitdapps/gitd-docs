<template>
  <div class="topbar">
    <a
      v-for="section in sections"
      v-bind:href="section.path"
      v-bind:key="section.url"
    >
      {{ section.path }}</a
    >
  </div>
</template>

<style scoped>
.topbar {
  height: 62px;
  width: 100%;
  background: #24292e;
  color: white;
  overflow: hidden;
}

a {
  color: white;
}
</style>

<script>
export default {
  name: "Topbar",
  computed: {
    sections() {
      let { owner, repo, ref } = this.$route.params;

      try {
        let { sha } = this.$store.state.refs[owner][repo][ref].object;

        let { tree } = this.$store.state.trees[owner][repo][sha];

        return tree
          .filter((e) => e.type === "tree")
          .filter((e) => !e.path.includes("/"));
      } catch (e) {
        return undefined;
      }
    },
  },
};
</script>
