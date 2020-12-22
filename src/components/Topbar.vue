<template>
  <header id="topbar">
    <router-link id="avatar-link" v-bind:to="avatarHref"
      ><img id="avatar" v-bind:src="avatarSrc"
    /></router-link>
    <div id="nav-stack">
      <div id="pwd">{{ dirDisplay(pwd || repo) }}</div>
      <nav id="dir-nav">
        <router-link
          v-for="dir in dirs"
          v-bind:key="dir.url"
          class="dir-link"
          v-bind:to="dirHref(dir)"
          >{{ dirDisplay(dir) }}</router-link
        >
      </nav>
    </div>
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
  padding: 0.5em;
  align-items: center;
}

#avatar,
#avatar-link {
  height: 3em;
  position: relative;
  top: -0.05em;
}

#avatar-link {
  margin: 0.2em;
}
#dir-nav {
  margin: 0.3em;
  position: relative;
  top: 0.1em;
}

.dir-link {
  font-weight: bold;
  margin: 0.3em;
  padding: 0.3em;
  transition: 0.2s;
  color: #333;
  text-decoration: none;
  border-radius: 0.4em;
  text-transform: capitalize;
}

#pwd {
  font-size: 1.2em;
  font-weight: 100;
  text-transform: capitalize;
  margin: 0 0.5em;
  padding: 0 0.2em;
  position: relative;
  top: -0.1em;
}

.dir-link:hover {
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
        return null;
      }
    },
    pwd() {
      try {
        let {
          params: { owner, repo, path },
          query: {
            ref = `heads/${this.$store.state.repos[owner][repo].default_branch}`,
          },
        } = this.$route;

        let content = this.$store.state.content[owner][repo][ref][path];

        let parentContent = this.$store.state.content[owner][repo][ref][
          path
            .split("/")
            .slice(0, -1)
            .join("/")
        ];

        let grandParentContent = this.$store.state.content[owner][repo][ref][
          path
            .split("/")
            .slice(0, -2)
            .join("/")
        ];

        if (Array.isArray(content)) {
          // showing a directory
          return parentContent.find((e) => e.path === path);
        } else {
          // showing a file
          return grandParentContent.find(
            (e) =>
              e.path ===
              path
                .split("/")
                .slice(0, -1)
                .join("/")
          );
        }
      } catch (e) {
        return null;
      }
    },
    dirs() {
      try {
        let {
          params: { owner, repo, path },
          query: {
            ref = `heads/${this.$store.state.repos[owner][repo].default_branch}`,
          },
        } = this.$route;

        let content = this.$store.state.content[owner][repo][ref][path];

        if (!Array.isArray(content)) {
          content = this.$store.state.content[owner][repo][ref][
            path
              .split("/")
              .slice(0, -1)
              .join("/")
          ];
        }

        return content.filter(
          ({ type, name }) => type === "dir" && !name.startsWith(".")
        );
      } catch (e) {
        return null;
      }
    },
    avatarSrc() {
      try {
        return this.repo.owner.avatar_url;
      } catch (e) {
        return null;
      }
    },
    avatarHref() {
      try {
        return `/${this.repo.full_name}`;
      } catch (e) {
        return "#";
      }
    },
  },
  methods: {
    dirDisplay({ name } = {}) {
      return displayCase(name);
    },
    dirHref(dir) {
      try {
        return `/${this.repo.full_name}/${dir.path}`;
      } catch (e) {
        return null;
      }
    },
  },
};
</script>
