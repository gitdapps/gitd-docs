export function comments({ comments = [] } = {}) {
  let inComments = false,
    commentDepth = 0;

  return {
    hooks: {
      preprocess(src) {
        inComments = false;
        return src;
      },
    },
    walkTokens: (token) => {
      // enter and exit comments section
      if (token.type === "heading") {
        if (token.text.toLowerCase() === "comments") {
          inComments = true;
          commentDepth = token.depth;
        } else if (token.depth <= commentDepth) {
          inComments = false;
        }
      }

      token.comment = inComments;

      if (inComments) {
        comments.push(structuredClone(token));
        token.type = "space";
      }
    },
  };
}
