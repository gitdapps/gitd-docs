/**
 * A class representing a markdown document's contents.
 */
export class MdDoc {
  url;

  markdown;

  html;

  /**
   * Create a new Doc instance.
   *
   * @param {string} url - the url where the document is hosted
   * @param {string} markdown - the markdown content of the document
   */
  constructor(url, markdown) {
    this.url = url;
    this.markdown = markdown;
  }
}
