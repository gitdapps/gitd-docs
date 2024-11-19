import GithubSlugger from "github-slugger";
import DOMPurify from "dompurify";

export function headings({ idPrefix = "", headings = [] } = {}) {
  let slugger,
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
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens),
          escapedText = text.toLowerCase().replace(/[^\w]+/g, "-");

        return `
                <h${depth}>
                  <a name="${escapedText}" class="anchor" href="#${escapedText}">
                    <span class="header-link"></span>
                  </a>
                  ${text}
                </h${depth}>`;
      },
      heading({ text, depth }) {
        let heading = {
          id: generateId(text),
          text,
          level: depth,
        };

        headings.push(heading);

        return `<h${heading.level} id="${heading.id}">${text}</h${heading.level}>\n`;
      },
    },
  };
}
