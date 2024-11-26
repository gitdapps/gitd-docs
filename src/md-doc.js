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
        } else if (token.type === 'alert') {
          // console.log(token);
          token.type = 'sl-alert';

          // sl-alert variants = primary, success, neutral, warning, danger
          // gfm variants = note, tip, important, warning, caution

          switch (token.meta.variant) {
            case 'note':
              token.meta.variant = 'neutral';
              token.meta.icon = 'info-circle';
              break;
            case 'tip':
              token.meta.variant = 'success';
              token.meta.icon = 'lightbulb';
              break;
            case 'important':
              token.meta.variant = 'primary';
              token.meta.icon = 'exclamation-square';
              break;
            case 'warning':
              token.meta.variant = 'warning'; // unchanged
              token.meta.icon = 'exclamation-triangle';
              break;
            case 'caution':
              token.meta.variant = 'danger';
              token.meta.icon = 'exclamation-octagon';
              break;
          }


          //   {
          //     "className": "markdown-alert",
          //     "variant": "note",
          //     "icon": "<svg class=\"octicon octicon-info mr-2\" viewBox=\"0 0 16 16\" width=\"16\" height=\"16\" aria-hidden=\"true\"><path d=\"M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z\"></path></svg>",
          //     "title": "Note",
          //     "titleClassName": "markdown-alert-title"
          // }

        }
      },
      extensions: [
        {
          name: 'sl-alert',
          level: 'block',
          renderer({ meta, tokens = [] }) {
            // let tmpl = `<div class="${meta.className} ${meta.className}-${meta.variant}">\n`
            // tmpl += `<p class="${meta.titleClassName}">`
            // tmpl += meta.icon
            // tmpl += meta.title
            // tmpl += '</p>\n'
            // tmpl += this.parser.parse(tokens)
            // tmpl += '</div>\n'

            console.log(meta);

            return `
              <sl-alert variant="${meta.variant}" open>
                <sl-icon slot="icon" name="${meta.icon}"></sl-icon>
                <strong>${meta.title}</strong><br />
                ${this.parser.parse(tokens)}
              </sl-alert>
            `;
          }
        }
      ]
    })
    .use(markedAlert())
    .use(markedFootnote())
    .use(gfmHeadingId());

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
