<template>
  <div class="connect">
    <div>provide github personal access token</div>
    <input
      v-model="accessTokenInput"
      placeholder="github personal access token"
    />
    <button v-on:click="connect">connect</button>
    {{ message }}
  </div>
</template>

<script>
import github from "../utils/github.js";

export default {
  name: "Connect",
  data() {
    return {
      accessTokenInput: undefined,
      message: "",
    };
  },
  computed: {
    githubAccessToken() {
      return github.accessToken();
    }
  },
  methods: {
  },
};
</script>
