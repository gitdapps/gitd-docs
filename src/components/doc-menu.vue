<template>
  <menu class="gitd-menu">
    <router-link id="avatar-link" v-bind:to="avatarHref"
      ><img id="avatar" v-bind:src="avatarSrc"
    /></router-link>
    -->

    <div id="nav-stack">
      <div id="nav-one">
        <div id="title" v-bind:class="titleClass" v-on:click="titleClick">
          {{ entryDisplay(pwd || repo) }}
          <i class="material-icons">arrow_drop_down</i>
          <div id="title-popup" v-bind:style="titlePopupStyle">TITLE POPUP</div>
        </div>
        <div>
          <i v-on:click="up" class="control material-icons">folder_open</i>
        </div>
        -->
      </div>
      <nav id="nav-two">
        <i id="subdir" class="material-icons">subdirectory_arrow_right</i>
        <div id="dir-links">
          <router-link
            class="link dir-link"
            v-bind:class="entryClass(entry)"
            v-for="entry in dirContent"
            v-bind:key="entry.url"
            v-bind:to="entryHref(entry)"
            >{{ entryDisplay(entry) }}</router-link
          >
        </div>
      </nav>
    </div>
  </menu>
</template>

<style scoped>
menu {
  border-bottom: solid 1px #eee;
  position: sticky;
  top: 0;
  z-index: 2;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(0.5em);
}

#avatar,
#avatar-link {
  height: 3em;
}

#avatar-link {
  margin: 0.2em;
}

#nav-stack {
  margin: 0 1em;
}

#nav-one {
  display: flex;
}

#title {
  font-size: 1.2em;
  text-transform: capitalize;
  border-radius: 0.4em;
  padding: 0.2em 0.3em;
  transition: 0.2s;
  position: relative;
}

#title.active,
#title:hover {
  background: #eee;
}

#title i {
  color: grey;
  position: relative;
  top: 0.1em;
  font-size: 1em;
}

#title-popup {
  position: absolute;
  background: white;
  width: 300px;
  height: 500px;
  border-radius: 0.4em;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  top: 2em;
  left: 0;
  border: solid 1px lightgrey;
}

.control {
  padding: 0.2em;
  border-radius: 0.2em;
  transition: 0.2s;
  margin: 0 0.2em;
  color: #555;
  cursor: pointer;
  font-size: 1em;
}

#nav-two {
  display: flex;
}

#dir-links {
  margin-top: 0.3em;
  white-space: nowrap;
  left: 40px;
}

.dir-link {
  font-size: 0.9em;
  margin: 0 0.1em;
}

.dir-link.active,
.dir-link.active:hover {
  background: black;
  color: white;
  cursor: default;
}

.link:hover,
.control:hover {
  background: #eee;
}

.link {
  padding: 0.2em 0.3em;
  transition: 0.2s;
  color: black;
  text-decoration: none;
  border-radius: 0.4em;
  text-transform: capitalize;
}
</style>

<script setup>
import { displayCase } from "@/utils";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useGithubStore } from "@/stores/github";

const route = useRoute(),
  githubStore = useGithubStore(),
  titlePopupStyle = ref({ display: "none" }),
  titleClass = ref({ active: false }),
  repo = computed(() => {
    try {
      let { owner, repo } = route;
      return githubStore.repos[owner][repo];
    } catch (e) {
      return undefined;
    }
  }),
  pwd = computed(() => {
    try {
      let {
        params: { owner, repo, path },
        query: {
          ref = `heads/${githubStore.repos[owner][repo].default_branch}`,
        },
      } = this.$route;

      let content = githubStore.content[owner][repo][ref][path];

      let parentContent =
        githubStore.content[owner][repo][ref][
          path.split("/").slice(0, -1).join("/")
        ];

      let grandParentContent =
        githubStore.content[owner][repo][ref][
          path.split("/").slice(0, -2).join("/")
        ];

      if (Array.isArray(content)) {
        // showing a directory
        return parentContent.find((e) => e.path === path);
      } else {
        // showing a file
        return grandParentContent.find(
          (e) => e.path === path.split("/").slice(0, -1).join("/")
        );
      }
    } catch (e) {
      return undefined;
    }
  }),
  dirContent = computed(() => {
    try {
      let {
        params: { owner, repo, path },
        query: {
          ref = `heads/${githubStore.repos[owner][repo].default_branch}`,
        },
      } = this.$route;

      let content = githubStore.content[owner][repo][ref][path];

      if (!Array.isArray(content)) {
        content =
          githubStore.content[owner][repo][ref][
            path.split("/").slice(0, -1).join("/")
          ];
      }

      return content.filter(({ type, name }) => {
        let hidden = name.startsWith("."),
          index = name === "index.md",
          mdFile = type === "file" && name.toLowerCase().endsWith(".md"),
          dir = type === "dir";

        return !hidden && !index && (dir || mdFile);
      });
    } catch (e) {
      return undefined;
    }
  }),
  avatarSrc = computed(() => {
    try {
      return repo.value.owner.avatar_url;
    } catch (e) {
      return undefined;
    }
  }),
  avatarHref = computed(() => {
    try {
      return `/${repo.value.full_name}`;
    } catch (e) {
      return "#";
    }
  });

function titleClick() {
  let popupOpen = titlePopupStyle.value.display !== "none";

  titlePopupStyle.value.display = popupOpen ? "none" : undefined;
  titleClass.value.active = !popupOpen;
}

function entryDisplay({ name } = {}) {
  return name ? displayCase(name.replace(/\.[^/.]+$/, "")).trim() : undefined;
}

function entryHref(entry) {
  try {
    return `/${this.repo.full_name}/${entry.path}`;
  } catch (e) {
    return "#";
  }
}

function entryClass(entry) {
  return {
    active: this.$route.params.path === entry.path,
  };
}
</script>
