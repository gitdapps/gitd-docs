import { LitElement, css, html } from "lit";
import { styleMap } from "lit/directives/style-map.js";

import "@shoelace-style/shoelace/dist/components/icon/icon.js";
import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
import "@shoelace-style/shoelace/dist/components/copy-button/copy-button.js";
import "@shoelace-style/shoelace/dist/components/popup/popup.js";
import "@shoelace-style/shoelace/dist/components/tooltip/tooltip.js";
import "@shoelace-style/shoelace/dist/components/dialog/dialog.js";

export class GdFeaturefulContent extends LitElement {
  static styles = css`
    .gd-fc-scroller {
      overflow-x: auto;
      display: inline-block;
      max-width: 100%;
    }

    .gd-fc-container {
      /* top | right | bottom | left */
      margin: 3em 0 1em 0;
      text-align: center;
    }

    .gd-fc-wrapper {
      position: relative;
      display: inline-block;
      max-width: 100%;
    }

    .gd-fc-tools {
      position: absolute;
      top: -2em;
      /* top: calc(-1 * var(--sl-spacing-x-large)); */
      right: 0;
    }

    ::slotted(img) {
      max-width: 100%;
    }
  `;

  static properties = {
    fullWidth: { type: Boolean, attribute: "full-width" },
    _value: { type: String, state: true },
    _copyLabel: { type: String, state: true },
    _expanded: { type: Boolean, state: true },
  };

  #id = `gd-fc-${Math.round(Math.random() * 1000000)}`;

  constructor() {
    super();
    // Declare reactive properties
    this._copyLabel = "Copy";
    this._expanded = false;
  }

  #onSlotchange(e) {
    const childNodes = e.target.assignedNodes({ flatten: true });

    this._value = childNodes
      .map((node) => {
        if (node.tagName === "TABLE") {
          this._copyLabel = "Copy TSV";

          // return a TSV string
          return node.textContent
            .replaceAll("\n\n\n", "\r")
            .replaceAll("\n", "\t")
            .replaceAll("\r", "\n")
            .replaceAll("\n\t", "\n")
            .trim();
        } else if (node.tagName === "PRE") {
          this._copyLabel = "Copy Code";
        } else if (node.tagName === "IMG") {
          this._copyLabel = "Copy URL";
          return node.src;
        }

        return node.textContent ? node.textContent : "";
      })
      .join("");
  }

  // TODO: support copying image data to clipboard
  // async #copyImgToClipboard(imgUrl) {
  //   try {
  //     const data = await fetch(imgUrl);
  //     const blob = await data.blob();
  //     await navigator.clipboard.write([
  //       new ClipboardItem({
  //         [blob.type]: blob,
  //       }),
  //     ]);
  //     console.log('Image copied.');
  //   } catch (err) {
  //     console.error(err.name, err.message);
  //   }
  // }

  #onExpand() {
    this.shadowRoot.querySelector("sl-dialog").show();
    const slot = this.shadowRoot.querySelector("slot");
    const dialog = this.shadowRoot.querySelector("sl-dialog");
    this._expanded = true;
    dialog.appendChild(slot);
  }

  #onShrink() {
    const slot = this.shadowRoot.querySelector("slot");
    const scroller = this.shadowRoot.querySelector(".gd-fc-scroller");
    this._expanded = false;
    scroller.appendChild(slot);
  }

  render() {
    const containerStyle = {
        visibility: this._expanded ? "hidden" : "visible",
      },
      fwStyle = {
        width: this.fullWidth ? "100%" : "",
      };

    return html`
      <sl-dialog @sl-hide="${this.#onShrink}" style="--width: 96vw;">
      </sl-dialog>

      <div
        id="${this.#id}"
        class="gd-fc-container"
        style=${styleMap(containerStyle)}
      >
        <div class="gd-fc-wrapper" style=${styleMap(fwStyle)}>
          <div class="gd-fc-tools">
            <sl-tooltip content="Expand View">
              <sl-icon-button
                @click=${this.#onExpand}
                name="arrows-angle-expand"
                label="Expand View"
              ></sl-icon-button>
            </sl-tooltip>
            <sl-copy-button
              copy-label="${this._copyLabel}"
              .value="${this._value}"
            ></sl-copy-button>
          </div>
          <div class="gd-fc-scroller" style=${styleMap(fwStyle)}>
            <slot @slotchange=${this.#onSlotchange}></slot>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("gd-featureful-content", GdFeaturefulContent);
