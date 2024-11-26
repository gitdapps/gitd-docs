import { LitElement, css, html } from "lit";
import { Task, initialState } from "@lit/task";

import { fetchPagesContentAsText } from "./github.js";
import { MdDoc } from "./md-doc.js";
import "./gd-doc-article.js";
import "./gd-doc-outline-aside.js";

export class GdDocView extends LitElement {
  static styles = css`
    :host {
      display: flex;
      justify-content: center;
    }

    .initial {
      font-style: italic;
    }

    .error {
      color: red;
    }

    gd-doc-article {
      flex: none;
      width: 50em;
      border: solid 1px #ccc;
      border-radius: 0.4em;
      box-shadow: 0 0 5px 0 rgb(0 0 0 / 10%);
    }
  `;

  static properties = {
    path: { type: String },
  };

  #docFetchTask = new Task(this, {
    task: async ([path], { signal }) => {
      if (path === undefined || path === "") {
        // This puts the task back into the INITIAL state
        return initialState;
      }

      return new MdDoc(
        path,
        await fetchPagesContentAsText(`/${path}.md`, signal),
      );
    },
    args: () => [this.path],
  });

  render() {
    return html`
      ${this.#docFetchTask.render({
      initial: () => html`<span class="initial">loading...</span>`,
      pending: () => html`Loading content for <code>${this.path}</code>`,
      complete: (mdDoc) => html`
          <gd-doc-article .doc=${mdDoc}></gd-doc-article>
          <gd-doc-outline-aside .doc=${mdDoc}></gd-doc-outline-aside>
        `,
      error: (e) => html`<span class="error"> Error: ${e.message} </span>`,
    })}
    `;
  }
}

customElements.define("gd-doc-view", GdDocView);
