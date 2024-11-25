import { LitElement, css, html } from "lit";
import { Task, initialState } from "@lit/task";
import { fetchPagesContentAsText } from "../github.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { MdDoc } from "../md-doc.js";

export class DocView extends LitElement {
  static properties = {
    _contentPath: { state: true },
  };

  _docFetchTask = new Task(this, {
    task: async ([contentPath], { signal }) => {
      if (contentPath === undefined || contentPath === "") {
        // This puts the task back into the INITIAL state
        return initialState;
      }

      return new MdDoc(
        contentPath,
        await fetchPagesContentAsText(contentPath, signal),
      );
    },
    args: () => [this._contentPath],
  });

  render() {
    return html`
      <label>
        Enter a repo path:
        <input .value=${this._contentPath} @change=${this._onChange} />
      </label>
      <header>
        <h1>${this._contentPath}</h1>
      </header>
      <div>
        ${this._docFetchTask.render({
          initial: () =>
            html`<span class="initial">
              Enter a repo path to display its content
            </span>`,
          pending: () =>
            html`Loading content for <code>${this._contentPath}</code>`,
          /**
           *
           * @param {MdDoc} mdDoc - the markdown document to render
           *
           * @returns {TemplateResult}
           */
          complete: (mdDoc) => html`
            ${unsafeHTML(mdDoc.html)}
            <ul>
              ${mdDoc.headings.map(
                (heading) => html`<li>${heading.text}</li>`,
              )}
            </ul>
          `,
          error: (e) => html`<span class="error"> Error: ${e.message} </span>`,
        })}
      </div>
    `;
  }

  _onChange(e) {
    this._contentPath = e.target.value;
  }

  static styles = css`
    :host {
      display: block;
      min-width: 300px;
      border-radius: 5px;
      border: solid 1px #aaa;
      padding: 20px;
    }
    header {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
    #logo {
      height: 38px;
      width: auto;
    }
    .initial {
      font-style: italic;
    }
    .error {
      color: red;
    }
  `;

  constructor() {
    super();
    this._contentPath = "README.md";
  }
}

customElements.define("doc-view", DocView);
