<template>
  <div class="settings">
    <input
      type="password"
      v-model="accessToken"
      placeholder="github personal access token"
    />

    <github-user v-if="authenticated" v-bind:user="authenticated"></github-user>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import GithubUser from "@/components/GithubUser.vue";

export default {
  name: "Settings",
  components: {
    GithubUser,
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
