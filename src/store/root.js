import Vue from "vue";
import Vuex from "vuex";

import { Octokit } from "@octokit/rest";

import users from "./modules/users";
import repos from "./modules/repos";
import content from "./modules/content";
import dialogs from "./modules/dialogs";
import docs from "./modules/docs";

const initOctokit = (auth) =>
  auth ? new Octokit({ auth, userAgent: "GiTD Dev" }) : null;

// initial root state
const state = () => ({
  octokit: initOctokit(localStorage.getItem("gitHubAccessToken")),
  gitHubAccessToken: localStorage.getItem("gitHubAccessToken"),
  at: "",
});

// root getters
const getters = {
  octokit(state) {
    return state.octokit;
  },
  gitHubAccessToken() {
    return state.gitHubAccessToken;
  },
  at() {
    return state.at;
  },
};

// root actions
const actions = {
  async connectGitHub({ commit }, code) {
    try {
      const response = await fetch(`/github-access-token?code=${code}`);

      const { gitHubAccessToken } = await response.json();

      commit("setGitHubAccessToken", gitHubAccessToken);
    } catch (e) {
      console.log("failed to get access token");
    }
  },
  async disconnectGitHub({ commit }) {
    commit("clearGitHubAccessToken");
  },
  async go({ commit }, { owner, repo, path, ref }) {
    // make sure repo is in the store
    let { default_branch: defaultBranch } = await store.dispatch(
      "repos/fetchRepo",
      {
        owner,
        repo,
      }
    );

    // if the ref isnt specified, fall back to repo default branch
    ref = ref || `heads/${defaultBranch}`;

    // fetch content
    let content = await store.dispatch("content/fetchContent", {
      owner,
      repo,
      ref,
      path,
    });

    // handle directory case
    if (Array.isArray(content)) {
      // try to use an index.md file
      let indexContent = content.find(({ path }) => path.endsWith("index.md"));

      if (indexContent) {
        // fetch the index contents
        content = await store.dispatch("content/fetchContent", {
          owner,
          repo,
          ref,
          path: indexContent.path,
        });
      }
    }

    await store.dispatch("docs/parse", {
      owner,
      repo,
      ref,
      path,
      contentBlob: content.content,
    });

    commit("setAt", { owner, repo, path, ref });

    return { content };

    // fetch additional contents

    // await this.$store.dispatch("content/fetchContent", {
    //   owner,
    //   repo,
    //   ref,
    //   path: path
    //     .split("/")
    //     .slice(0, -1)
    //     .join("/"),
    // });

    // await this.$store.dispatch("content/fetchContent", {
    //   owner,
    //   repo,
    //   ref,
    //   path: path
    //     .split("/")
    //     .slice(0, -2)
    //     .join("/"),
    // });
  },
};

// root mutations
const mutations = {
  setGitHubAccessToken(state, newToken) {
    if (newToken) {
      localStorage.setItem("gitHubAccessToken", newToken);
      Vue.set(state, "gitHubAccessToken", newToken);
      Vue.set(state, "octokit", initOctokit(newToken));
    }
  },
  clearGitHubAccessToken(state) {
    localStorage.removeItem("gitHubAccessToken");
    Vue.set(state, "gitHubAccessToken", null);
    Vue.set(state, "octokit", null);
  },
  setAt(state, newAt) {
    Vue.set(state, "at", newAt);
  },
};

Vue.use(Vuex);

const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules: { users, repos, content, dialogs, docs },
});

store.watch(
  (state) => state.octokit,
  () => {
    store.dispatch("users/updateAuthenticated");
  }
);

store.dispatch("users/updateAuthenticated");

export default store;
