import gsap from 'gsap';
import { html } from '../../utils/html';
import { EVENTS } from '../../constants/events';

declare global {
  interface Window {
    experience: any;
  }
}

export class ChestInfoButton extends HTMLElement {
  private _points: any[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._points = [];
  }

  connectedCallback(): void {
    this.render();
    this.attachEventListeners();
  }

  disconnectedCallback(): void {
    this.removeEventListener('click', this.showChestInfo);
    this.removeEventListener(EVENTS.CHEST_POINTS_UPDATED, () => {});
    this.removeEventListener(EVENTS.CHEST_SELECTED, () => {});
    this.removeEventListener(EVENTS.HIDE_UI, () => {});
    this.removeEventListener(EVENTS.SHOW_UI, () => {});
  }

  attachEventListeners(): void {
    if (!this.shadowRoot) return;

    const button = this.shadowRoot.querySelector('.chest-info') as HTMLElement;
    if (button) {
      button.addEventListener('click', this.showChestInfo.bind(this));
    }
    const chestInfoButton = this.shadowRoot.querySelector(
      '.chest-info',
    ) as HTMLElement;
    document.addEventListener(EVENTS.CHEST_POINTS_UPDATED, (event: any) => {
      this._points = event.detail.points;

      if (this._points.length > 1) {
        for (const point of this._points) {
          const position = point.clone();

          const cameraInstance = event.detail.cameraInstance;

          position.project(cameraInstance);

          const translateX = position.x * window.innerWidth * 0.1;
          const translateY = -position.y * window.innerHeight * 0.1;

          chestInfoButton.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
        }
      }
    });

    document.addEventListener(EVENTS.CHEST_SELECTED, () => {
      this.hide();
      setTimeout(() => {
        this.show();
      }, 700);
    });

    document.addEventListener(EVENTS.HIDE_UI, () => {
      this.hide();
    });

    document.addEventListener(EVENTS.SHOW_UI, () => {
      this.show();
    });
  }

  showChestInfo(): void {
    const event = new CustomEvent(EVENTS.CHEST_INFO_BUTTON_CLICKED);
    document.dispatchEvent(event);
  }

  hide(): void {
    if (!this.shadowRoot) return;
    gsap.to(this, {
      opacity: 0,
      display: 'none',
      duration: 0.5,
      ease: 'power1.out',
    });
  }

  show(): void {
    if (!this.shadowRoot) return;
    gsap.to(this, {
      opacity: 1,
      display: 'block',
      duration: 0.5,
      ease: 'power1.out',
    });
  }

  render(): void {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = html`
      <style>
        .chest-info {
          position: absolute;
          top: 50%;
          left: 50%;
          transition: transform 0.3s;
          z-index: 5;
        }

        .chest-info__button {
          position: absolute;
          background: url('assets/chest-info-button.svg') no-repeat;
          background-size: contain;
          width: 75px;
          height: 75px;
          background-color: #fff;
          cursor: pointer;
          border-radius: 50%;

          display: flex;
          justify-content: center;
          align-items: center;
        }

        .chest-info__button:hover {
          transform: scale(1.025);
          transition: transform 100ms ease-in-out;
        }

        .chest-icon {
          width: 35px;
          height: 35px;
        }
      </style>
      <div class="chest-info">
        <div class="chest-info__button">
          <img
            class="chest-icon"
            src="icons/png/treasure_chest_icon.png"
            alt="Chest Info Button"
          />
        </div>
      </div>
    `;
  }
}

customElements.define('chest-info-button', ChestInfoButton);
