import _ from "lodash";
import Vue from "vue";

// initial state
const state = () => ({});

// getters
const getters = {};

// actions
const actions = {
  async fetchRef(
    { rootState: { octokit }, commit, state },
    { owner, repo, ref }
  ) {
    let ret = _.get(state, `[${owner}][${repo}][${ref}]`);

    if (!ret && octokit) {
      try {
        ret = (
          await octokit.git.getRef({
            owner,
            repo,
            ref,
          })
        ).data;

        commit("setRef", {
          owner,
          repo,
          ref,
          data: ret,
        });
      } catch (e) {
        ret = undefined;
      }
    }

    return ret;
  },
};

// mutations
const mutations = {
  setRef(state, { owner, repo, ref, data }) {
    if (!state[owner]) {
      Vue.set(state, owner, {});
    }

    if (!state[owner][repo]) {
      Vue.set(state[owner], repo, {});
    }

    Vue.set(state[owner][repo], ref, data);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
