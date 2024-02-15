import gsap from 'gsap';
import { EVENTS } from '../../constants/events';
import { html } from '../../utils/html';

export class OpenButton extends HTMLElement {
  private state: { isLoggedIn: any };

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      isLoggedIn: false,
    };
  }

  connectedCallback(): void {
    this.render();
    this.attachEventListeners();
  }

  attachEventListeners(): void {
    if (!this.shadowRoot) return;
    const openButton = this.shadowRoot.querySelector('.open__container');
    openButton?.addEventListener('click', () => {
      gsap.to(openButton, {
        scale: 1.1,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
      });

      const token = localStorage.getItem('token');
      if (!token) {
        this.showLoginMenu();
      } else {
        // do open logic here
        // @ts-ignore
        window.experience.world.lootChest.startOpeningCutScene();
      }
    });
  }

  showLoginMenu() {
    document.dispatchEvent(new CustomEvent(EVENTS.SHOW_LOGIN_MENU));
  }

  hideLoginMenu() {
    document.dispatchEvent(new CustomEvent(EVENTS.HIDE_LOGIN_MENU));
  }

  render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = html`
      <style>
        {
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
            @import url('https://fonts.googleapis.com/css2?family=Hind:wght@300;400;500;600;700&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
        }

        .open__button {
          position: fixed;
          right: 50%;
          top: 90%;
          transform: translate(50%, -50%);
        }

        .open__container {
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          width: 180px;
          height: 70px;
          background-color: #fff;
          border-radius: 36px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .open__text {
          color: #25314c;
          font-size: 1rem;
          font-weight: 900;
          font-family: 'Montserrat', sans-serif;
        }
      </style>
      <div class="open__button">
        <div class="open__container">
          <span class="open__text">OPEN</span>
        </div>
      </div>
    `;
  }
}

customElements.define('open-button', OpenButton);
