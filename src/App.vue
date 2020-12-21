<template>
  <div id="app">
    <topbar id="topbar"></topbar>
    <router-view id="view" />
  </div>
</template>

<style>
#app {
  font-family: Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}

body {
  margin-top: 50px;
  background: #f6f8fa;
  padding: 30px 300px;
  height: 100%;
}

html {
  height: 100%;
}
</style>

<script>
import Topbar from "@/components/Topbar.vue";

export default {
  name: "App",
  components: {
    Topbar,
  },
  watch: {
    async $route() {
      return this.update();
    },
  },
  methods: {
    async update() {
      let {
        params: { owner, repo, path = "" },
        query: { ref },
      } = this.$route;

      // make sure repo is in the store, capture the default branch in case we need it later
      let { default_branch: defaultBranch } = await this.$store.dispatch(
        "repos/fetchRepo",
        {
          owner,
          repo,
        }
      );

      ref = ref || `heads/${defaultBranch}`; // if the ref isnt specified in route, fall back to repo default branch

      // make sure ref is in the store, capture the sha
      let {
        object: { sha },
      } = await this.$store.dispatch("refs/fetchRef", {
        owner,
        repo,
        ref,
      });

      // make sure tree is in the store
      await this.$store.dispatch("trees/fetchTree", {
        owner,
        repo,
        sha,
      });

      // if the path isnt in the route, push the default markdown path to the route
      if (path.endsWith("index.md")) {
        // redirect "index.md" to directory url
        this.$router.push(`/${owner}/${repo}/${path.replace("/index.md", "")}`);
      } else {
        // if we have a good path in the route, fetch the content
        let content = await this.$store.dispatch("content/fetchContent", {
          owner,
          repo,
          ref,
          path,
        });

        if (Array.isArray(content)) {
          // we're dealing with a directory
          // first, try to use an index.md file
          let indexContent = content.find(({ path }) =>
            path.endsWith("index.md")
          );

          if (indexContent) {
            // fetch the index
            await this.$store.dispatch("content/fetchContent", {
              owner,
              repo,
              ref,
              path: indexContent.path,
            });
          } else {
            // if there is no index, redirect to first markdown file
            let firstMk = content.find(({ path }) => path.endsWith(".md"));

            if (firstMk) {
              this.$router.push(`/${owner}/${repo}/${firstMk.path}`);
            }
          }
        }
      }
    },
  },
  async mounted() {
    return this.update();
  },
};
</script>
