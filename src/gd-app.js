import { html, LitElement } from "lit";
import { Router } from "@lit-labs/router";

import "/src/gd-doc-view.js";

export class GdApp extends LitElement {
  #router = new Router(this, [
    {
      path: "/:path+",
      render: ({ path = "README" }) => {
        return html`<gd-doc-view path="${path}"></gd-doc-view>`;
      },
    },
  ]);

  render() {
    return html`
      <div>this is a test</div>
      ${this.#router.outlet()}
    `;
  }
}

customElements.define("gd-app", GdApp);
