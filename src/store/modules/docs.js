import _ from "lodash";
import Vue from "vue";
import { marked } from "marked";
import DOMPurify from "dompurify";

// initial state
const state = () => ({});

// actions
const actions = {
  async parse({ commit }, { owner, repo, ref, path, contentBlob }) {
    let baseUrl = "",
      html,
      headings = [];

    if (path.endsWith("index.md")) {
      // we're rendering an index page, so we'll need to specify baseUrl
      baseUrl = `${_.nth(path.split("/"), -2)}/`;
    }

    html = DOMPurify.sanitize(
      marked.parse(atob(contentBlob), {
        baseUrl,
        headerPrefix: "heading-",
        walkTokens(token) {
          if (token.type === "heading") {
            headings.push(token);
          }
        },
      }),
      { ADD_TAGS: ["router-link"], ADD_ATTR: ["to"] }
    );

    commit("setDoc", { owner, repo, ref, path, html, headings });
  },
};

// mutations
const mutations = {
  setDoc(state, { owner, repo, ref, path, html, headings }) {
    if (!state[owner]) {
      Vue.set(state, owner, {});
    }

    if (!state[owner][repo]) {
      Vue.set(state[owner], repo, {});
    }

    if (!state[owner][repo][ref]) {
      Vue.set(state[owner][repo], ref, {});
    }

    Vue.set(state[owner][repo][ref], path, { html, headings });
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
