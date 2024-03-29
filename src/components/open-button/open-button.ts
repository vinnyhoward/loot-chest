import gsap from 'gsap';
import { v4 as uuidv4 } from 'uuid';
import {
  Notification,
  NotificationType,
  Duration,
  Keys,
  UserAuthStorage,
} from '../../types';
import { EVENTS } from '../../constants/events';
import { html } from '../../utils/html';
import { awardKey, fetchUserKeys } from '../../services/keys';
import { openChest } from '../../services/chests';
import { errorMessages } from '../../constants/errorMessages';

export class OpenButton extends HTMLElement {
  private state: {
    isOpening: boolean;
    userKeys: Keys[];
    userToken: string | null;
    selectedChest: any | null;
    openedChestData: any | null;
  };

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      isOpening: false,
      userKeys: [],
      userToken: '',
      selectedChest: null,
      openedChestData: null,
    };
    this.showRewardModal = this.showRewardModal.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleChestSelected = this.handleChestSelected.bind(this);
    this.handleLoginSuccess = this.handleLoginSuccess.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleActiveTab = this.handleActiveTab.bind(this);
  }

  connectedCallback(): void {
    this.render();
    this.attachEventListeners();

    this.state.userToken = localStorage.getItem('token');
    if (this.state.userToken) {
      setTimeout(() => this.awardAndFetchKeys(), 3000);
    }
    document.addEventListener(EVENTS.LOGOUT, this.handleLogout);
  }

  disconnectedCallback(): void {
    this.detachEventListeners();
  }

  handleChestSelected(event: Event): void {
    const detail = (event as CustomEvent).detail;
    this.state.selectedChest = detail.selectedChest;
  }

  handleLoginSuccess(): void {
    this.state.userToken = localStorage.getItem('token');
    this.awardAndFetchKeys();
  }

  async awardAndFetchKeys(): Promise<void> {
    const userIsAwarded = await awardKey();
    const userKeys: Keys[] = await fetchUserKeys();
    if (userIsAwarded) {
      const detail: Notification = {
        // TODO: Make dynamic based on key amount and just 3
        title: 'Daily keys earned',
        message: 'Ready for some new loot?',
        id: uuidv4(),
        type: NotificationType.AWARDED,
        duration: Duration.LONG,
        keyAmount: userKeys.length,
      };
      document.dispatchEvent(
        new CustomEvent(EVENTS.TOAST_SUCCESS, {
          bubbles: true,
          composed: true,
          detail,
        }),
      );
    }
    if (userKeys) {
      this.state.userKeys = userKeys;
    }
    this.updateKeyText();
  }

  attachEventListeners(): void {
    if (!this.shadowRoot) return;
    document.addEventListener(EVENTS.CHEST_SELECTED, this.handleChestSelected);
    document.addEventListener(EVENTS.LOGIN_SUCCESS, () =>
      this.handleLoginSuccess(),
    );
    document.addEventListener('visibilitychange', this.handleActiveTab);

    const openButton = this.shadowRoot.querySelector('.open__container');
    openButton?.addEventListener('click', this.handleOpen);
  }

  detachEventListeners(): void {
    document.removeEventListener(EVENTS.LOGOUT, this.handleLogout);
    document.removeEventListener(
      EVENTS.CHEST_SELECTED,
      this.handleChestSelected,
    );
    document.removeEventListener(EVENTS.LOGIN_SUCCESS, this.handleLoginSuccess);
    const openButton = this.shadowRoot?.querySelector('.open__container');
    openButton?.removeEventListener('click', this.handleOpen);
  }

  private handleActiveTab(): void {
    const userString: string | null = localStorage.getItem('user_auth');
    const userObject: UserAuthStorage | null = userString
      ? JSON.parse(userString)
      : null;
    const currentDate: Date = new Date();
    const HOURS_THRESHOLD: number = 4;
    if (
      userObject &&
      userObject.lastCheckedTokenAward &&
      document.visibilityState === 'visible'
    ) {
      const lastCheckedDate: Date = new Date(userObject.lastCheckedTokenAward);
      const hoursDiff: number =
        (currentDate.getTime() - lastCheckedDate.getTime()) / (1000 * 60 * 60);

      if (hoursDiff > HOURS_THRESHOLD) {
        userObject.lastCheckedTokenAward = currentDate.toISOString();
        localStorage.setItem('user_auth', JSON.stringify(userObject));
        this.awardAndFetchKeys();
      }
    } else {
      if (userObject && !userObject.lastCheckedTokenAward) {
        userObject.lastCheckedTokenAward = currentDate.toISOString();
        localStorage.setItem('user_auth', JSON.stringify(userObject));
        this.awardAndFetchKeys();
      }
    }
  }

  async handleOpen(): Promise<void> {
    if (!this.shadowRoot) return;
    const openButton = this.shadowRoot.querySelector('.open__container');
    gsap.to(openButton, {
      scale: 1.1,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });

    if (!this.state.userToken) {
      return this.showLoginMenu();
    }

    if (this.state.userKeys.length === 0) {
      const detail: Notification = {
        title: 'No keys',
        message: 'You need keys to open chests',
        id: uuidv4(),
        type: NotificationType.ERROR,
        duration: Duration.SHORT,
      };

      document.dispatchEvent(
        new CustomEvent(EVENTS.TOAST_ERROR, {
          bubbles: true,
          composed: true,
          detail,
        }),
      );
      return;
    }

    if (!this.state.selectedChest._id) {
      const detail: Notification = {
        title: 'No chest selected',
        message: 'You need to select a chest to open',
        id: uuidv4(),
        type: NotificationType.ERROR,
        duration: Duration.SHORT,
      };

      document.dispatchEvent(
        new CustomEvent(EVENTS.TOAST_ERROR, {
          bubbles: true,
          composed: true,
          detail,
        }),
      );
      return;
    }

    window.experience.world.lootChest.resetAnimations();

    const chestId = this.state.selectedChest._id;
    const keyId = this.state.userKeys[0].id;

    if (!this.state.openedChestData) {
      this.state.openedChestData = await openChest(chestId, keyId);
    }

    if (!this.state.openedChestData) {
      const detail: Notification = {
        title: 'Something went wrong',
        message: 'Please try again later',
        id: uuidv4(),
        type: NotificationType.ERROR,
        duration: Duration.LONG,
      };

      document.dispatchEvent(
        new CustomEvent(EVENTS.TOAST_SUCCESS, {
          bubbles: true,
          composed: true,
          detail,
        }),
      );
      return;
    }

    this.state.userKeys = this.state.openedChestData.keys;
    const callback = () => {
      const prizeLogId =
        this.state.openedChestData?.prizeFulfillment?.prizeLogId;
      if (prizeLogId) {
        const rewardItem = this.state.selectedChest.rewardList.find(
          (item: any) =>
            item._key ===
            this.state.openedChestData.prizeFulfillment.sanityRewardId,
        );
        window.experience.world.lootChest.startSuccessAnimation();
        setTimeout(() => {
          this.showRewardModal(rewardItem, prizeLogId);
        }, 2000);
      } else {
        window.experience.world.lootChest.startFailureAnimation();
        setTimeout(() => {
          const randomIndex = Math.floor(Math.random() * errorMessages.length);
          const { title, description } = errorMessages[randomIndex];
          this.showErrorModal(title, description);
        }, 2000);
      }

      document.dispatchEvent(new CustomEvent(EVENTS.SHOW_UI));

      this.state.isOpening = false;
      this.state.openedChestData = null;

      this.updateKeyText();
    };

    document.dispatchEvent(new CustomEvent(EVENTS.HIDE_UI));
    if (!this.state.isOpening) {
      this.state.isOpening = true;
      // @ts-ignore
      window.experience.world.lootChest.startOpeningCutScene(callback);
    } else {
      this.state.isOpening = true;
      // @ts-ignore
      window.experience.world.lootChest.endOpeningCutScene(callback);
    }

    this.updateButtonText();
  }

  updateButtonText(): void {
    if (!this.shadowRoot) return;
    const openTextEl = this.shadowRoot?.querySelector(
      '.open__text',
    ) as HTMLElement;
    const imageEl = this.shadowRoot?.querySelector('.key__icon') as HTMLElement;
    const keyTextEl = this.shadowRoot?.querySelector(
      '.key__text',
    ) as HTMLElement;

    if (this.state.isOpening) {
      imageEl.style.display = 'none';
      keyTextEl.style.display = 'none';
      openTextEl.textContent = 'Skip';
    } else {
      imageEl.style.display = 'block';
      keyTextEl.style.display = 'block';
      openTextEl.textContent = 'Open';
    }
  }

  updateKeyText(): void {
    const keyTextEl = this.shadowRoot?.querySelector(
      '.key__text',
    ) as HTMLElement;
    keyTextEl.textContent = `x${this.state.userKeys.length}`;
  }

  handleLogout(): void {
    localStorage.removeItem('user_auth');
    localStorage.removeItem('token');
    this.state.userToken = null;
    this.state.userKeys = [];
    this.updateKeyText();
  }

  showRewardModal(reward: any, prizeLogId: string) {
    document.dispatchEvent(
      new CustomEvent(EVENTS.SHOW_REWARD_MODAL, {
        bubbles: true,
        composed: true,
        detail: { reward, prizeLogId },
      }),
    );
  }

  showErrorModal(errorTitle: string, errorDescription: string) {
    document.dispatchEvent(
      new CustomEvent(EVENTS.SHOW_FAILURE_MODAL, {
        detail: { errorTitle, errorDescription },
        bubbles: true,
        composed: true,
      }),
    );
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

          @media (max-width: 575px) {
            right: 50%;
            top: 85%;
            transform: translate(50%, 0%);
            bottom: 25px;
          }
        }

        .open__button:hover {
          transform: translate(50%, -50%) scale(1.025);
          transition: transform 100ms ease-in-out;

          @media (max-width: 575px) {
            transform: translate(50%, 0%) scale(1.025);
          }
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
          display: block;
        }

        .key__icon {
          position: absolute;
          width: 55px;
          height: 55px;
          left: 93px;
          z-index: 0;
          display: block;
        }
      </style>
      <div class="open__button">
        <div class="open__container">
          <span class="open__text">Open</span>
          <img class="key__icon" src="icons/png/key_icon.png" alt="key" />
          <span class="key__text">x0</span>
        </div>
      </div>
    `;
  }
}

customElements.define('open-button', OpenButton);
