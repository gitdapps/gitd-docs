import GithubSlugger from "github-slugger";
import DOMPurify from "dompurify";

import { MdDoc } from "./md-doc";

export function mdom({ idPrefix = "", cb = () => { } } = {}) {
  let slugger,
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

  return {
    hooks: {
      preprocess(src) {
        slugger = new GithubSlugger();

        return src;
      },
    },
    renderer: {
      heading(html, level) {
        let heading = {
          text: generateText(DOMPurify.sanitize(html)),
          level,
        };

        heading.id = generateId(heading.text);

        headings.push(heading);

        return `<h${heading.level} id="${heading.id}">${html}</h${heading.level}>\n`;
      },
    },
  };
}
