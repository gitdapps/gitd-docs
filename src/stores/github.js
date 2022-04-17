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
      let ret = _.get(this, [owner, repo, ref, path]);

      if (_.isNil(ret) && this.octokit) {
        let { data } = await this.octokit.repos.getContent({
          owner,
          repo,
          ref,
          path,
        });

        if (!this.content[owner]) {
          this.content[owner] = {};
        }

        if (!this.content[owner][repo]) {
          this.content[owner][repo] = {};
        }

        if (!this.content[owner][repo][ref]) {
          this.content[owner][repo][ref] = {};
        }

        this.content[owner][repo][ref][path] = data;

        ret = data;
      }

      return ret;
    },
    async fetchRepo({ owner, repo }) {
      let ret = _.get(this.repos, `[${owner}][${repo}]`);

      if (!ret && this.octokit) {
        let { data } = await this.octokit.repos.get({ owner, repo });

        if (!this.repos[owner]) {
          this.repos[owner] = {};
        }

        this.repos[owner][repo] = data;

        ret = data;
      }

      return ret;
    },
  },
});
