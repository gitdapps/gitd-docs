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
  <div id="settings-dialog" v-if="!authenticated">
    <dialog open>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis finibus
      euismod rutrum. Quisque pulvinar turpis ut risus lobortis pulvinar.
      Phasellus iaculis mi nec fringilla aliquam.
      <button class="gitd-btn" @click="ghSignIn">
        <i class="fab fa-github" /> Sign In with GitHub
      </button>
    </dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

const clientId = "6cec68d5949ad85f6574";

export default {
  name: "settings-dialog",
  async mounted() {
    const code = new URLSearchParams(location.search).get("code");

    if (code) {
      try {
        const response = await fetch(`/github-access-token?code=${code}`);

        const { gitHubAccessToken } = await response.json();

        this.$store.commit("setGitHubAccessToken", gitHubAccessToken);
      } catch {
        console.log("failed to get access token");
      }
    }
  },
  methods: {
    ghSignIn() {
      window.location = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,read:user,read:discussion,write:discussion`;
    },
  },
  computed: {
    accessToken: {
      get() {
        return this.$store.state.gitHubAccessToken;
      },
      set(value) {
        this.$store.commit("setGitHubAccessToken", value);
      },
    },
    ...mapGetters("users", ["authenticated"]),
  },
};
</script>
