import _ from 'lodash'
import { Octokit } from 'https://esm.sh/octokit'

import { defineStore } from 'pinia'

function initOctokit(personalAccessToken) {
  return new Octokit({ auth: personalAccessToken, userAgent: 'gitd' }).rest
}

const GH_PAT_LS_KEY = 'githubPersonalAccessToken'
let octokit = initOctokit(localStorage.getItem(GH_PAT_LS_KEY))

export const useGithubStore = defineStore('github', {
  state: () => {
    return {
      auth: { personalAccessToken: localStorage.getItem(GH_PAT_LS_KEY) },
      content: {},
      repos: {},
      users: {
        authenticated: null,
        byUsername: {}
      },
      refs: {}
    }
  },
  actions: {
    // only supporting personal access tokens for now
    async signIn({ personalAccessToken }) {
      if (personalAccessToken) {
        localStorage.setItem(GH_PAT_LS_KEY, personalAccessToken)
        this.auth = { personalAccessToken }
        octokit = initOctokit(personalAccessToken)

        let { data: authenticated } = await octokit.users.getAuthenticated()
        this.users.authenticated = authenticated
      }
    },
    async signOut() {
      localStorage.removeItem(GH_PAT_LS_KEY)
      this.auth = null
      octokit = initOctokit()
      this.users.authenticated = null
    },
    async fetchContent({ owner, repo, ref, path }) {
      let ret = _.get(this.content, [owner, repo, ref, path])

      if (_.isNil(ret)) {
        ret = atob(
          (
            await octokit.repos.getContent({
              owner,
              repo,
              ref,
              path
            })
          ).data.content
        )

        _.set(this.content, [owner, repo, ref, path], ret)
      }

      return ret
    },
    async fetchRepo({ owner, repo }) {
      let ret = _.get(this.repos, [owner, repo])

      if (_.isNil(ret)) {
        ret = (await octokit.repos.get({ owner, repo })).data

        _.set(this.repos, [owner, repo], ret)
      }

      return ret
    },
    async fetchRef({ owner, repo, ref }) {
      let ret = _.get(this.refs, [owner, repo, ref])

      if (_.isNil(ret)) {
        ret = (
          await octokit.git.getRef({
            owner,
            repo,
            ref
          })
        ).data

        _.set(this.refs, [owner, repo, ref], ret)
      }

      return ret
    },
    async fetchEmojis() {
      // Get all the emojis available to use on GitHub.
      const res = await octokit.emojis.get()
      /*
       * {
       *   ...
       *   "heart": "https://...",
       *   ...
       *   "tada": "https://...",
       *   ...
       * }
       */
      return res.data
    },
    async fetch(url) {
      let [owner, repo, treeOrBlob, ref, ...path] = url.pathname.substring(1).split('/')

      let theRepo = await this.fetchRepo({ owner, repo })

      if (!ref) {
        ref = theRepo.default_branch
      }

      return this.fetchContent({ owner, repo, ref, path: '/' + path.join('/') })
    }
  }
})
