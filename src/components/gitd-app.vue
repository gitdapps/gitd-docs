<template>
  <div id="gitd-app">
    <settings-dialog />
    <jump-dialog />
    <div id="gitd-grid">
      <prime-nav />
      <router-view id="view" />
    </div>
  </div>
</template>

<style>
#gitd-app {
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}

#gitd-grid {
  display: grid;
  grid-template-columns: 20em 2fr;
}

body {
  margin: 0;
  background: #fdfdfd;
}

html {
  height: 100%;
}

.gitd-btn {
  font-family: "Outfit", sans-serif;
  text-transform: uppercase;
  border: solid 1px black;
  padding: 0 0.5em;
  border-radius: 0.25em;
  user-select: none;
  cursor: pointer;
  white-space: nowrap;
  background: black;
  font-size: 1.1em;
  color: white;
}

.gitd-i-btn {
  user-select: none;
  cursor: pointer;
}

.gitd-logo {
  font-family: "Zen Tokyo Zoo";
  font-size: 1.5em;
  text-transform: uppercase;
}

.gitd-menu {
  display: flex;
  margin: 0;
  padding: 0;
  align-items: center;
  user-select: none;
  height: 1em;
  padding: 1em;
}

.gitd-menu-spacer {
  flex-grow: 1;
}
</style>

<script>
import PrimeNav from "@/components/prime-nav.vue";
import SettingsDialog from "@/components/settings-dialog.vue";
import JumpDialog from "@/components/jump-dialog.vue";

export default {
  name: "gitd-app",
  components: {
    PrimeNav,
    SettingsDialog,
    JumpDialog,
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

        // fetch the directory content
        await this.$store.dispatch("content/fetchContent", {
          owner,
          repo,
          ref,
          path: path
            .split("/")
            .slice(0, -1)
            .join("/"),
        });

        await this.$store.dispatch("content/fetchContent", {
          owner,
          repo,
          ref,
          path: path
            .split("/")
            .slice(0, -2)
            .join("/"),
        });
      }
    },
  },
  async mounted() {
    return this.update();
  },
};
</script>
