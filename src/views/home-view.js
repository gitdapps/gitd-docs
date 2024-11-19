import { LitElement, html } from "lit";

export class HomeView extends LitElement {
  render() {
    return html`HOME VIEW | <a href="/about">About</a>`;
  }
}

customElements.define("home-view", HomeView);
