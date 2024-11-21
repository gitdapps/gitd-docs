import GithubSlugger from "github-slugger";
import DOMPurify from "dompurify";

import { MdDoc } from "./md-doc";

export function mdDom(options = {}) {
  let { idPrefix = "", url = "" } = options,
    slugger = new GithubSlugger(),
    span = document.createElement("span"),
    generateText = (html) => {
      span.innerHTML = html;
      return span.textContent || span.innerText || "";
    },
    generateId = (text) =>
      `${idPrefix}${slugger.slug(
        text
          .toLowerCase()
          .trim()
          .replace(/<[!\/a-z].*?>/gi, ""),
      )}`;

  options.doc = {
    url,
    headings: [],
  };

  return {
    renderer: {
      heading({ tokens, depth }) {
        let heading = {
          text: this.parser.parseInline(tokens),
          level: depth,
        };

        heading.id = generateId(heading.text);

        options.doc.headings.push(heading);

        return `<h${heading.level} id="${heading.id}">${text}</h${heading.level}>\n`;
      },
    },
  };
}
