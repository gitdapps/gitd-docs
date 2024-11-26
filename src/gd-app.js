import { html, css, LitElement } from "lit";
import { ifDefined } from 'lit/directives/if-defined.js';
import { Router } from "@lit-labs/router";

import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
setBasePath('/node_modules/@shoelace-style/shoelace/dist');

import "./gd-doc-view.js";

export class GdApp extends LitElement {
  static styles = css`
    :host {
      font-family: sans-serif;
    }
  `;

  static properties = {
    home: { type: String },
  };

  #router = new Router(this, [
    {
      path: "/:path+",
      pattern: new URLPattern({ pathname: '/:path+' }),
      render: ({ path }) => {
        return html`<gd-doc-view path="${ifDefined(path)}"></gd-doc-view>`;
      },
    },
    {
      path: "*", // redirect anything else to /<home>
      enter: () => {
        location.pathname = `/${this.home ?? 'README'}`;
        // this.#router.goto(`/${this.home ?? 'README'}`);
        return false;
      }
    }
  ]);

  render() {
    return html`
      ${this.#router.outlet()}
    `;
  }
}

customElements.define("gd-app", GdApp);
