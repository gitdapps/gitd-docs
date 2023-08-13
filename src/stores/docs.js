import { Marked } from 'marked'
import { baseUrl } from 'marked-base-url'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

import DOMPurify from 'dompurify'
import { defineStore } from 'pinia'

import { useGithubStore } from '@/stores/github.js'
import { emoijs } from '@/markdown/emojis.js'
import { headings } from '@/markdown/headings.js'
import { comments } from '@/markdown/comments.js'
import { exclamation } from '@/markdown/exclamation.js'

export class Doc {
  constructor({ url, markdown, emojis }) {
    this.url = url
    this.markdown = markdown
    this.headings = []
    this.comments = []
    this.marked = new Marked(
      {
        mangle: false,
        headerIds: false,
        renderer: {
          emoji(emoji) {
            console.log('emoji', emoji)
          }
        }
      },
      baseUrl(url.toString()),
      headings({ headings: this.headings }),
      comments({ comments: this.comments }),
      emoijs({ emojis }),
      exclamation(),
      markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code, lang) {
          const language = hljs.getLanguage(lang) ? lang : 'plaintext'
          return hljs.highlight(code, { language }).value
        }
      })
    )

    this.html = DOMPurify.sanitize(this.marked.parse(this.markdown))
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

      let theRepo = await githubStore.fetchRepo({ owner, repo }),
        emojis = await githubStore.fetchEmojis()

      if (!ref) {
        ref = theRepo.default_branch
      }

      let markdown = await githubStore.fetchContent({
          owner,
          repo,
          ref,
          path: '/' + path.join('/')
        }),
        doc = new Doc({ url, markdown, emojis })

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
