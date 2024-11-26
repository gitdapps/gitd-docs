import { Marked } from "marked";
import markedAlert from "marked-alert";
import markedFootnote from "marked-footnote";
import { gfmHeadingId } from "marked-gfm-heading-id";

import GithubSlugger from "github-slugger";

const slugger = new GithubSlugger();

const span = document.createElement("span");

function getTextContent(html) {
  span.innerHTML = html;
  return span.textContent || span.innerText || "";
}

/**
 * Generate a url slug from a heading text
 *
 * @param {string} text
 * @param {string} [idPrefix=""]
 */
function generateHeadingId(text, idPrefix = "") {
  return `${idPrefix}${slugger.slug(
    text
      .toLowerCase()
      .trim()
      .replace(/<[!\/a-z].*?>/gi, ""),
  )}`;
}

/**
 * A class representing a markdown document's contents.
 */
export class MdDoc {
  #marked = new Marked()
    .use(markedAlert())
    .use(markedFootnote())
    .use(gfmHeadingId())
    .use({
      walkTokens: (token) => {
        if (token.type === "heading") {
          let text = getTextContent(this.#marked.parseInline(token.text));

          try {
            this.headings.push({
              id: generateHeadingId(text),
              text,
              level: token.depth,
            });
          } catch (e) {
            console.error(e);
          }
        }
      },
    });

  /**
   * Create a new Doc instance.
   *
   * @param {string} url - the url where the document is hosted
   * @param {string} markdown - the markdown content of the document
   */
  constructor(url, markdown) {
    this.url = url;
    this.markdown = markdown;
    this.headings = [];
    this.html = this.#marked.parse(markdown);
  }
}
