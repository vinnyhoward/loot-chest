import gsap from 'gsap';
import { html } from '../../utils/html';

export class ChestInfoModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback(): void {
    this.render();
    this.attachEventListeners();
  }

  attachEventListeners(): void {}

  render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = html`
      <style></style>
      <div class="info-modal"></div>
    `;
  }
}

customElements.define('chest-info-modal', ChestInfoModal);
