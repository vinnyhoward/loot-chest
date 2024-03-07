import gsap from 'gsap';
import { html } from '../../utils/html';
import { urlFor } from '../../services/sanity';
import { EVENTS } from '../../constants/events';

export class FailureModal extends HTMLElement {
  private state: {
    selectedChest: any;
    loading: boolean;
    errorTitle: string;
    errorDescription: string;
  };
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      selectedChest: null,
      loading: true,
      errorTitle: '',
      errorDescription: '',
    };
  }

  set selectedChest(chest: any) {
    this.state.selectedChest = chest;
    this.state.loading = false;
    this.render();
    this.attachListeners();
    this.updateDescription();
    this.updateTitle();
    gsap.to(this, { duration: 0, opacity: 0, display: 'none' });
  }

  get selectedChest(): any {
    return this.state.selectedChest;
  }

  connectedCallback(): void {
    this.render();
    this.attachListeners();
    gsap.to(this, { duration: 0, opacity: 0, display: 'none' });
  }

  disconnectedCallback(): void {
    this.removeEventListener(EVENTS.CHEST_SELECTED, () => {});
    this.removeEventListener(EVENTS.SHOW_FAILURE_MODAL, () => {});
    this.removeEventListener(EVENTS.HIDE_FAILURE_MODAL, () => {});
  }

  private attachListeners(): void {
    if (!this.shadowRoot) return;
    const closeIcon = this.shadowRoot.querySelector(
      '.close__icon',
    ) as HTMLElement;
    const closeButton = this.shadowRoot.querySelector('.btn') as HTMLElement;

    closeButton.addEventListener('click', () => {
      this.hide();
    });

    closeIcon.addEventListener('click', () => {
      this.hide();
    });

    document.addEventListener(EVENTS.CHEST_SELECTED, (event: any) => {
      this.state.selectedChest = event.detail.selectedChest;
      this.state.loading = false;

      this.render();
      this.updateContent();
    });

    document.addEventListener(EVENTS.SHOW_FAILURE_MODAL, (event: any) => {
      this.state.errorTitle = event.detail.errorTitle;
      this.state.errorDescription = event.detail.errorDescription;
      this.show();
      this.updateContent();
    });

    document.addEventListener(EVENTS.HIDE_FAILURE_MODAL, () => {
      this.hide();
      this.state.errorTitle = '';
      this.state.errorDescription = '';
    });
  }

  public show() {
    if (!this.shadowRoot) return;
    gsap.to(this, { duration: 0.5, opacity: 1, display: 'block' });
  }

  public hide() {
    if (!this.shadowRoot) return;
    gsap.to(this, { duration: 0.5, opacity: 0, display: 'none' });
  }

  private updateDescription() {
    if (!this.shadowRoot) return;
    const errorDescription = this.shadowRoot.querySelector(
      '.chest-error__description',
    ) as HTMLElement;
    errorDescription.textContent = this.state.errorDescription;
  }

  private updateTitle() {
    if (!this.shadowRoot) return;
    const errorTitle = this.shadowRoot.querySelector(
      '.error__title',
    ) as HTMLElement;
    errorTitle.textContent = this.state.errorTitle;
  }

  public updateContent(): void {
    this.updateDescription();
    this.updateTitle();
  }

  public render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = html`
      <style>
        {
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Hind:wght@300;400;500;600;700&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;

          --main_color: #8847ff;

          --common: #588cbf;
          --uncommon: #4664d6;
          --rare: #7a5bf0;
          --legendary: #be47d0;
          --divine: #db9f45;


          --bg-common: #5e98d9;
          --bg-uncommon: #4b69ff;
          --bg-rare: #8847ff;
          --bg-legendary: #d32ee6;
          --bg-divine: #f8ae39;

          --font1: 'Montserrat', sans-serif;
          --font2: 'Hind', sans-serif;
        }

        .error-modal {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1000;
        }

        .error-modal__container {
          position: relative;
          background-color: #fff;
          width: 375px;
          max-height: 600px;
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
          top: 5%;
          left: 60%;
          transform: translate(-50%, -50%);
        }

        .chest__placeholder {
          height: 100px;
          width: 100%;
        }

        .error-modal__header {
          display: flex;
          flex-direction: column;
        }

        .close-icon__container {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: flex-end;
        }

        .error__title {
          font-size: 1.3rem;
          font-weight: 900;
          color: #25314c;
          font-family: var(--font1);
          text-transform: uppercase;
          text-align: center;
        }

        .chest__header-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0px 20px;
        }

        .close__icon {
          width: 60px;
          height: 60px;
          padding: 20px;
          z-index: 1000;
          cursor: pointer;
        }

        .chest-error__description {
          font-size: 1rem;
          color: #707c88;
          font-family: var(--font2);
          text-align: center;
          height: 50px;
          margin: 10px 0px 10px 0px;
        }

        .btn__container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px 20px 20px 20px;
        }

        button {
          width: 100%;
          height: 50px;
          border: none;
          border-radius: 8px;
          background-color: #974af4;
          color: white;
          font-family: var(--font1);
          font-weight: 600;
          font-style: normal;
          font-size: 14px;
          cursor: pointer;
          text-transform: uppercase;
        }
      </style>
      <div class="error-modal">
        <div class="error-modal__container">
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
                <div class="error-modal__header">
                  <img
                    class="chest__image"
                    src="${urlFor(
                      this.state.selectedChest.chestImage.asset._ref,
                    )
                      .width(280)
                      .height(280)
                      .url()}"
                    alt="Chest"
                  />
                  <div class="chest__placeholder"></div>
                  <div class="chest__header-text">
                    <span class="error__title"></span>
                    <p class="chest-error__description"></p>
                  </div>
                </div>
              `}
          <div class="line"></div>

          <div class="btn__container">
            <button class="btn">CLOSE</button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('failure-modal', FailureModal);
