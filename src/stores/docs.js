// import _ from 'lodash'
import { Marked } from 'marked'
import { baseUrl } from 'marked-base-url'
import { markedEmoji } from 'marked-emoji'

import DOMPurify from 'dompurify'
import { defineStore } from 'pinia'

import { useGithubStore } from '@/stores/github.js'

import GithubSlugger from 'github-slugger'

function headings({ idPrefix = '', headings = [] } = {}) {
  let slugger,
    span = document.createElement('span'),
    generateText = (html) => {
      span.innerHTML = html
      return span.textContent || span.innerText || ''
    },
    generateId = (text) =>
      `${idPrefix}${slugger.slug(
        text
          .toLowerCase()
          .trim()
          .replace(/<[!\/a-z].*?>/gi, '')
      )}`

  return {
    hooks: {
      preprocess(src) {
        slugger = new GithubSlugger()

        return src
      }
    },
    renderer: {
      heading(html, level) {
        let heading = {
          text: generateText(DOMPurify.sanitize(html)),
          level
        }

        heading.id = generateId(heading.text)

        headings.push(heading)

        return `<h${heading.level} id="${heading.id}">${html}</h${heading.level}>\n`
      }
    }
  }
}

function comments({ comments = [] } = {}) {
  let inComments = false,
    commentDepth = 0

  return {
    hooks: {
      preprocess(src) {
        inComments = false
        return src
      }
    },
    walkTokens: (token) => {
      // enter and exit comments section
      if (token.type === 'heading') {
        if (token.text.toLowerCase() === 'comments') {
          inComments = true
          commentDepth = token.depth
        } else if (token.depth <= commentDepth) {
          inComments = false
        }
      }

      token.comment = inComments

      if (inComments) {
        comments.push(structuredClone(token))
        token.type = 'space'
      }
    }
  }
}

export class Doc {
  constructor({ url, markdown, emojis }) {
    this.url = url
    this.markdown = markdown
    this.headings = []
    this.comments = []
    this.marked = new Marked(
      {
        mangle: false,
        headerIds: false
      },
      baseUrl(url.toString()),
      headings({ headings: this.headings }),
      comments({ comments: this.comments }),
      markedEmoji({ emojis, unicode: false })
    )

    // this.html = this.marked.parse(this.markdown)
    this.html = DOMPurify.sanitize(this.marked.parse(this.markdown))
    console.log(DOMPurify.removed)
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
