import { html, LitElement } from "lit";
import { Router } from "@vaadin/router";
import "./views/home-view.js";
import "./views/about-view.js";
import "./views/doc-view.js";

export class GitdApp extends LitElement {
  firstUpdated() {
    super.firstUpdated();

    const router = new Router(this.shadowRoot.querySelector("#outlet"));

    router.setRoutes([
      // { path: "/", component: "home-view" },
      // { path: "/about", component: "about-view" },
      { path: "(.*)", component: "doc-view" },
    ]);
  }

  render() {
    return html`
      <main>
        <div id="outlet"></div>
      </main>
    `;
  }
}

customElements.define("gitd-app", GitdApp);
