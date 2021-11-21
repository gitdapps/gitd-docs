// initial state
const state = () => ({
  open: null,
});

// getters
const getters = {
  open: (state) => {
    return state.open;
  },
};

// actions
const actions = {
  async openDialog({ commit }, name) {
    commit("setOpen", name);
  },
  async closeDialog({ commit }) {
    commit("setOpen", null);
  },
};

// mutations
const mutations = {
  setOpen(state, newOpen) {
    state.open = newOpen;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
