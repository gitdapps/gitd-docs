<template>
  <header id="topbar">
    <a id="avatar-link" v-bind:href="avatarHref"
      ><img id="avatar" v-bind:src="avatarSrc"
    /></a>
    <div id="current-section">{{ sectionDisplay(currentSection) }}</div>
    <nav id="section-nav">
      <a
        v-for="section in sections"
        v-bind:key="section.url"
        class="section-link"
        v-bind:href="sectionHref(section)"
        >{{ sectionDisplay(section) }}</a
      >
    </nav>
  </header>
</template>

<style scoped>
#topbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: white;
  overflow: hidden;
  border-bottom: solid 1px #ddd;
  display: flex;
  padding: 1em;
}

#avatar-link {
  height: 2em;
}

#avatar {
  height: 2em;
}

#section-nav {
  margin: 0.5em 1em;
}

.section-link {
  font-weight: bold;
  margin: 0.4em;
  padding: 0.4em;
  transition: 0.2s;
  color: #333;
  text-decoration: none;
  border-radius: 0.4em;
  text-transform: capitalize;
}

#current-section {
  font-size: 1.5em;
  font-weight: 100;
  text-transform: capitalize;
  margin: 0 1em;
  padding-top: 0.1em;
}

.section-link:hover {
  background: lightgrey;
}
</style>

<script>
import { displayCase } from "@/utils";

export default {
  name: "Topbar",
  computed: {
    repo() {
      try {
        let { owner, repo } = this.$route.params;
        return this.$store.state.repos[owner][repo];
      } catch (e) {
        return undefined;
      }
    },
    currentSection() {
      try {
        let {
            params: { owner, repo, path },
            query: {
              ref = `heads/${this.$store.state.repos[owner][repo].default_branch}`,
            },
          } = this.$route,
          {
            object: { sha },
          } = this.$store.state.refs[owner][repo][ref],
          { tree } = this.$store.state.trees[owner][repo][sha];

        return tree.find((e) => e.path === path);
      } catch (e) {
        return undefined;
      }
    },
    sections() {
      try {
        let {
            params: { owner, repo, path },
            query: {
              ref = `heads/${this.$store.state.repos[owner][repo].default_branch}`,
            },
          } = this.$route,
          {
            object: { sha },
          } = this.$store.state.refs[owner][repo][ref],
          { tree } = this.$store.state.trees[owner][repo][sha],
          node = tree.find((e) => e.path === path),
          prefix =
            node.type === "tree"
              ? node.path
              : node.path
                  .split("/")
                  .slice(0, -1)
                  .join("/"),
          depth = prefix.split("/").filter((e) => e.length > 0).length;

        return tree
          .filter((e) => e.type === "tree")
          .filter((e) => !e.path.split("/").some((e) => e.startsWith(".")))
          .filter(
            (e) =>
              e.path.startsWith(prefix) &&
              e.path.split("/").length === depth + 1
          );
      } catch (e) {
        return [];
      }
    },
    avatarSrc() {
      try {
        return this.repo.owner.avatar_url;
      } catch (e) {
        return undefined;
      }
    },
    avatarHref() {
      try {
        return `/${this.repo.full_name}`;
      } catch (e) {
        return undefined;
      }
    },
  },
  methods: {
    sectionDisplay(section) {
      try {
        return displayCase(section.path.split("/").pop());
      } catch (e) {
        return undefined;
      }
    },
    sectionHref(section) {
      try {
        return `/${this.repo.full_name}/${section.path}`;
      } catch (e) {
        return undefined;
      }
    },
  },
};
</script>
