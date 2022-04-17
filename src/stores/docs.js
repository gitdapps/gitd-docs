import _ from "lodash";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { defineStore } from "pinia";

export const useDocsStore = defineStore("docs", {
  state: () => {},
  actions: {
    async parse({ owner, repo, ref, path, contentBlob }) {
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

      if (!this[owner]) {
        this[owner] = {};
      }

      if (!this[owner][repo]) {
        this[owner][repo] = {};
      }

      if (!this[owner][repo][ref]) {
        this[owner][repo][ref] = {};
      }

      this[owner][repo][ref][path] = { html, headings };
    },
  },
});
