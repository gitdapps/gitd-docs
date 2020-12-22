import _ from "lodash";
import Vue from "vue";

// initial state
const state = () => ({});

// getters
const getters = {};

// actions
const actions = {
  async fetchTree(
    { rootState: { octokit }, commit, state },
    { owner, repo, sha }
  ) {
    let ret = _.get(state, `[${owner}][${repo}][${sha}]`);

    if (!ret && octokit) {
      let { data } = await octokit.git.getTree({
        owner,
        repo,
        tree_sha: sha,
      });

      commit("setTree", {
        owner,
        repo,
        sha,
        data,
      });

      ret = data;
    }

    return ret;
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
