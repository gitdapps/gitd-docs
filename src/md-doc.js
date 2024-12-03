import { Marked } from "marked";
import markedAlert from "marked-alert";
import markedFootnote from "marked-footnote";
import { gfmHeadingId } from "marked-gfm-heading-id";
import { markedEmoji } from "marked-emoji";
import { markedHighlight } from "marked-highlight";
import hljs from "@highlightjs/cdn-assets/es/highlight.js";
import { Octokit } from "@octokit/rest";

import GithubSlugger from "github-slugger";

const slugger = new GithubSlugger();
const span = document.createElement("span");
const octokit = new Octokit();
const res = await octokit.rest.emojis.get();
const emojis = res.data;

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
      .replace(/<[!/a-z].*?>/gi, ""),
  )}`;
}

/**
 * A class representing a markdown document's contents.
 */
export class MdDoc {
  #marked = new Marked()
    .use({
      walkTokens: (token) => {
        if (token.type === "paragraph") {
          if (token.tokens.length === 1 && token.tokens[0].type === "image") {
            token.tokens[0].type = "gd-image";
          }
        } else if (token.type === "heading") {
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
        } else if (token.type === "alert") {
          token.type = "sl-alert";

          // sl-alert variants = primary, success, neutral, warning, danger
          // gfm variants = note, tip, important, warning, caution

          switch (token.meta.variant) {
            case "note":
              token.meta.variant = "neutral";
              token.meta.icon = "info-circle";
              break;
            case "tip":
              token.meta.variant = "success";
              token.meta.icon = "lightbulb";
              break;
            case "important":
              token.meta.variant = "primary";
              token.meta.icon = "exclamation-square";
              break;
            case "warning":
              token.meta.variant = "warning"; // unchanged
              token.meta.icon = "exclamation-triangle";
              break;
            case "caution":
              token.meta.variant = "danger";
              token.meta.icon = "exclamation-octagon";
              break;
          }
        } else if (token.type === "blockquote") {
          token.type = "gd-blockquote";
        } else if (token.type === "table") {
          token.type = "gd-table";
        } else if (token.type === "code") {
          token.type = "gd-code";
        }
      },
      extensions: [
        {
          name: "sl-alert",
          level: "block",
          renderer({ meta, tokens = [] }) {
            return `
              <sl-alert variant="${meta.variant}" open>
                <sl-icon slot="icon" name="${meta.icon}"></sl-icon>
                <strong style="color: var(--sl-color-${meta.variant}-700)">${meta.title}</strong><br />
                ${this.parser.parse(tokens)}
              </sl-alert>
            `;
          },
        },
        {
          name: "gd-blockquote",
          level: "block",
          renderer(token) {
            return `
            <sl-card>${this.parser.renderer.blockquote(token)}</sl-card>`;
          },
        },
        {
          name: "gd-table",
          level: "block",
          renderer(token) {
            return `<gd-featureful-content>${this.parser.renderer.table(token)}</gd-featureful-content>`;
          },
        },
        {
          name: "gd-code",
          level: "block",
          renderer(token) {
            return `<gd-featureful-content title="${token.lang}" full-width="true">${this.parser.renderer.code(token)}</gd-featureful-content>`;
          },
        },
        {
          name: "gd-image",
          level: "block",
          renderer(token) {
            return `<gd-featureful-content>${this.parser.renderer.image(token)}</gd-featureful-content>`;
          },
        },
      ],
    })
    .use(
      markedEmoji({
        emojis,
        renderer: (token) =>
          `<img class="emoji" title=":${token.name}:" alt=":${token.name}:" src="${token.emoji}" height="20" width="20" align="absmiddle">`,
      }),
    )
    .use(
      markedHighlight({
        emptyLangClass: "hljs",
        langPrefix: "hljs language-",
        highlight(code, lang) {
          const language = hljs.getLanguage(lang) ? lang : "plaintext";
          return hljs.highlight(code, { language }).value;
        },
      }),
    )
    .use(markedAlert())
    .use(markedFootnote())
    .use(gfmHeadingId());
  // .use(
  //   (function () {
  //     let id = 0;

  //     return {
  //       renderer: {
  //         code(token) {
  //           id++;

  //           return `
  //           <div class="codeblock">
  //             <pre>
  //               <code id="code-${id}" class="hljs ${token.lang}">${token.text}</code>
  //             </pre>
  //             <sl-copy-button from="code-${id}"></sl-copy-button>
  //           </div>
  //         `;
  //         },
  //       },
  //     };
  //   })(),
  // );

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
