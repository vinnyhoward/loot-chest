import gsap from 'gsap';
import { v4 as uuidv4 } from 'uuid';
import { Notification, NotificationType, Duration, Keys } from '../../types';
import { EVENTS } from '../../constants/events';
import { html } from '../../utils/html';
import { awardKey, fetchUserKeys } from '../../services/keys';

export class OpenButton extends HTMLElement {
  private state: {
    isOpening: boolean;
    userKeys: Keys[];
    userToken: string | null;
  };

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      isOpening: false,
      userKeys: [],
      userToken: '',
    };
  }

  connectedCallback(): void {
    this.render();
    this.attachEventListeners();
    this.state.userToken = localStorage.getItem('token');
    if (this.state.userToken) {
      setTimeout(() => this.awardAndFetchKeys(), 3000);
    }
  }

  async awardAndFetchKeys(): Promise<void> {
    const userIsAwarded = await awardKey();

    if (userIsAwarded) {
      const detail: Notification = {
        // TODO: Make dynamic based on key amount and just 3
        title: 'Daily keys earned',
        message: 'Ready for some new loot?',
        id: uuidv4(),
        type: NotificationType.AWARDED,
        duration: Duration.LONG,
      };

      document.dispatchEvent(
        new CustomEvent(EVENTS.TOAST_SUCCESS, {
          bubbles: true,
          composed: true,
          detail,
        }),
      );
    }

    const userKeys: Keys[] = await fetchUserKeys();
    if (userKeys) {
      this.state.userKeys = userKeys;
    }

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

      if (!this.state.userToken) {
        this.showLoginMenu();
      } else {
        const tempCallback = () => {
          this.state.isOpening = false;
          this.render();
          this.attachEventListeners();
        };

        if (!this.state.isOpening) {
          this.state.isOpening = true;
          // @ts-ignore
          window.experience.world.lootChest.startOpeningCutScene(tempCallback);
        } else {
          this.state.isOpening = true;
          // @ts-ignore
          window.experience.world.lootChest.endOpeningCutScene(tempCallback);
        }
        this.render();
        this.attachEventListeners();
      }
    });

    document.addEventListener(EVENTS.LOGIN_SUCCESS, () => {
      this.state.userToken = localStorage.getItem('token');
      this.awardAndFetchKeys();
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

        .open__button:hover {
          transform: translate(50%, -50%) scale(1.025);
          transition: transform 100ms ease-in-out;
        }

        .open__container {
          position: relative;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          width: 200px;
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
          font-size: 1.3rem;
          font-weight: bolder;
          font-family: 'Montserrat', sans-serif;
          text-transform: uppercase;
        }

        .key__text {
          color: #974AF4;
          font-size: 1.3rem;
          font-weight: bolder;
          font-family: 'Montserrat', sans-serif;
          margin-left: 50px;
          z-index: 1;
        }

        .key__icon {
          position: absolute;
          width: 55px;
          height: 55px;
          left: 93px;
          z-index: 0;
        }
      </style>
      <div class="open__button">
        <div class="open__container">
          <span class="open__text"
            >${this.state.isOpening ? 'Skip' : 'Open'}</span
          >
          <img class="key__icon" src="icons/png/key_icon.png" alt="key" />
          <span class="key__text">x${this.state.userKeys.length}</span>
        </div>
      </div>
    `;
  }
}

customElements.define('open-button', OpenButton);
