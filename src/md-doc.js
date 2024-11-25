import { Marked } from "marked";
import GithubSlugger from "github-slugger";

const slugger = new GithubSlugger();
const marked = new Marked();
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
  `${idPrefix}${slugger.slug(
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
    this.html = marked.parse(markdown, {
      walkTokens: (token) => {
        if (token.type === "heading") {
          try {
            this.headings.push({
              text: getTextContent(marked.parseInline(token.text)),
              level: token.depth,
            });
          } catch (e) {
            console.error(e);
          }
        }
      },
    });
  }
}
