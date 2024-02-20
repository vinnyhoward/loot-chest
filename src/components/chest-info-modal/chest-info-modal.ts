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
    this.attachEventListeners();
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
      this.selectedChest = event.detail.selectedChest;
      this.state.loading = false;

      this.render();
      this.attachEventListeners();
      this.attachListeners();
      this.updateDescription();
    });
  }

  public show() {
    if (!this.shadowRoot) return;
    gsap.to(this, { duration: 0.5, opacity: 1, display: 'block' });
  }

  public hide() {
    console.log('hiding');
    if (!this.shadowRoot) return;
    gsap.to(this, { duration: 0.5, opacity: 0, display: 'none' });
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
  }

  public render() {
    console.log('state', this.state.selectedChest.rewardList);
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = html`
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;

          --common: #5e98d9;
          --uncommon: #4b69ff;
          --rare: #8847ff;
          --legendary: #d32ee6;
          --divine: #f8ae39;
        }

        .info-modal {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .info-modal__container {
          position: relative;
          background-color: #fff;
          width: 350px;
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
          font-family: 'Hind', sans-serif;
          text-align: left;
          height: 50px;
          margin: 10px 0px 10px 0px;
        }

        .show-more {
          font-size: 0.8rem;
          font-weight: 500;
          color: #dedede;
          font-family: 'Hind', sans-serif;
          cursor: pointer;
        }

        .section-title {
          display: flex;
          justify-content: space-around;
          font-size: 0.8rem;
          font-weight: 500;
          color: #dedede;
          font-family: 'Hind', sans-serif;
          margin: 7.5px 0;
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
          background: --var(--common);
        }

        .rewards-item__container--inner::-webkit-scrollbar-thumb {
          background: --var(--uncommon);
        }

        .rewards-item__container--inner::-webkit-scrollbar-thumb:hover {
          background: --var(--uncommon);
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
        .quantity {
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          font-family: 'Hind', sans-serif;
        }

        .rewards-item__container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 7.5px 15px;
          background: #f0f0f0;
          border: 0.5px solid #fff;
          cursor: pointer;
        }

        .common {
          background-color: var(--common);
          border: 2px solid #407BBD;
          border-bottom: none;
        }

        .common:first-child {
          border-top: 2px solid #407BBD;
          border-top-left-radius: 16px;
          border-top-right-radius: 16px;
        }


        .uncommon {
          background-color: var(--uncommon);
          border: 2px solid #2D4AD9;
          border-bottom: none;
        }

        .rare {
          background-color: var(--rare);
          border: 2px solid #6339B0;
          border-bottom: none;
        }

        .legendary {
          background-color: var(--legendary);
          border: 2px solid #9C22AB;
          border-bottom: none;
        }

        .divine {
          background-color: var(--divine);
          border: 2px solid #B37E2B;
          border-bottom: none;
        }

        .divine:last-child {
          border-bottom: 2px solid #B37E2B;
          border-bottom-left-radius: 16px;
          border-bottom-right-radius: 16px;
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
            <p>Quantity</p>
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
                          class="rewards-item__container ${reward.itemRarity.toLowerCase()}"
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
                          <div class="quantity">x${reward.itemInventory}</div>
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

// <div class="rewards-item__container--inner">
// <div class="rewards-item__container common">
//   <div class="icon-name">
// <img
//   class="reward-icon"
//   src="icons/png/key_icon.png"
//   alt="key icon"
// />
//     <div class="reward-name">Edenhorde #602</div>
//   </div>
//   <div class="quantity">1</div>
// </div>

// <div class="rewards-item__container uncommon">
//   <div class="icon-name">
//     <img
//       class="reward-icon"
//       src="icons/png/key_icon.png"
//       alt="key icon"
//     />
//     <div class="reward-name">Edenhorde #602</div>
//   </div>
//   <div class="quantity">1</div>
// </div>

// <div class="rewards-item__container rare">
//   <div class="icon-name">
//     <img
//       class="reward-icon"
//       src="icons/png/key_icon.png"
//       alt="key icon"
//     />
//     <div class="reward-name">Edenhorde #602</div>
//   </div>
//   <div class="quantity">1</div>
// </div>

// <div class="rewards-item__container legendary">
//   <div class="icon-name">
//     <img
//       class="reward-icon"
//       src="icons/png/key_icon.png"
//       alt="key icon"
//     />
//     <div class="reward-name">Edenhorde #602</div>
//   </div>
//   <div class="quantity">1</div>
// </div>

// <div class="rewards-item__container divine">
//   <div class="icon-name">
//     <img
//       class="reward-icon"
//       src="icons/png/key_icon.png"
//       alt="key icon"
//     />
//     <div class="reward-name">Edenhorde #602</div>
//   </div>
//   <div class="quantity">1</div>
// </div>

// ${
//   this.state.loading
//     ? html`<div>Loading...</div>`
//     : this.state.selectedChest.rewardList.map((reward: any) => {
//         return html`
//           <div
//             class="rewards-item__container ${reward.itemRarity.toLowerCase()}"
//           >
//             <div class="icon-name">
//               <img
//                 class="reward-icon"
//                 src="${urlFor(
//                   this.state.selectedChest.rewardImage.asset._ref,
//                 )
//                   .width(40)
//                   .height(40)
//                   .url()}"
//                 alt="key icon"
//               />
//               <div class="reward-name">${reward.rewardName}</div>
//             </div>
//             <div class="quantity">${reward.quantity}</div>
//           </div>
//         `;
//       })
// }
