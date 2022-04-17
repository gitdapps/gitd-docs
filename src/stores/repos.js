import _ from "lodash";
import Vue from "vue";

// initial state
const state = () => ({});

// getters
const getters = {};

// actions
const actions = {
  async fetchRepo({ rootState: { octokit }, commit, state }, { owner, repo }) {
    let ret = _.get(state, `[${owner}][${repo}]`);

    if (!ret && octokit) {
      let { data } = await octokit.repos.get({ owner, repo });

      commit("setRepo", {
        owner,
        repo,
        data,
      });

      ret = data;
    }

    return ret;
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
