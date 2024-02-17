import gsap from 'gsap';
import { html } from '../../utils/html';
import { EVENTS } from '../../constants/events';

export class ChestInfoModal extends HTMLElement {
  private state: {
    selectedChest: any;
  };
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      selectedChest: null,
    };
  }

  set selectedChest(chest: any) {
    this.state.selectedChest = chest;
    this.render();
  }

  get selectedChest(): any {
    return this.state.selectedChest;
  }

  connectedCallback(): void {
    this.render();
    this.attachEventListeners();
  }

  attachEventListeners(): void {
    document.addEventListener(EVENTS.CHEST_SELECTED, (event: any) => {
      this.selectedChest = event.detail.selectedChest;
    });
  }

  render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = html`
      <style>
        .info-modal {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .info-modal__container {
          padding: 20px;
          background-color: #fff;
          width: 350px;
          min-height: 550px;
          border-radius: 24px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
      </style>
      <div class="info-modal">
        <div class="info-modal__container">
          <img src="assets/chest.png" alt="Chest" />
        </div>
      </div>
    `;
  }
}

customElements.define('chest-info-modal', ChestInfoModal);
