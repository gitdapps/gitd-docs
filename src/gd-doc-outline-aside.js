import { LitElement, css, html } from "lit";
import { MdDoc } from "./md-doc.js";

export class GdDocOutlineAside extends LitElement {
  static styles = css``;

  static properties = {
    doc: { type: MdDoc },
  };

  render() {
    return html`
      <ol>
        ${this.doc.headings.map(
          (heading) =>
            html`<li><a href="#${heading.id}">${heading.text}</a></li>`,
        )}
      </ol>
    `;
  }
}

customElements.define("gd-doc-outline-aside", GdDocOutlineAside);
