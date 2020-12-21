import _ from "lodash";
import Vue from "vue";

// initial state
const state = () => ({});

// getters
const getters = {};

// actions
const actions = {
  async fetchContent(
    { rootState: { octokit }, commit, state },
    { owner, repo, ref, path }
  ) {
    let ret = _.get(state, [owner, repo, ref, path]);

    if (_.isNil(ret) && octokit) {
      let { data } = await octokit.repos.getContent({ owner, repo, ref, path });

      commit("setContent", {
        owner,
        repo,
        ref,
        path,
        data,
      });

      ret = data;
    }

    return ret;
  },
};

// mutations
const mutations = {
  setContent(state, { owner, repo, ref, path, data }) {
    if (!state[owner]) {
      Vue.set(state, owner, {});
    }

    if (!state[owner][repo]) {
      Vue.set(state[owner], repo, {});
    }

    if (!state[owner][repo][ref]) {
      Vue.set(state[owner][repo], ref, {});
    }

    Vue.set(state[owner][repo][ref], path, data);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
