import _ from "lodash";
import Vue from "vue";

// initial state
const state = () => ({});

// getters
const getters = {
  getRepo: (state) => ({ owner, name }) => {
    return _.get(state.repos, `[${owner}][${name}]`, {});
  },
};

// actions
const actions = {
  async fetchRepo({ rootState: { octokit }, commit }, { owner, repo }) {
    if (octokit) {
      let { data } = await octokit.repos.get({ owner, repo });

      commit("setRepo", {
        owner,
        repo,
        data,
      });

      return data;
    }
  },
};

// mutations
const mutations = {
  setRepo(state, { owner, repo, data }) {
    if (!state[owner]) {
      Vue.set(state, owner, {});
    }

    Vue.set(state[owner], repo, data);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
