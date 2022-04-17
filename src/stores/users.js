// initial state
const state = () => ({
  authenticated: null,
  byUsername: {},
});

// getters
const getters = {
  authenticated: (state) => {
    return state.authenticated;
  },
};

// actions
const actions = {
  async updateAuthenticated({ rootState: { octokit }, commit }) {
    if (octokit) {
      const { data: authenticated } = await octokit.users.getAuthenticated();
      commit("setAuthenticated", authenticated);
      return authenticated;
    } else {
      commit("setAuthenticated", null);
    }
  },
};

// mutations
const mutations = {
  setAuthenticated(state, newAuthenticated) {
    state.authenticated = newAuthenticated;

    if (newAuthenticated) {
      state.byUsername[newAuthenticated.login] = newAuthenticated;
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
