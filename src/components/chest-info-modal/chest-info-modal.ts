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
    this.attachListeners();
    this.attachEventListeners();
  }

  get selectedChest(): any {
    return this.state.selectedChest;
  }

  connectedCallback(): void {
    this.render();
    this.attachEventListeners();
  }

  private attachListeners(): void {
    if (!this.shadowRoot) return;

    const closeIcon = this.shadowRoot.querySelector(
      '.close__icon',
    ) as HTMLElement;
    closeIcon.addEventListener('click', () => {
      this.hide();
    });

    const seeMore = this.shadowRoot.querySelector('.see-more') as HTMLElement;
    seeMore.addEventListener('click', () => {
      console.log('see more clicked');
    });
  }

  private attachEventListeners(): void {
    if (!this.shadowRoot) return;

    document.addEventListener(EVENTS.CHEST_SELECTED, (event: any) => {
      this.selectedChest = event.detail.selectedChest;
      this.state.loading = false;

      this.render();
      this.attachEventListeners();
      this.attachListeners();
    });
  }

  public show() {
    if (!this.shadowRoot) return;
    gsap.to(this, { duration: 0.5, opacity: 1, display: 'block' });
  }

  public hide() {
    console.log('hiding');
    if (!this.shadowRoot) return;
    gsap.to(this, { duration: 0.5, opacity: 0, display: 'none' });
  }

  public render() {
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
          height: 140px;
          width: 100%;
        }

        .info-modal__header {
          display: flex;
          flex-direction: column;
          margin-bottom: 20px;
        }

        .close-icon__container {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: flex-end;
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
          padding: 20px;
        }

        .close__icon {
          width: 20px;
          height: 20px;
          padding: 20px;
          z-index: 1000;
          cursor: pointer;
        }

        .chest__description {
          font-size: 0.9rem;
          color: #707c88;
          font-family: 'Hind', sans-serif;
          text-align: left;
        }

        .see-more {
          color: #2893ff;
          font-size: 0.9rem;
          cursor: pointer;
          font-weight: 600;
        }
      </style>
      <div class="info-modal">
        <div class="info-modal__container">
          <div class="close-icon__container">
            <img
              class="close__icon"
              src="icons/svg/close.svg"
              alt="close icon"
            />
          </div>
          ${this.state.loading
            ? html`<div>Loading...</div>`
            : html`
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
                  <div class="chest__placeholder"></div>
                  <div class="chest__header-text">
                    <span class="chest__title"
                      >${this.state.selectedChest.chestName}</span
                    >
                    <p class="chest__description">
                      ${this.state.selectedChest.chestDescription}
                      <span class="see-more">See more</span>
                    </p>
                  </div>
                </div>
              `}
          <div class="line"></div>
        </div>
      </div>
    `;
  }
}

customElements.define('chest-info-modal', ChestInfoModal);
