import Vue from "vue";
import Vuex from "vuex";

import { Octokit } from "@octokit/rest";

import users from "./modules/users";
import repos from "./modules/repos";
import content from "./modules/content";
import dialogs from "./modules/dialogs";

const initOctokit = (auth) =>
  auth ? new Octokit({ auth, userAgent: "GiTD Dev" }) : null;

// initial root state
const state = () => ({
  octokit: initOctokit(localStorage.getItem("gitHubAccessToken")),
});

// root getters
const getters = {
  octokit(state) {
    return state.octokit;
  },
  gitHubAccessToken() {
    return localStorage.getItem("gitHubAccessToken");
  },
};

// root actions
const actions = {
  async connectGitHub({ commit }, code) {
    try {
      const response = await fetch(`/github-access-token?code=${code}`);

      const { gitHubAccessToken } = await response.json();

      commit("setGitHubAccessToken", gitHubAccessToken);
    } catch {
      console.log("failed to get access token");
    }
  },
  async disconnectGitHub({ commit }) {
    commit("clearGitHubAccessToken");
  },
};

// root mutations
const mutations = {
  setGitHubAccessToken(state, newToken) {
    if (newToken) {
      localStorage.setItem("gitHubAccessToken", newToken);
      state.gitHubAccessToken = newToken;
      state.octokit = initOctokit(newToken);
    }
  },
  clearGitHubAccessToken(state) {
    localStorage.removeItem("gitHubAccessToken");
    state.gitHubAccessToken = null;
    state.octokit = null;
  },
};

Vue.use(Vuex);

const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules: { users, repos, content, dialogs },
});

store.watch(
  (state) => state.octokit,
  () => {
    store.dispatch("users/updateAuthenticated");
  }
);

store.dispatch("users/updateAuthenticated");

export default store;
