import gsap from 'gsap';
import { EVENTS } from '../../constants/events';
import { html } from '../../utils/html';
import { fetchAllPrizes } from '../../services/prizes';
import { urlFor } from '../../services/sanity';

enum SelectedSection {
  WINS = 'WINS',
  PROFILE = 'PROFILE',
  NONE = 'NONE',
}

type Rewards = {
  id: string;
  wonAt: string;
  createdAt: string;
  updatedAt: string;
  itemWon: string;
};

export class SideMenu extends HTMLElement {
  private state: {
    rewards: Rewards[];
    selectedSection: SelectedSection;
    page: number;
    limit: number;
    skip: number;
  };
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      selectedSection: SelectedSection.WINS,
      rewards: [],
      page: 1,
      limit: 20,
      skip: 0,
    };
  }

  connectedCallback(): void {
    this.render();
    this.attachEventListeners();
    this.getPrizes();
    // this.hide();
  }

  disconnectedCallback(): void {
    this.detachEventListeners();
  }

  attachEventListeners(): void {
    if (!this.shadowRoot) return;
    const profileArrow = this.shadowRoot?.querySelector(
      '#profile-dropdown-arrow',
    ) as SVGSVGElement;

    if (profileArrow) {
      gsap.to(profileArrow, {
        duration: 0.15,
        rotation: -90,
        transformOrigin: 'center',
      });
    }

    this.shadowRoot
      .querySelector('.close__container')
      ?.addEventListener('click', () => {
        this.hide();
      });

    document.addEventListener(EVENTS.SHOW_SIDE_MENU, () => {
      this.show();
    });

    this.recentWinsSelected();
    this.myProfileSelected();
    this.getPrizes();
  }

  recentWinsSelected(): void {
    const winsArrow = this.shadowRoot?.querySelector(
      '#wins-dropdown-arrow',
    ) as SVGSVGElement;
    const profileArrow = this.shadowRoot?.querySelector(
      '#profile-dropdown-arrow',
    ) as SVGSVGElement;
    const rewardsContainer = this.shadowRoot?.querySelector(
      '.rewards__container',
    ) as HTMLElement;
    const recentWinsElement = this.shadowRoot?.querySelector(
      '.recent-wins',
    ) as HTMLElement;
    const profileElement = this.shadowRoot?.querySelector(
      '.profile',
    ) as HTMLElement;

    recentWinsElement?.addEventListener('click', () => {
      if (this.state.selectedSection !== SelectedSection.WINS) {
        this.state.selectedSection = SelectedSection.WINS;
        profileElement.style.borderTop = `1px solid #f0f0f0`;
        rewardsContainer.style.display = 'block';
        if (profileArrow) {
          const rotation = -90;
          gsap.to(profileArrow, {
            duration: 0.15,
            rotation,
            transformOrigin: 'center',
          });
        }

        if (winsArrow) {
          const rotation = 0;
          gsap.to(winsArrow, {
            duration: 0.15,
            rotation,
            transformOrigin: 'center',
          });
        }
      } else {
        this.state.selectedSection = SelectedSection.NONE;
        profileElement.style.borderTop = `0px solid #f0f0f0`;
        rewardsContainer.style.display = 'none';
        if (winsArrow) {
          const rotation = -90;
          gsap.to(winsArrow, {
            duration: 0.15,
            rotation,
            transformOrigin: 'center',
          });
        }
      }
    });
  }

  myProfileSelected(): void {
    const winsArrow = this.shadowRoot?.querySelector(
      '#wins-dropdown-arrow',
    ) as SVGSVGElement;
    const profileArrow = this.shadowRoot?.querySelector(
      '#profile-dropdown-arrow',
    ) as SVGSVGElement;
    const rewardsContainer = this.shadowRoot?.querySelector(
      '.rewards__container',
    ) as HTMLElement;
    const profileElement = this.shadowRoot?.querySelector(
      '.profile',
    ) as HTMLElement;

    profileElement?.addEventListener('click', () => {
      if (this.state.selectedSection !== SelectedSection.PROFILE) {
        this.state.selectedSection = SelectedSection.PROFILE;
        rewardsContainer.style.display = 'none';
        if (winsArrow) {
          const rotation = -90;
          gsap.to(winsArrow, {
            duration: 0.15,
            rotation,
            transformOrigin: 'center',
          });
        }

        if (profileArrow) {
          const rotation = 0;
          gsap.to(profileArrow, {
            duration: 0.15,
            rotation,
            transformOrigin: 'center',
          });
        }
      } else {
        this.state.selectedSection = SelectedSection.NONE;
        profileElement.style.borderTop = `0px solid #f0f0f0`;
        if (profileArrow) {
          const rotation = -90;
          gsap.to(profileArrow, {
            duration: 0.15,
            rotation,
            transformOrigin: 'center',
          });
        }
      }
    });
  }

  async getPrizes(): Promise<void> {
    const prizes = await fetchAllPrizes(1, 20);
    if (prizes) {
      this.state.rewards = prizes;
      this.renderRewards();
    }
  }

  renderRewards(): void {
    if (!this.shadowRoot) return;
    const rewardsContainer = this.shadowRoot.querySelector(
      '.rewards-data__container',
    );
    if (!rewardsContainer) return;
    this.state.rewards.forEach((reward: Rewards) => {
      const rewardElement = document.createElement('div');
      rewardElement.classList.add('rewards-data');
      rewardElement.innerHTML = html`
        <h3 class="header">${reward.itemWon}</h3>
        <h3 class="header">Username</h3>
        <h3 class="header">${reward.wonAt}</h3>
      `;
      rewardsContainer.appendChild(rewardElement);
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

    gsap.to(this.shadowRoot.querySelector('.side-menu__parent'), {
      duration: 0.15,
      opacity: 1,
      display: 'block',
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

    gsap.to(this.shadowRoot.querySelector('.side-menu__parent'), {
      duration: 0.15,
      opacity: 0,
      display: 'none',
      ease: 'power1.out',
    });
  }

  public render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = html` <style>
        @import url('https://fonts.googleapis.com/css2?family=Hind:wght@300;400;500;600;700;800;900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

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

        .side-menu__parent {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.1);
          z-index: 1;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          z-index: 998;
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
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
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

        .section-btn__container {
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 20px 20px 20px;
          border-bottom: 1px solid #f0f0f0;
          border-top: 1px solid #f0f0f0;
        }

        .reward__icon {
          width: 25px;
          height: 25px;
          margin-right: 10px;
        }

        .section-btn__text {
          font-family: var(--font1);
          font-size: 1rem;
          font-weight: 900;
          color: #25314c;
          text-transform: uppercase;
        }

        .reward-text-icon__container {
          display: flex;
          align-items: center;
        }

        .recent-wins__container {
          height: 300px;
        }

        .tabs {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .rewards__header {
          display: grid;
          grid-template-columns: 50% 35% 15%;
          padding: 10px 20px;
          border-bottom: 1px solid #f0f0f0;
        }

        .rewards-data {
          display: grid;
          grid-template-columns: 50% 35% 15%;
          padding: 10px 20px;
        }

        .rewards-data__container {
          display: grid;
          /* grid-template-columns: 50% 35% 15%; */
          height: 100%;
          overflow-y: auto;
        }

        .header {
          font-family: var(--font2);
          font-size: 0.9rem;
          font-weight: 500;
          color: #c9ced8;
        }

        .rewards__container {
          overflow-y: auto;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
      </style>

      <div class="side-menu__parent">
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

            <div class="tabs">
              <div class="section-btn__container recent-wins">
                <div class="reward-text-icon__container">
                  <img
                    class="reward__icon"
                    src="icons/svg/reward.svg"
                    alt="reward icon"
                  />
                  <span class="section-btn__text">Recent Wins</span>
                </div>

                <svg
                  id="wins-dropdown-arrow"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 17C11.744 17 11.488 16.9021 11.293 16.7071L4.29301 9.70707C3.90201 9.31607 3.90201 8.68401 4.29301 8.29301C4.68401 7.90201 5.31607 7.90201 5.70707 8.29301L12 14.586L18.293 8.29301C18.684 7.90201 19.3161 7.90201 19.7071 8.29301C20.0981 8.68401 20.0981 9.31607 19.7071 9.70707L12.7071 16.7071C12.5121 16.9021 12.256 17 12 17Z"
                    fill="#25314C"
                  />
                </svg>
              </div>

              <div class="rewards__container">
                <div class="rewards__header">
                  <h3 class="header">Reward</h3>
                  <h3 class="header">Username</h3>
                  <h3 class="header">Date</h3>
                </div>

                <div class="rewards-data__container"></div>
              </div>

              <div class="section-btn__container profile">
                <div class="reward-text-icon__container">
                  <img
                    class="reward__icon"
                    src="icons/svg/profile.svg"
                    alt="reward icon"
                  />
                  <span class="section-btn__text">My Profile</span>
                </div>

                <svg
                  id="profile-dropdown-arrow"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 17C11.744 17 11.488 16.9021 11.293 16.7071L4.29301 9.70707C3.90201 9.31607 3.90201 8.68401 4.29301 8.29301C4.68401 7.90201 5.31607 7.90201 5.70707 8.29301L12 14.586L18.293 8.29301C18.684 7.90201 19.3161 7.90201 19.7071 8.29301C20.0981 8.68401 20.0981 9.31607 19.7071 9.70707L12.7071 16.7071C12.5121 16.9021 12.256 17 12 17Z"
                    fill="#25314C"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }
}

customElements.define('side-menu', SideMenu);
