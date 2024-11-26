import { LitElement, css, html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { MdDoc } from "./md-doc.js";

import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';



export class GdDocArticle extends LitElement {
  static styles = css`
    :host {
      border: solid 1px #ccc;
      border-radius: 0.4em;
      box-shadow: 0 0 5px 0 rgb(0 0 0 / 10%);
      padding: 48px 32px;
      overflow: hidden;
    }

    h1 {
      padding: .3em 0 .8em 0;
      margin-bottom: 1.3em;
      border-bottom: 2px solid grey;
      margin-top: 0;
    }
  `;

  static properties = {
    doc: { type: MdDoc },
  };

  render() {
    return html`${unsafeHTML(this.doc.html)}`;
  }
}

customElements.define("gd-doc-article", GdDocArticle);
