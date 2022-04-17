import _ from "lodash";
import { Octokit } from "https://cdn.skypack.dev/octokit";

import { defineStore } from "pinia";

const initOctokit = (auth) =>
  auth ? new Octokit({ auth, userAgent: "gitd" }) : null;

export const useGithubStore = defineStore("github", {
  state: () => {
    return {
      octokit: initOctokit(localStorage.getItem("gitHubAccessToken")),
      accessToken: localStorage.getItem("gitHubAccessToken") || null,
      content: {},
      repos: {},
    };
  },
  getters: {
    octokit: (state) => state.octokit,
    accessToken: (state) => state.accessToken,
  },
  actions: {
    async connectGitHub(code) {
      try {
        const response = await fetch(`/github-access-token?code=${code}`);

        const { gitHubAccessToken } = await response.json();

        if (gitHubAccessToken) {
          localStorage.setItem("gitHubAccessToken", gitHubAccessToken);
          this.accessToken = gitHubAccessToken;
          this.octokit = initOctokit(gitHubAccessToken);
        }
      } catch (e) {
        console.log("failed to get access token");
      }
    },
    async disconnectGitHub() {
      localStorage.removeItem("gitHubAccessToken");
      this.accessToken = null;
      this.octokit = null;
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
