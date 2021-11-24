<template>
  <div id="gitd-app">
    <settings-dialog />
    <jump-dialog />
    <div id="gitd-grid">
      <prime-nav />
      <router-view />
    </div>
  </div>
</template>

<style scoped>
#gitd-app {
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  background: #fdfdfd;
}

#gitd-grid {
  display: grid;
  grid-template-columns: 20em 2fr;
}
</style>

<style>
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

      if (path.endsWith("index.md")) {
        // redirect "index.md" to directory url
        this.$router.push(`/${owner}/${repo}/${path.replace("/index.md", "")}`);
        return;
      }

      let { content } = await this.$store.dispatch("go", {
        owner,
        repo,
        path,
        ref,
      });

      if (Array.isArray(content)) {
        // if content isn't a single file, redirect to best markdown file we can find
        let firstMd = content.find(({ path }) => /.md$/i.test(path)),
          readmeMd = content.find(({ path }) => /readme\.md$/i.test(path));

        if (firstMd || readmeMd) {
          this.$router.push(`/${owner}/${repo}/${(readmeMd || firstMd).path}`);
        }
      }
    },
  },
  async mounted() {
    return this.update();
  },
};
</script>
