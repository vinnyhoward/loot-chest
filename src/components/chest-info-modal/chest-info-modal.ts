import gsap from 'gsap';
import { html } from '../../utils/html';
import { urlFor } from '../../services/sanity';
import { EVENTS } from '../../constants/events';

const rarityOrder: any = {
  common: 1,
  uncommon: 2,
  rare: 3,
  legendary: 4,
  divine: 5,
};

const sortRewards = (rewardList: any) => {
  return rewardList.sort((a: any, b: any) => {
    return rarityOrder[a.itemRarity] - rarityOrder[b.itemRarity];
  });
};

export class ChestInfoModal extends HTMLElement {
  private state: {
    selectedChest: any;
    loading: boolean;
    showMore: boolean;
  };

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      selectedChest: null,
      loading: true,
      showMore: false,
    };
  }

  set selectedChest(chest: any) {
    this.state.selectedChest = chest;
    this.state.loading = false;
    this.render();
    this.attachListeners();
    this.attachEventListeners();
    this.updateDescription();
  }

  get selectedChest(): any {
    return this.state.selectedChest;
  }

  connectedCallback(): void {
    this.render();
  }

  disconnectedCallback(): void {
    this.removeEventListener(EVENTS.CHEST_SELECTED, () => {});
    this.removeEventListener(EVENTS.CHEST_INFO_BUTTON_CLICKED, () => {});
  }

  private attachListeners(): void {
    if (!this.shadowRoot) return;

    const closeIcon = this.shadowRoot.querySelector(
      '.close__icon',
    ) as HTMLElement;
    closeIcon.addEventListener('click', () => {
      this.hide();
    });

    const showMore = this.shadowRoot.querySelector('.show-more') as HTMLElement;
    showMore.addEventListener('click', () => {
      this.state.showMore = !this.state.showMore;
      this.updateDescription();
    });
  }

  private attachEventListeners(): void {
    if (!this.shadowRoot) return;

    document.addEventListener(EVENTS.CHEST_SELECTED, (event: any) => {
      this.state.selectedChest = event.detail.selectedChest;
      this.state.loading = false;
      this.render();
      this.attachListeners();
      this.updateDescription();
    });

    document.addEventListener(EVENTS.CHEST_INFO_BUTTON_CLICKED, () => {
      this.show();
    });
  }

  public show(): void {
    if (!this.shadowRoot) return;
    const parent = this.shadowRoot.querySelector('.info-modal') as HTMLElement;
    parent.style.display = 'block';
    parent.style.opacity = '0';

    gsap.fromTo(
      parent,
      { y: -50, opacity: 0.5 },
      { y: 0, opacity: 1, duration: 0.3, ease: 'bounce.out', display: 'block' },
    );
  }

  public hide(): void {
    if (!this.shadowRoot) return;
    const parent = this.shadowRoot.querySelector('.info-modal') as HTMLElement;

    gsap.to(parent, {
      y: 20,
      opacity: 0,
      duration: 0.2,
      ease: 'power1.in',
      onComplete: () => {
        parent.style.display = 'none';
      },
    });
  }

  private updateDescription() {
    if (!this.shadowRoot) return;
    const description = this.shadowRoot.querySelector(
      '.chest__description',
    ) as HTMLElement;
    gsap.to(description, {
      duration: 0.1,
      height: this.state.showMore ? 'auto' : '50px',
    });
    const long = this.state.selectedChest.chestDescription;
    const short = long.substring(0, 100);
    description.innerText = this.state.showMore ? long : short;

    const showMore = this.shadowRoot.querySelector('.show-more') as HTMLElement;
    showMore.innerText = this.state.showMore ? 'Show Less' : 'Show More';

    const innerContainer = this.shadowRoot.querySelector(
      '.rewards-item__container--inner',
    ) as HTMLElement;
    gsap.to(innerContainer, {
      duration: 0.1,
      maxHeight: this.state.showMore ? '100px' : '240px',
    });
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

          --main-color: #8847ff;
          
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

        .info-modal {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1000;
          display: none;
          opacity: 0;
        }

        .info-modal__container {
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

          @media (max-width: 575px) {
            width: 200px;
            height: 200px;
            top: 10%;
          }
        }

        .chest__placeholder {
          height: 100px;
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
          padding: 0px 20px;
        }

        .close__icon {
          width: 60px;
          height: 60px;
          padding: 20px;
          z-index: 1000;
          cursor: pointer;
        }

        .chest__description {
          font-size: 0.9rem;
          color: #707c88;
          font-family: var(--font2);
          text-align: left;
          height: 50px;
          margin: 10px 0px 10px 0px;
        }

        .show-more {
          font-size: 0.8rem;
          font-weight: 500;
          color: #dedede;
          font-family: var(--font2);
          cursor: pointer;
        }

        .section-title {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 500;
          color: #dedede;
          font-family: var(--font2);
          margin: 10px 0;
          padding: 0 30px;
        }

        .rewards__container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 20px 20px 20px;
        }

        .rewards-list__container--outer {
          width: 100%;
          border-radius: 16px;
          overflow-y: hidden;
        }

        .rewards-item__container--inner {
          max-height: 240px;
          border-radius: 16px;
          overflow-y: scroll;
        }

        .rewards-item__container--inner::-webkit-scrollbar {
          display: none;
        }

        .rewards-item__container--inner::-webkit-scrollbar-track {
          background: var(--common);
        }

        .rewards-item__container--inner::-webkit-scrollbar-thumb {
          background: var(--uncommon);
        }

        .rewards-item__container--inner::-webkit-scrollbar-thumb:hover {
          background: var(--uncommon);
        }

        .icon-name {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .reward-icon {
          width: 40px;
          height: 40px;
          margin-right: 10px;
          border-radius: 50%;
        }

        .reward-name,
        .reward {
          font-size: 0.85rem;
          font-weight: 600;
          color: #fff;
          font-family: var(--font2);
        }

        .reward {
          font-size: 0.75rem;
          padding: 7.5px 15px;
          border-radius: 6px;
          text-transform: uppercase;
        } 
        

        .rewards-item__container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 7.5px 15px;
          background: #f0f0f0;
          cursor: pointer;
        }

        .common {
          background-color: var(--common);
        }

        .bg-common {
          background-color: var(--bg-common);
        }

        .uncommon {
          background-color: var(--uncommon);
        }

        .bg-uncommon {
          background-color: var(--bg-uncommon);
        }

        .rare {
          background-color: var(--rare);
        }

        .bg-rare {
          background-color: var(--bg-rare);
        }

        .legendary {
          background-color: var(--legendary);
        }

        .bg-legendary {
          background-color: var(--bg-legendary);
        }

        .divine {
          background-color: var(--divine);
        }

        .bg-divine {
          background-color: var(--bg-divine);
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
          ${
            this.state.loading
              ? html`<div>Loading...</div>`
              : html`
                  <div class="info-modal__header">
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
                      <span class="chest__title"
                        >${this.state.selectedChest.chestName}</span
                      >
                      <p class="chest__description"></p>
                      <span class="show-more">Show More</span>
                    </div>
                  </div>
                `
          }
          <div class="line"></div>
          <div class="section-title">
            <p>Reward</p>
            <p>Rarity</p>
          </div>

          <div class="rewards__container">
            <div class="rewards-list__container--outer">
            <div class="rewards-item__container--inner">
            ${
              this.state.loading && !this.state.selectedChest
                ? html`<div>Loading...</div>`
                : sortRewards(this.state.selectedChest.rewardList)
                    .map((reward: any) => {
                      return html`
                        <div
                          class="rewards-item__container bg-${reward.itemRarity.toLowerCase()}"
                        >
                          <div class="icon-name">
                            <img
                              class="reward-icon"
                              src="${urlFor(reward.rewardImage.asset._ref)
                                .width(40)
                                .height(40)
                                .url()}"
                              alt="key icon"
                            />
                            <div class="reward-name">${reward.rewardName}</div>
                          </div>
                          <div
                            class="reward ${reward.itemRarity.toLowerCase()}"
                          >
                            ${reward.itemRarity}
                          </div>
                        </div>
                      `;
                    })
                    .join('')
            }
            </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('chest-info-modal', ChestInfoModal);
