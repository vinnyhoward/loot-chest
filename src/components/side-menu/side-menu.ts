import gsap from 'gsap';
import { EVENTS } from '../../constants/events';
import { html } from '../../utils/html';
import { fetchAllPrizes, fetchUserPrizes } from '../../services/prizes';
import { urlFor } from '../../services/sanity';
import { timeAgo } from '../../utils/timeAgo';

enum SelectedSection {
  WINS = 'WINS',
  PROFILE = 'PROFILE',
  NONE = 'NONE',
}

enum ProfileSection {
  PAST_REWARDS = 'PAST_REWARDS',
  UNCLAIMED_REWARDS = 'UNCLAIMED_REWARDS',
}

type Rewards = {
  id: string;
  wonAt: string;
  createdAt: string;
  updatedAt: string;
  itemWon: string;
  rewardImageRef: string;
  user: {
    username: string;
  };
};

export class SideMenu extends HTMLElement {
  private state: {
    allRewards: Rewards[];
    usersRewards: Rewards[];
    selectedSection: SelectedSection;
    profileSection: ProfileSection;
    page: number;
    limit: number;
    skip: number;
    loading: boolean;
  };
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      selectedSection: SelectedSection.WINS,
      profileSection: ProfileSection.PAST_REWARDS,
      allRewards: [],
      usersRewards: [],
      page: 1,
      limit: 20,
      skip: 0,
      loading: false,
    };
  }

  connectedCallback(): void {
    this.render();
    this.attachEventListeners();
    this.getAllPrizes();
    this.renderProfile();
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
      this.getAllPrizes();
      this.fetchUserPrizes();
      this.renderProfile();
      this.loginButtonListener();
      this.show();
    });

    this.recentWinsSelected();
    this.myProfileSelected();
    this.loginButtonListener();
  }

  loginButtonListener(): void {
    if (!this.shadowRoot) return;
    const loginButton = this.shadowRoot?.querySelector(
      '.login-btn',
    ) as HTMLElement;
    loginButton?.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent(EVENTS.SHOW_LOGIN_MENU));
      this.hide();
    });

    const logoutButton = this.shadowRoot?.querySelector(
      '.logout-btn',
    ) as HTMLElement;

    logoutButton?.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent(EVENTS.LOGOUT));
      localStorage.removeItem('user_auth');
      localStorage.removeItem('token');
      this.renderProfile();
      this.fetchUserPrizes();
      this.attachEventListeners();
    });

    document.addEventListener(EVENTS.LOGIN_SUCCESS, () => {
      this.renderProfile();
      this.fetchUserPrizes();
      this.attachEventListeners();
    });
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
    const profileContainer = this.shadowRoot?.querySelector(
      '.profile__container',
    ) as HTMLElement;

    recentWinsElement?.addEventListener('click', () => {
      if (this.state.selectedSection !== SelectedSection.WINS) {
        this.state.selectedSection = SelectedSection.WINS;
        profileElement.style.borderTop = `1px solid #f0f0f0`;
        profileElement.style.position = 'fixed';
        rewardsContainer.style.display = 'block';
        profileContainer.style.display = 'none';
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
        profileElement.style.position = 'relative';
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
    const profileContainer = this.shadowRoot?.querySelector(
      '.profile__container',
    ) as HTMLElement;

    profileElement?.addEventListener('click', () => {
      if (this.state.selectedSection !== SelectedSection.PROFILE) {
        this.state.selectedSection = SelectedSection.PROFILE;
        this.fetchUserPrizes();
        this.loginButtonListener();
        profileElement.style.position = 'relative';
        profileContainer.style.display = 'flex';
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
        profileElement.style.position = 'relative';
        profileElement.style.borderTop = `0px solid #f0f0f0`;
        profileContainer.style.display = 'none';
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

  async getAllPrizes(): Promise<void> {
    this.state.allRewards = [];
    this.state.loading = true;
    const prizes = await fetchAllPrizes(1, 20);
    if (prizes) {
      this.state.loading = false;
      this.state.allRewards = prizes;
      this.renderAllRewards();
    }
  }

  async fetchUserPrizes(): Promise<void> {
    const user = JSON.parse(localStorage.getItem('user_auth') || '{}');
    if (Object.keys(user).length === 0) return;

    this.state.usersRewards = [];
    this.state.loading = true;
    const prizes = await fetchUserPrizes();

    if (prizes) {
      this.state.loading = false;
      this.state.usersRewards = prizes;
      this.renderUsersRewards();
    }
  }

  renderAllRewards(): void {
    if (!this.shadowRoot) return;
    const rewardsContainer = this.shadowRoot.querySelector(
      '.rewards-data__container',
    );

    if (!rewardsContainer) return;

    rewardsContainer.innerHTML = '';

    this.state.allRewards.map((reward: Rewards) => {
      const rewardElement = document.createElement('div');
      rewardElement.classList.add('rewards-data');
      rewardElement.innerHTML = html`
        <div class="reward-name-image">
          <img
            class="reward__icon"
            src="${urlFor(reward.rewardImageRef).width(40).height(40).url()}"
            alt="reward image"
          />
          <span class="reward__name">${reward.itemWon}</span>
        </div>
        <div class="username">${reward.user.username}</div>
        <div class="won-date">${timeAgo(reward.wonAt)}</div>
      `;
      rewardsContainer.appendChild(rewardElement);
    });
  }

  renderUsersRewards(): void {
    if (!this.shadowRoot) return;
    const usersRewardsContainer = this.shadowRoot.querySelector(
      '.users-rewards__container',
    );

    if (!usersRewardsContainer) return;

    usersRewardsContainer.innerHTML = '';

    this.state.usersRewards.map((reward: any) => {
      const rewardElement = document.createElement('div');
      rewardElement.classList.add('users-rewards__data');
      rewardElement.innerHTML = html`
        <div class="reward-name-image">
          <img
            class="reward__icon"
            src="${urlFor(reward.rewardImageRef).width(40).height(40).url()}"
            alt="reward image"
          />
          <span class="reward__name">${reward.itemWon}</span>
        </div>
        <div class="won-date">${timeAgo(reward.wonAt)}</div>
      `;
      usersRewardsContainer.appendChild(rewardElement);
    });
  }

  renderProfile(): void {
    if (!this.shadowRoot) return;
    const profileContainer = this.shadowRoot.querySelector(
      '.profile__container',
    );

    if (!profileContainer) return;
    const user = JSON.parse(localStorage.getItem('user_auth') || '{}');

    if (Object.keys(user).length === 0) {
      profileContainer.innerHTML = html`
        <div class="profile-sections__header">
          <h3 class="header">My Past Rewards</h3>
        </div>
        <div class="profile__info">
          <button class="login-btn">Login</button>
        </div>
      `;
    } else {
      profileContainer.innerHTML = html`
        <div class="users-rewards-list">
          <div class="profile-sections__header">
            <h3 class="header">My Past Rewards</h3>
          </div>
          <div class="users-rewards__container"></div>
        </div>

        <div class="users-interaction">
          <div class="logout-btn__container">
            <button class="logout-btn">Logout</button>
          </div>
          <div class="profile__info">
            <div class="profile-image__container">
              <img
                class="profile-image"
                src="https://i.pravatar.cc/150?img=68"
                alt="profile image"
              />
              <h3 class="username">${user.username}</h3>
            </div>
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 5H6C4 5 3 6 3 8V17C3 19 4 20 6 20H18C20 20 21 19 21 17V8C21 6 20 5 18 5ZM17.9409 9.606L13.0291 13.178C12.7211 13.402 12.36 13.514 12 13.514C11.64 13.514 11.2779 13.402 10.9709 13.179L6.05908 9.606C5.72408 9.363 5.65004 8.893 5.89404 8.558C6.13704 8.224 6.60389 8.14801 6.94189 8.39301L11.854 11.965C11.942 12.028 12.059 12.029 12.147 11.965L17.0591 8.39301C17.3961 8.14801 17.8639 8.224 18.1069 8.558C18.3509 8.894 18.2759 9.363 17.9409 9.606Z"
                fill="#25314C"
              />
            </svg>
          </div>
        </div>
      `;
    }
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

    gsap.fromTo(
      this.shadowRoot.querySelector('.side-menu'),
      { x: -400 },
      { x: 0, duration: 0.5, ease: 'bounce.out' },
    );

    gsap.to(this.shadowRoot.querySelector('.side-menu__parent'), {
      delay: 0.1,
      duration: 0.3,
      opacity: 1,
      display: 'block',
      ease: 'power1.in',
    });
  }

  public hide(): void {
    if (!this.shadowRoot) return;

    gsap.to(this.shadowRoot.querySelector('.side-menu'), {
      duration: 0.5,
      x: -400,
      ease: 'power2.in',
    });

    // Fade out the overlay simultaneously
    gsap.to(this.shadowRoot.querySelector('.side-menu__parent'), {
      duration: 0.3,
      opacity: 0,
      display: 'none',
      ease: 'power1.out',
    });
  }

  public render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = html` <style>
        {
        @import url('https://fonts.googleapis.com/css2?family=Hind:wght@300;400;500;600;700;800;900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;

          --main-color: #8847ff;
          --main-color-gradient: linear-gradient(
            120deg,
            #8847ff 0%,
            #a06cff 100%
          );
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

          --primary-text-color: white;
          --secondary-text-color: #25314c;
        }

        button {
          width: 100%;
          height: 50px;
          border: none;
          border-radius: 8px;
          background-color: #974af4;
          color: white;
          font-family: 'Hind', sans-serif;
          font-weight: 600;
          font-style: normal;
          font-size: 14px;
          cursor: pointer;
          text-transform: uppercase;
        }

        .side-menu__parent {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.1);
          z-index: 1;
          display: none;
          justify-content: flex-end;
          align-items: center;
          z-index: 998;
        }

        .side-menu {
          position: fixed;
          top: 0;
          left: -400;
          width: 400px;
          height: 100%;
          background-color: var(--secondary_color);
          z-index: 999;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);

          @media (max-width: 400px) {
            width: 100%;
          }
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
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .rewards__header {
          display: grid;
          grid-template-columns: 55% 40% 5%;
          padding: 10px 20px;
          border-bottom: 1px solid #f0f0f0;
        }

        .rewards-data {
          display: grid;
          grid-template-columns: 55% 40% 5%;
          padding: 10px 20px;
          border-bottom: 1px solid #f0f0f0;
        }

        .rewards-data__container {
          height: 500px;
        }

        .rewards-data__container::-webkit-scrollbar {
          display: none;
        }

        .rewards-data__container::-webkit-scrollbar-track {
          background: var(--common);
        }

        .rewards-data__container::-webkit-scrollbar-thumb {
          background: var(--uncommon);
        }

        .rewards-data__container::-webkit-scrollbar-thumb:hover {
          background: var(--uncommon);
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

        .reward-name-image {
          display: flex;
          align-items: center;
        }

        .reward__icon {
          width: 40px;
          height: 40px;
          margin-right: 10px;
          border-radius: 50%;
        }

        .reward__name {
          font-family: var(--font1);
          font-size: 0.9rem;
          font-weight: 900;
          color: #25314c;
        }

        .username {
          font-family: var(--font1);
          font-size: 0.9rem;
          font-weight: 900;
          color: #25314c;
          display: flex;
          align-items: center;
        }

        .won-date {
          font-family: var(--font2);
          font-size: 0.9rem;
          font-weight: 500;
          color: #c9ced8;
          display: flex;
          align-items: center;
        }

        .profile__container {
          position: relative;
          display: none;
          flex-direction: column;
          height: 100%;
          justify-content: space-between;
        }

        .profile-image {
          width: 45px;
          height: 45px;
          border-radius: 8px;
          background-size: cover;
          margin-right: 10px;
        }

        .profile__info {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-top: 1px solid #f0f0f0;
          border-bottom: 1px solid #f0f0f0;
        }

        .profile-image__container {
          display: flex;
          flex-direction: row;
          align-items: center;
        }

        .profile-sections__header {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          padding: 10px 20px;
          border-bottom: 1px solid #f0f0f0;
          text-align: center;
        }

        .inactive-section-title {
          font-family: var(--font1);
          font-size: 0.9rem;
          font-weight: 900;
          color: #c9ced8;
          cursor: pointer;
        }

        .users-rewards__data {
          display: flex;
          justify-content: space-between;
          padding: 10px 20px;
          border-bottom: 1px solid #f0f0f0;
        }

        .logout-btn__container {
          margin: 20px;
        }

        .users-rewards__container {
          display: flex;
          flex-direction: column;
        }

        .users-rewards-list {
          display: flex;
          flex-direction: column;
          overflow-y: scroll;
          max-height: 500px;
        }

        .users-interaction {
          position: fixed;
          bottom: 0;
          display: flex;
          flex-direction: column;
          width: 400px;
          background-color: #fff;

          @media (max-width: 400px) {
            width: 100%;
          }
        }

        .profile {
          background: white;
          position: fixed;
          bottom: 0;
          width: 100%;
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
                  <span class="section-btn__text">Profile</span>
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

              <div class="profile__container"></div>
            </div>
          </div>
        </div>
      </div>`;
  }
}

customElements.define('side-menu', SideMenu);
