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

  attachEventListeners() {
    if (!this.shadowRoot) return;

    this.shadowRoot
      .querySelector('.hamburger')
      ?.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent(EVENTS.SHOW_SIDE_MENU));
      });

    document.addEventListener(EVENTS.HIDE_SIDE_MENU, () => {
      this.hide();
    });

    document.addEventListener(EVENTS.SHOW_SIDE_MENU, () => {
      this.show();
    });
  }

  disconnectedCallback(): void {
    this.detachEventListeners();
  }

  private detachEventListeners(): void {
    if (!this.shadowRoot) return;

    this.shadowRoot
      ?.querySelector('.hamburger')
      ?.removeEventListener('click', () => {
        document.dispatchEvent(new CustomEvent(EVENTS.SHOW_SIDE_MENU));
      });

    document.removeEventListener(EVENTS.HIDE_SIDE_MENU, () => {
      this.hide();
    });

    document.removeEventListener(EVENTS.SHOW_SIDE_MENU, () => {
      this.show();
    });
  }

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
        }

        .hamburger {
          cursor: pointer;
          position: fixed;
          top: 75px;
          left: 75px;
          height: 50px;
          opacity: 1;

          @media (max-width: 575px) {
            top: 25px;
            left: 25px;
          }
        }

        .hamburger__container {
          background-color: #fff;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          width: 70px;
          height: 70px;
          border-radius: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .hamburger__container:hover {
          transform: scale(1.025);
          transition: transform 100ms ease-in-out;
        }
      </style>
      <div class="hamburger">
        <div class="hamburger__container">
          <svg
            width="40"
            height="40"
            viewBox="0 0 49 49"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.3334 12.3333C18.3334 11.2089 19.2459 10.2963 20.3704 10.2963H42.7778C43.9022 10.2963 44.8148 11.2089 44.8148 12.3333C44.8148 13.4578 43.9022 14.3704 42.7778 14.3704H20.3704C19.2459 14.3704 18.3334 13.4578 18.3334 12.3333ZM42.7778 22.5185H6.11113C4.98669 22.5185 4.0741 23.4311 4.0741 24.5556C4.0741 25.68 4.98669 26.5926 6.11113 26.5926H42.7778C43.9022 26.5926 44.8148 25.68 44.8148 24.5556C44.8148 23.4311 43.9022 22.5185 42.7778 22.5185ZM28.5185 34.7407H6.11113C4.98669 34.7407 4.0741 35.6533 4.0741 36.7778C4.0741 37.9022 4.98669 38.8148 6.11113 38.8148H28.5185C29.643 38.8148 30.5556 37.9022 30.5556 36.7778C30.5556 35.6533 29.643 34.7407 28.5185 34.7407Z"
              fill="#25314C"
            />
          </svg>
        </div>
      </div>
    `;
  }
}

customElements.define('hamburger-icon', HamburgerIcon);
