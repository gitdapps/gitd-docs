import { LitElement, css, html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { MdDoc } from "./md-doc.js";

export class GdDocArticle extends LitElement {
  static styles = css``;

  static properties = {
    doc: { type: MdDoc },
  };

  render() {
    return html`${unsafeHTML(this.doc.html)}`;
  }
}

customElements.define("gd-doc-article", GdDocArticle);
