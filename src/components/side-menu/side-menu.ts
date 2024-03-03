import gsap from 'gsap';
import { EVENTS } from '../../constants/events';
import { html } from '../../utils/html';
import { urlFor } from '../../services/sanity';

export class SideMenu extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback(): void {
    this.render();
    this.attachEventListeners();
    // this.hide();
  }

  disconnectedCallback(): void {
    this.detachEventListeners();
  }

  attachEventListeners(): void {
    if (!this.shadowRoot) return;

    this.shadowRoot
      .querySelector('.close__container')
      ?.addEventListener('click', () => {
        this.hide();
      });

    document.addEventListener(EVENTS.SHOW_SIDE_MENU, () => {
      this.show();
    });
  }

  detachEventListeners(): void {
    if (!this.shadowRoot) return;

    this.shadowRoot
      ?.querySelector('.close')
      ?.removeEventListener('click', () => {
        this.hide();
      });

    document.removeEventListener(EVENTS.SHOW_SIDE_MENU, () => {
      this.show();
    });
  }

  public show(): void {
    if (!this.shadowRoot) return;

    gsap.to(this.shadowRoot.querySelector('.side-menu'), {
      duration: 0.15,
      x: 0,
      ease: 'power1.out',
    });
  }

  public hide(): void {
    if (!this.shadowRoot) return;
    gsap.to(this.shadowRoot.querySelector('.side-menu'), {
      duration: 0.15,
      x: -400,
      ease: 'power1.out',
    });
  }

  public render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = html` <style>
        {
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Hind:wght@300;400;500;600;700&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;

          --main_color: #8847ff;
          --secondary_color: #fff;

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

        .side-menu {
          position: fixed;
          top: 0;
          left: 0;
          width: 400px;
          height: 100%;
          background-color: var(--secondary_color);
          z-index: 999;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        }

        .side-menu__container {

        }

        .logo__image {
            width: 262px;
            height: 78px;
        }

        .logo__container {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0px 10px 10px 10px;
        }

        .close__container {
          display: flex;
          justify-content: flex-end;
          padding: 20px 20px 0 0;
        }

        .close__button {
          cursor: pointer;
          margin: 0;
        }

        .line {
          width: 100%;
          height: 2px;
          background-color: #f0f0f0;
          margin: 10px 0;
        }
      </style>
      <div class="side-menu">
        <div class="side-menu__container">
          <div class="close__container">
            <span class="close__button"
              ><svg
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.414 12L18.707 6.70695C19.098 6.31695 19.098 5.68301 18.707 5.29301C18.316 4.90201 17.684 4.90201 17.293 5.29301L12 10.586L6.70701 5.29301C6.31601 4.90201 5.68401 4.90201 5.29301 5.29301C4.90201 5.68301 4.90201 6.31695 5.29301 6.70695L10.586 12L5.29301 17.293C4.90201 17.683 4.90201 18.3169 5.29301 18.7069C5.48801 18.9019 5.74401 19 6.00001 19C6.25601 19 6.51201 18.9019 6.70701 18.7069L12 13.414L17.293 18.7069C17.488 18.9019 17.744 19 18 19C18.256 19 18.512 18.9019 18.707 18.7069C19.098 18.3169 19.098 17.683 18.707 17.293L13.414 12Z"
                  fill="#25314C"
                />
              </svg>
            </span>
          </div>
          <div class="logo__container">
            <img class="logo__image" src="/logos/temp_logo.png" alt="logo" />
          </div>
          <div class="line"></div>
        </div>
      </div>`;
  }
}

customElements.define('side-menu', SideMenu);
