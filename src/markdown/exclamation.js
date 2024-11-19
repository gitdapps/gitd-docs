const variants = [
    // level 1 (red)
    "bug",
    "danger",
    "error",
    "failure",

    // level 2 (amber)
    "warning",
    "caution",
    "attention",

    // level 4 (blue)
    "info",
    "example",
    "hint",
    "note",
    "abstract",

    // level 5 (green)
    "success",
    "tip",
    "question",
  ],
  defaultOptions = { className: "exclamation" },
  // variantRule =   new RegExp(`^!!!\\s+(${variants.join('|')})(?:\\s+)?(.*)$`),
  rule = /^( {0,3}! ?(paragraph|[^\n]*)(?:\n|$))+/;

/**
 * Marked extension that adds support for "exclamations", examples:
 *
 * Input markdown:
 *
 * ! :warning: Bad things might happen if you do this.
 * !
 * ! Just so you know.
 *
 * Output html:
 *
 * <div class="exclamation">
 *  <p>
 *    <img src="https://github.githubassets.com/images/icons/emoji/unicode/26a0.png?v8" alt="warning" class="emoji">
 *    <strong>Bad things might happen if you do this.</strong>
 *  </p>
 *  <p>Just so you know.</p>
 * </div>
 *
 * @param {*} options - optionally pass in a className to use for the div
 * @returns {Object} The marked extension to be passed into marked.use(), etc.
 */
export function exclamation(options = {}) {
  options = {
    ...defaultOptions,
    ...options,
  };

  return {
    extensions: [
      {
        name: "exclamation",
        level: "block",
        start(src) {
          return src.match(/![^!\n]/)?.index;
        },
        tokenizer(src) {
          const cap = rule.exec(src);

          if (cap) {
            const text = cap[0].replace(/^ *![ \t]?/gm, ""),
              top = this.lexer.state.top;

            this.lexer.state.top = true;

            const tokens = this.lexer.blockTokens(text);

            this.lexer.state.top = top;

            return {
              type: "exclamation",
              raw: cap[0],
              tokens,
              text,
            };
          }
        },
        renderer({ tokens }) {
          return `<div class="${options.className}">${this.parser.parse(tokens)}</div>`;
        },
      },
    ],
  };
}
