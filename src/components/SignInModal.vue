<template>
  <div id="sign-in-modal" v-if="!authenticated">
    <div id="card">
      <span class="gitd-btn"
        ><i class="fab fa-github"></i> Sign In with GitHub</span
      >
    </div>
  </div>
</template>

<style scoped>
#sign-in-modal {
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

#card {
  background: white;
  border-radius: 1em;
  padding: 1em;
}
</style>

<script>
import { mapGetters } from "vuex";

export default {
  name: "SignInModal",
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
