<style scoped>
#settings-dialog {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(200, 200, 200, 0.5);
  backdrop-filter: blur(0.25em);
}

dialog {
  background: white;
  border-radius: 1em;
  padding: 1em;
  width: 30em;
  height: 40em;
  border: none;
}
</style>

<template>
  <div id="settings-dialog" v-if="open === 'SETTINGS'" @click="done">
    <dialog open @click.stop>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis finibus
      euismod rutrum. Quisque pulvinar turpis ut risus lobortis pulvinar.
      Phasellus iaculis mi nec fringilla aliquam.
      <button class="gitd-btn" @click="ghSignIn" v-if="!authenticated">
        <i class="fab fa-github" /> Sign In with GitHub
      </button>

      <button class="gitd-btn" @click="disconnectGitHub" v-if="authenticated">
        <i class="fab fa-github" /> Sign Out
      </button>

      <button class="gitd-btn" @click="done" v-if="authenticated">
        done
      </button>
    </dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

const clientId = "6cec68d5949ad85f6574";

export default {
  name: "settings-dialog",
  async mounted() {
    if (!this.gitHubAccessToken) {
      console.log("not authenticated");
      this.$store.dispatch("dialogs/openDialog", "SETTINGS");
    }

    const code = new URLSearchParams(location.search).get("code");

    if (code) {
      try {
        await this.connectGitHub(code);

        history.replaceState(
          null,
          "",
          location.pathname +
            location.search.replace(/[?&]code=[^&]+/, "").replace(/^&/, "?")
        );
      } catch {
        console.log("failed to connect github");
      }
    }
  },
  methods: {
    ghSignIn() {
      window.location = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,read:user,read:discussion,write:discussion`;
    },
    done() {
      if (this.authenticated) {
        this.$store.dispatch("dialogs/closeDialog");
      }
    },
    ...mapActions(["connectGitHub", "disconnectGitHub"]),
  },
  computed: {
    ...mapGetters(["gitHubAccessToken"]),
    ...mapGetters("users", ["authenticated"]),
    ...mapGetters("dialogs", ["open"]),
  },
};
</script>
