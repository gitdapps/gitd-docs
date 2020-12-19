<template>
  <div id="app">
    <topbar id="topbar" v-bind:sections="sections"></topbar>
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
  computed: {
    sections() {
      try {
        let {
            params: { owner, repo, path },
            query: { ref },
          } = this.$route,
          { default_branch: defaultBranch } = this.$store.state.repos[owner][
            repo
          ],
          {
            object: { sha },
          } = this.$store.state.refs[owner][repo][
            ref || `heads/${defaultBranch}`
          ],
          { tree } = this.$store.state.trees[owner][repo][sha],
          node = tree.find((e) => e.path === path),
          prefix =
            node.type === "tree"
              ? node.path
              : node.path
                  .split("/")
                  .slice(0, -1)
                  .join("/");

        return tree
          .filter((e) => e.type === "tree")
          .filter((e) => e.path.startsWith(prefix));
      } catch (e) {
        return [];
      }
    },
  },
  methods: {
    async update() {
      let {
        params: { owner, repo, path },
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

      // make sure ref is in the store, capture the sha
      let {
        object: { sha },
      } = await this.$store.dispatch("refs/fetchRef", {
        owner,
        repo,
        ref: ref || `heads/${defaultBranch}`, // if the ref isnt in route params, fall back to repo default branch
      });

      // make sure tree is in the store
      await this.$store.dispatch("trees/fetchTree", {
        owner,
        repo,
        sha,
      });

      // if the path isnt in the route, push the default markdown path to the route
      if (!path) {
        let defaultMarkdownBlob = this.$store.getters[
          "trees/defaultMarkdownBlob"
        ]({
          owner,
          repo,
          sha,
        });

        this.$router.push(`/${owner}/${repo}/${defaultMarkdownBlob.path}`);
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
          let directoryContent = content.find((e) =>
            e.path.endsWith("index.md")
          );

          if (!directoryContent) {
            // if there is no index.md, fallback to first markdown file
            directoryContent = content[0];
          }

          // fetch the content to be rendered for the directory page
          await this.$store.dispatch("content/fetchContent", {
            owner,
            repo,
            ref,
            path: directoryContent.path,
          });
        }
      }
    },
  },
  async mounted() {
    return this.update();
  },
};
</script>
