import { LitElement, css, html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { MdDoc } from "./md-doc.js";

import "@shoelace-style/shoelace/dist/components/alert/alert.js";
import "@shoelace-style/shoelace/dist/components/icon/icon.js";
import "@shoelace-style/shoelace/dist/components/copy-button/copy-button.js";
import "@shoelace-style/shoelace/dist/components/popup/popup.js";
import "@shoelace-style/shoelace/dist/components/tooltip/tooltip.js";

export class GdDocArticle extends LitElement {
  static styles = css`
    :host {
      border: solid 1px #ccc;
      border-radius: var(--sl-border-radius-large);
      box-shadow: 0 0 5px 0 rgb(0 0 0 / 10%);
      padding: 48px 32px;
      overflow: hidden;
    }

    h1 {
      padding: 0.3em 0 0.8em 0;
      margin-bottom: 1.3em;
      border-bottom: 2px solid grey;
      margin-top: 0;
    }

    sl-alert {
      margin: 1em 0;
    }

    p:has(img:not(.emoji)) {
      text-align: center;
    }

    img:not(.emoji) {
      width: 80%;
    }

    table {
      margin: auto;
      border-collapse: collapse;
    }

    .table-wrapper {
      overflow-x: auto;
      margin: var(--sl-spacing-large) 0;
      position: relative;
    }

    .table-wrapper sl-copy-button {
      position: absolute;
      top: 0;
      right: 0;
      display: none;
    }

    .table-wrapper:hover sl-copy-button {
      display: block;
    }

    table,
    th,
    td {
      border: 1px solid var(--sl-color-neutral-300);
      box-shadow: var(--sl-shadow-small);
    }

    th,
    td {
      padding: var(--sl-spacing-x-small) var(--sl-spacing-medium);
    }

    tbody tr:nth-child(even) {
      background-color: var(--sl-color-neutral-50);
    }

    .codeblock {
      display: flex;
      justify-content: space-between;
      margin: 1em 0;
      background: #f3f3f3;
      border-radius: var(--sl-border-radius-medium);
    }

    .codeblock pre {
      margin: 0;
      display: inline-flex;
    }

    code {
      background: var(--sl-color-neutral-100);
      padding: var(--sl-spacing-2x-small) var(--sl-spacing-x-small);
      border-radius: var(--sl-border-radius-small);
    }

    pre code.hljs {
      display: block;
      overflow-x: auto;
      padding: 1em;
      border-radius: 0;
      border: none;
      background: none;
    }

    code.hljs {
      padding: 3px 5px;
    }

    .hljs {
      color: #444;
    }

    .hljs-comment {
      color: #697070;
    }

    .hljs-punctuation,
    .hljs-tag {
      color: #444a;
    }

    .hljs-tag .hljs-attr,
    .hljs-tag .hljs-name {
      color: #444;
    }

    .hljs-attribute,
    .hljs-doctag,
    .hljs-keyword,
    .hljs-meta .hljs-keyword,
    .hljs-name,
    .hljs-selector-tag {
      font-weight: 700;
    }

    .hljs-deletion,
    .hljs-number,
    .hljs-quote,
    .hljs-selector-class,
    .hljs-selector-id,
    .hljs-string,
    .hljs-template-tag,
    .hljs-type {
      color: #800;
    }

    .hljs-section,
    .hljs-title {
      color: #800;
      font-weight: 700;
    }

    .hljs-link,
    .hljs-operator,
    .hljs-regexp,
    .hljs-selector-attr,
    .hljs-selector-pseudo,
    .hljs-symbol,
    .hljs-template-variable,
    .hljs-variable {
      color: #ab5656;
    }

    .hljs-literal {
      color: #695;
    }

    .hljs-addition,
    .hljs-built_in,
    .hljs-bullet,
    .hljs-code {
      color: #397300;
    }

    .hljs-meta {
      color: #1f7199;
    }

    .hljs-meta .hljs-string {
      color: #38a;
    }

    .hljs-emphasis {
      font-style: italic;
    }

    .hljs-strong {
      font-weight: 700;
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
