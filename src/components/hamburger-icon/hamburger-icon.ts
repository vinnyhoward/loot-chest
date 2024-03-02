import gsap from 'gsap';
import { EVENTS } from '../../constants/events';
import { html } from '../../utils/html';
import { urlFor } from '../../services/sanity';

export class HamburgerIcon extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  attachEventListeners() {}

  public show(): void {
    if (!this.shadowRoot) return;
  }

  public hide(): void {
    if (!this.shadowRoot) return;
  }

  public render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = html`
      <style>
        .hamburger {
          position: fixed;
          bottom: 160px;
          width: 100%;
          height: 180px;
          overflow: hidden;
        }
      </style>
      <div class="hamburger"></div>
    `;
  }
}

customElements.define('hamburger-icon', HamburgerIcon);
