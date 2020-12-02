import _ from "lodash";
import Vue from "vue";

// initial state
const state = () => ({});

const getMarkdownBlobs = (state, owner, repo, sha) =>
  _.get(state, `[${owner}][${repo}][${sha}].tree`, []).filter((blob) =>
    blob.path.endsWith(".md")
  );

// getters
const getters = {
  markdownBlobs: (state) => ({ owner, repo, sha }) => {
    return getMarkdownBlobs(state, owner, repo, sha);
  },
  defaultMarkdownBlob: (state) => ({ owner, repo, sha }) => {
    let mdbs = getMarkdownBlobs(state, owner, repo, sha);

    return (
      _.find(mdbs, (mdb) => mdb.path.toLowerCase() === "index.md") ||
      _.find(mdbs, (mdb) => mdb.path.toLowerCase() === "readme.md") ||
      _.first(mdbs)
    );
  },
};

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
