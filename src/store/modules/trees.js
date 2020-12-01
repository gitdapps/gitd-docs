import Vue from "vue";

// initial state
const state = () => ({});

// getters
const getters = {};

// actions
const actions = {
  async fetchTree({ rootState: { octokit }, commit }, { owner, repo, sha }) {
    if (octokit) {
      let { data } = await octokit.git.getTree({
        owner,
        repo,
        tree_sha: sha,
        recursive: true,
      });

      commit("setTree", {
        owner,
        repo,
        sha,
        data,
      });

      return data;
    }
  },
};

// mutations
const mutations = {
  setTree(state, { owner, repo, sha, data }) {
    if (!state[owner]) {
      Vue.set(state, owner, {});
    }

    if (!state[owner][repo]) {
      Vue.set(state[owner], repo, {});
    }

    Vue.set(state[owner][repo], sha, data);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
