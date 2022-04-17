import _ from "lodash";
import { Octokit } from "https://cdn.skypack.dev/octokit";
import { defineStore } from "pinia";

const GH_PAT_LS_KEY = "githubPersonalAccessToken";

const initOctokit = (personalAccessToken) =>
  personalAccessToken
    ? new Octokit({ auth: personalAccessToken, userAgent: "gitd" }).rest
    : null;

export const useGithubStore = defineStore("github", {
  state: () => {
    let personalAccessToken = localStorage.getItem(GH_PAT_LS_KEY);

    return {
      octokit: initOctokit(personalAccessToken),
      auth: personalAccessToken
        ? {
            personalAccessToken,
          }
        : null,
      content: {},
      repos: {},
      users: {
        authenticated: null,
        byUsername: {},
      },
      refs: {},
    };
  },
  getters: {
    isConnected: (state) => state.auth && state.octokit,
  },
  actions: {
    // only supporting personal access tokens for now
    async connect({ personalAccessToken }) {
      if (personalAccessToken) {
        localStorage.setItem(GH_PAT_LS_KEY, personalAccessToken);
        this.auth = { personalAccessToken };
        this.octokit = initOctokit(personalAccessToken);

        let { data: authenticated } =
          await this.octokit.users.getAuthenticated();
        this.users.authenticated = authenticated;
      }
    },
    async disconnect() {
      localStorage.removeItem(GH_PAT_LS_KEY);
      this.auth = null;
      this.octokit = null;
      this.users.authenticated = null;
    },
    async fetchContent({ owner, repo, ref, path }) {
      let ret = _.get(this.content, [owner, repo, ref, path]);

      if (_.isNil(ret) && this.octokit) {
        ret = await this.octokit.repos.getContent({
          owner,
          repo,
          ref,
          path,
        }).data;

        _.set(this.content, [owner, repo, ref, path], ret);
      }

      return ret;
    },
    async fetchRepo({ owner, repo }) {
      let ret = _.get(this.repos, [owner, repo]);

      if (_.isNil(ret) && this.octokit) {
        ret = (await this.octokit.repos.get({ owner, repo })).data;

        _.set(this.repos, [owner, repo], ret);
      }

      return ret;
    },
    async fetchRef({ owner, repo, ref }) {
      let ret = _.get(this.refs, [owner, repo, ref]);

      if (_.isNil(ret) && this.octokit) {
        ret = (
          await this.octokit.git.getRef({
            owner,
            repo,
            ref,
          })
        ).data;

        _.set(this.refs, [owner, repo, ref], ret);
      }

      return ret;
    },
  },
});
