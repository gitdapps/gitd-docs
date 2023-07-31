// import _ from 'lodash'
import { Marked } from 'marked'
import { baseUrl } from 'marked-base-url'
import DOMPurify from 'dompurify'
import { defineStore } from 'pinia'
import { useGithubStore } from '@/stores/github.js'

export class Doc {
  constructor({ url, markdown }) {
    this.url = url
    this.markdown = markdown
    this.headings = []
    this.marked = new Marked(
      {
        mangle: false,
        headerIds: false
      },
      baseUrl(url.toString())
    )
    this.html = DOMPurify.sanitize(this.marked.parse(this.markdown), {
      headerPrefix: 'heading-',
      walkTokens(token) {
        if (token.type === 'heading') {
          headings.push(token)
        }
      }
    })
  }
}

export const useDocsStore = defineStore('docs', {
  state: () => {
    return {}
  },
  actions: {
    async fetch(url) {
      if (this[url]) {
        return this[url]
      }

      const githubStore = useGithubStore() // only suppoting github for now

      let [owner, repo, treeOrBlob, ref, ...path] = url.pathname.substring(1).split('/')

      let theRepo = await githubStore.fetchRepo({ owner, repo })

      if (!ref) {
        ref = theRepo.default_branch
      }

      let markdown = await githubStore.fetchContent({
          owner,
          repo,
          ref,
          path: '/' + path.join('/')
        }),
        doc = new Doc({ url, markdown })

      this[url] = doc

      return doc
    }
    //   async parse({ owner, repo, ref, path, contentBlob }) {
    //     let baseUrl = '',
    //       html,
    //       headings = []

    //     if (path.endsWith('index.md')) {
    //       // we're rendering an index page, so we'll need to specify baseUrl
    //       baseUrl = `${_.nth(path.split('/'), -2)}/`
    //     }

    //     html = DOMPurify.sanitize(
    //       marked.parse(atob(contentBlob), {
    //         baseUrl,
    //         headerPrefix: 'heading-',
    //         walkTokens(token) {
    //           if (token.type === 'heading') {
    //             headings.push(token)
    //           }
    //         }
    //       }),
    //       { ADD_TAGS: ['router-link'], ADD_ATTR: ['to'] }
    //     )

    //     if (!this[owner]) {
    //       this[owner] = {}
    //     }

    //     if (!this[owner][repo]) {
    //       this[owner][repo] = {}
    //     }

    //     if (!this[owner][repo][ref]) {
    //       this[owner][repo][ref] = {}
    //     }

    //     this[owner][repo][ref][path] = { html, headings }
    //   }
  }
})
