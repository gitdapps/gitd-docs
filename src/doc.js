import { Marked } from "marked";
import { baseUrl } from "marked-base-url";
import DOMPurify from "dompurify";
// import { emojis } from "./markdown/emojis.js";
// import { headings } from "./markdown/headings.js";
// import { comments } from "./markdown/comments.js";
// import { markedHighlight } from "marked-highlight";
// import hljs from "highlight.js";

// import { exclamation } from "@/markdown/exclamation.js"

/**
 * A class representing a strctured document.
 */
export class Doc {
  url;

  markdown;

  html;

  headings = [];

  #marked;

  /**
   * Create a new Doc instance.
   *
   * @param {string} url - the url where the document is hosted
   * @param {string} markdown - the markdown content of the document
   */
  constructor(url, markdown) {
    this.url = url;
    this.markdown = markdown;

    const headings = [];

    this.#marked = new Marked(baseUrl(url.toString()), {
      walkTokens(token) {
        switch (token.type) {
          case "heading":
            headings.push({
              text: this.parser(token.tokens),
              level: token.depth,
            });

            break;
        }
      },
    });

    this.headings = headings;

    this.html = DOMPurify.sanitize(this.#marked.parse(this.markdown));
  }
}
