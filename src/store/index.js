import Vue from "vue";
import Vuex from "vuex";

import { Octokit } from "@octokit/rest";

import users from "./modules/users";
import repos from "./modules/repos";
import refs from "./modules/refs";
import trees from "./modules/trees";
import content from "./modules/content";

const initOctokit = (auth) =>
  auth ? new Octokit({ auth, userAgent: "GiTD Dev" }) : null;

// initial root state
const state = () => ({
  octokit: initOctokit(localStorage.getItem("gitHubAccessToken")),
  gitHubAccessToken: localStorage.getItem("gitHubAccessToken"),
});

// root getters
const getters = {
  gitHubAccessToken: (state) => {
    return state.gitHubAccessToken;
  },
  octokit: (state) => {
    return state.octokit;
  },
};

// root actions
const actions = {};

// root mutations
const mutations = {
  setGitHubAccessToken(state, newToken) {
    localStorage.setItem("gitHubAccessToken", newToken);
    state.gitHubAccessToken = newToken;
    state.octokit = initOctokit(newToken);
  },
};

Vue.use(Vuex);

const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules: { users, repos, refs, trees, content },
});

store.watch(
  (state) => state.octokit,
  () => {
    store.dispatch("users/updateAuthenticated");
  }
);

store.dispatch("users/updateAuthenticated");

export default store;
