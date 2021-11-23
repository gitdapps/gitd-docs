<template>
  <nav id="prime-nav">
    <!-- invisible shortkey-only action -->
    <span
      style="visibility:hidden"
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
    <router-link
      class="heading-link"
      v-for="heading in headings"
      v-bind:key="heading.text"
      v-bind:class="headingClass(heading)"
      v-bind:style="headingStyle(heading)"
      v-bind:to="headingFragment(heading)"
    >
      {{ headingDisplay(heading) }}
    </router-link>
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

<script>
import { mapGetters } from "vuex";

export default {
  name: "prime-nav",
  props: {
    headings: Array,
    files: Array,
  },
  computed: {
    ...mapGetters("users", ["authenticated"]),
    ...mapGetters("dialogs", ["open"]),
  },
  methods: {
    openSettingsDialog() {
      this.$store.dispatch("dialogs/openDialog", "SETTINGS");
    },
    toggleJumpDialog() {
      if (this.open === "JUMP") {
        this.$store.dispatch("dialogs/closeDialog");
      } else {
        this.$store.dispatch("dialogs/openDialog", "JUMP");
      }
    },
    closeDialog() {
      this.$store.dispatch("dialogs/closeDialog");
    },
    headingClass(heading) {
      return {
        active: this.$route.hash === this.headingFragment(heading),
      };
    },
    headingStyle(heading) {
      return {
        "padding-left": `${heading.depth}em`,
      };
    },
    headingDisplay(heading) {
      return heading.raw.replace(/#/gi, "").substring(1);
    },
    headingFragment(heading) {
      return `#${this.headingDisplay(heading)
        .toLowerCase()
        .replace(/ /gi, "-")
        .replace(/^[^a-z]+|[^\w:.-]+/gi, "")}`;
    },
  },
};
</script>
