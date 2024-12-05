import { LitElement, css, html } from "lit";
import { MdDoc } from "./md-doc.js";
import "@shoelace-style/shoelace/dist/components/icon/icon.js";

export class GdDocOutlineAside extends LitElement {
  static styles = css`
    :host {
      position: sticky;
      top: 10px;
    }

    a {
      text-decoration: none;
      color: var(--sl-color-primary-800);
      cursor: pointer;
    }

    ol {
      list-style-type: none;
      padding: 1em;
    }

    li {
      padding: 0.5em;
    }

    li[data-level="1"] {
      font-weight: bold;
    }

    li[data-level="2"] {
      padding-left: 2em;
    }

    li[data-level="3"] {
      padding-left: 3em;
    }

    li[data-level="4"] {
      padding-left: 4em;
    }

    li[data-level="5"] {
      padding-left: 5em;
    }

    li[data-level="6"] {
      padding-left: 6em;
    }
  `;

  static properties = {
    doc: { type: MdDoc },
  };

  render() {
    if (this.doc.headings.length > 1) {
      return html`
        <ol>
          ${this.doc.headings.map(
            (heading, i) =>
              html`<li data-level="${heading.level}">
                ${i == 0 ? html`<sl-icon name="list-ul"></sl-icon>` : ""}
                <a href="#${heading.id}">${heading.text}</a>
              </li>`,
          )}
        </ol>
      `;
    }
  }
}

customElements.define("gd-doc-outline-aside", GdDocOutlineAside);
