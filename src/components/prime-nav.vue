<template>
  <nav id="prime-nav">
    <!-- invisible shortkey-only action -->
    <span
      style="visibility: hidden"
      v-shortkey="['esc']"
      @shortkey="closeDialog"
    />
    <menu class="gitd-menu" id="app-menu">
      <span class="gitd-logo">GITD</span>
      <span class="gitd-menu-spacer" />
      <i
        class="fas fa-search gitd-i-btn"
        v-shortkey="['meta', 'k']"
        @click="toggleJumpDialog"
        @shortkey="toggleJumpDialog"
      />
      <img
        id="avatar"
        v-if="authenticated"
        v-bind:src="authenticated.avatar_url"
        @click="openSettingsDialog"
      />
    </menu>
    <!-- <div>
      <doc-toc v-bind:doc="doc" />
    </div> -->
  </nav>
</template>

<style scoped>
#prime-nav {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  background: #eee;
  border-right: solid 1px #ccc;
  height: 100vh;
}

#app-menu {
  justify-content: flex-end;
  gap: 1em;
}

#avatar {
  height: 2em;
  border-radius: 2em;
  cursor: pointer;
}

.heading-link {
  font-weight: bold;
  margin: 0.4em;
  padding: 0.4em;
  transition: 0.2s;
  color: #333;
  text-decoration: none;
  border-radius: 0.4em;
  text-transform: capitalize;
  display: block;
}

.heading-link.active {
  background: lightgrey;
}

.heading-link:hover {
  background: lightgrey;
}
</style>

<script setup>
import { computed } from "vue";
// import { useRoute } from "vue-router";
// import { useGithubStore } from "@/stores/github";
import { useDialogsStore } from "@/stores/dialogs";
import DocToc from "@/components/doc-toc.vue";

const dialogsStore = useDialogsStore(),
  // props = defineProps({
  //     headings: Array,
  //     files: Array,
  //   }),
  // route = useRoute(),
  // githubStore = useGithubStore(),
  doc = computed(() => {
    // let { owner, repo, path } = route.params,
    //   { ref } = route.query;

    // try {
    //   if (!ref) {
    //     // fall back to repo default branch if ref not specified
    //     ref = `heads/${githubStore.repos[owner][repo].default_branch}`;
    //   }
    //   return githubStore.docs[owner][repo][ref][path];
    // } catch (e) {
    //   return null;
    // }

    return null;
  });

//   computed: {
//     // ...mapGetters("users", ["authenticated"]),
//     // ...mapGetters("dialogs", ["open"]),
//     doc() {

//     },
//   },

function openSettingsDialog() {
  dialogsStore.openDialog("SETTINGS");
}

//     function toggleJumpDialog() {
//       if (this.open === "JUMP") {
//         this.$store.dispatch("dialogs/closeDialog");
//       } else {
//         this.$store.dispatch("dialogs/openDialog", "JUMP");
//       }
//     }

function closeDialog() {
  dialogsStore.closeDialog();
}
</script>
