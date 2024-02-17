import gsap from 'gsap';
import { html } from '../../utils/html';
import { urlFor } from '../../services/sanity';
import { EVENTS } from '../../constants/events';

export class ChestInfoModal extends HTMLElement {
  private state: {
    selectedChest: any;
    loading: boolean;
  };
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      selectedChest: null,
      loading: true,
    };
  }

  set selectedChest(chest: any) {
    this.state.selectedChest = chest;
    this.state.loading = false;
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
      this.state.loading = false;

      this.render();
      this.attachEventListeners();
      console.log('selected chest: ', this.state.selectedChest);
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
          position: relative;
          background-color: #fff;
          width: 350px;
          min-height: 550px;
          border-radius: 24px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .line {
          width: 100%;
          height: 2px;
          background-color: #f0f0f0;
        }

        .chest__image {
          position: absolute;
          top: 10%;
          left: 60%;
          transform: translate(-50%, -50%);
        }

        .chest__placeholder {
          height: 180px;
          width: 100%;
        }

        .info-modal__header {
          display: flex;
          flex-direction: column;
          /* align-items: flex-end; */
          /* justify-content: flex-end; */
          padding: 20px;
        }

        .chest__title {
          font-size: 1.3rem;
          font-weight: 900;
          color: #25314c;
          font-family: 'Montserrat', sans-serif;
          text-transform: uppercase;
          text-align: center;
        }

        .chest__header-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .close__icon {
          width: 20px;
          height: 20px;
        }
      </style>
      <div class="info-modal">
        ${this.state.loading
          ? html`<loading-bar></loading-bar>`
          : html`
              <div class="info-modal__container">
                <div class="info-modal__header">
                  <img
                    class="chest__image"
                    src="${urlFor(
                      this.state.selectedChest.chestImage.asset._ref,
                    )
                      .width(300)
                      .height(300)
                      .url()}"
                    alt="Chest"
                  />
                  <img
                    class="close__icon"
                    src="icons/svg/close.svg"
                    alt="close icon"
                  />
                  <div class="chest__placeholder"></div>
                  <div class="chest__header-text">
                    <span class="chest__title"
                      >${this.state.selectedChest.chestName}</span
                    >
                  </div>
                </div>
                <div class="line"></div>
              </div>
            `}
      </div>
    `;
  }
}

customElements.define('chest-info-modal', ChestInfoModal);
