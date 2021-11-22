<style scoped>
#settings-dialog {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(104, 104, 104, 0.5);
  backdrop-filter: blur(0.5em);
}

dialog {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 1em;
  background: white;
  border-radius: 1em;
  padding: 1em;
  border: none;
  max-width: 50%;
  min-width: 20em;
}

#dialog-controls {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1em;
  width: 100%;
}

#avatar {
  height: 15em;
  border-radius: 15em;
}

#authenticated-card {
  padding: 2em;
}

#authenticated-name {
  font-size: 2em;
}

#authenticated-login {
  font-size: 1.5em;
}

#gh-token-input {
  width: 100%;
  font-family: monospace;
  padding: 0.5em;
  width: 25em;
  text-align: center;
}
</style>

<template>
  <div
    id="settings-dialog"
    v-if="open === 'SETTINGS'"
    @click="done"
    @scroll.stop
  >
    <dialog open @click.stop>
      <span id="authenticated-card" v-if="authenticated">
        <img id="avatar" v-bind:src="authenticated.avatar_url" /><br />
        <span id="authenticated-name">{{ authenticated.name }}</span
        ><br />
        <span id="authenticated-login">
          <i class="fab fa-github" />&nbsp;
          <a target="blank" v-bind:href="authenticated.html_url">{{
            authenticated.login
          }}</a>
        </span>
      </span>
      <span v-if="!authenticated">
        You must connect with your GitHub account to use Gitd. Choose "Connect"
        below to be redirected to GitHub.com to authorize Gitd to access GitHub
        data using your account, or
        <a
          target="blank"
          @click="toggleToken"
          href="https://github.com/settings/tokens"
          >provide your token directly</a
        >.
      </span>

      <input
        id="gh-token-input"
        v-bind:style="tokenInputStyle"
        v-model="gitHubAccessToken"
        placeholder="paste your github token here"
      />

      <span id="dialog-controls">
        <i class="fas fa-key gitd-i-btn" @click="toggleToken" />

        <button class="gitd-btn" @click="ghConnect" v-if="!authenticated">
          <i class="fab fa-github" /> connect
        </button>

        <button class="gitd-btn" @click="ghDisconnect" v-if="authenticated">
          <i class="fab fa-github" /> disconnect
        </button>

        <button class="gitd-btn" @click="done" v-if="authenticated">
          done
        </button>
      </span>
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
      } catch (e) {
        console.log("failed to connect github");
      }
    }
  },
  data() {
    return { tokenInputStyle: { visibility: "hidden" } };
  },
  methods: {
    ghConnect() {
      window.location = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,read:user,read:discussion,write:discussion`;
    },
    ghDisconnect() {
      this.hideToken();
      this.disconnectGitHub();
    },
    toggleToken() {
      this.tokenInputStyle.visibility =
        this.tokenInputStyle.visibility === "hidden" ? "visible" : "hidden";
    },
    showToken() {
      this.tokenInputStyle.visibility = "visible";
    },
    hideToken() {
      this.tokenInputStyle.visibility = "hidden";
    },
    done() {
      this.hideToken();
      if (this.authenticated) {
        this.$store.dispatch("dialogs/closeDialog");
      }
    },
    ...mapActions(["connectGitHub", "disconnectGitHub"]),
  },
  computed: {
    ...mapGetters("users", ["authenticated"]),
    ...mapGetters("dialogs", ["open"]),
    gitHubAccessToken: {
      get() {
        return this.$store.state.gitHubAccessToken;
      },
      set(value) {
        this.$store.commit("setGitHubAccessToken", value);
      },
    },
  },
};
</script>
