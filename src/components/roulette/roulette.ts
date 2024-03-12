import gsap from 'gsap';
import { EVENTS } from '../../constants/events';
import { html } from '../../utils/html';
import { urlFor } from '../../services/sanity';

export class Roulette extends HTMLElement {
  private state: { selectedChest: any };
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      selectedChest: null,
    };
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
    this.spin();
  }

  attachEventListeners() {
    document.addEventListener(EVENTS.CHEST_SELECTED, (event: any) => {
      this.state.selectedChest = event.detail.selectedChest;
      this.attachEventListeners();
      this.render();
      this.updateRoulette();
      this.spin();
    });
  }

  private updateRoulette(): void {
    if (!this.shadowRoot) return;
    const container = this.shadowRoot.querySelector(
      '.roulette__container',
    ) as HTMLElement;
    if (!container) return;
    let rewardItems = this.state.selectedChest.rewardList;

    container.innerHTML = '';
    const currentViewportWidth = window.innerWidth;
    const itemBoxWidth = 180;
    const itemBoxMargin = 20;
    const itemsPerRow = Math.ceil(
      currentViewportWidth / (itemBoxWidth + itemBoxMargin),
    );

    if (rewardItems.length < itemsPerRow) {
      while (rewardItems.length < itemsPerRow) {
        rewardItems = rewardItems.concat(rewardItems);
      }

      rewardItems = [...rewardItems, ...rewardItems];
    }

    rewardItems.forEach((reward: any) => {
      const rewardImageEl = document.createElement('div');
      rewardImageEl.classList.add('reward__image');
      rewardImageEl.style.backgroundImage = `url(${urlFor(reward.rewardImage.asset._ref).width(500).height(500).url()})`;

      const rewardTextContainer = document.createElement('div');
      rewardTextContainer.classList.add('text__container');

      const rewardText = document.createElement('p');
      rewardText.classList.add('reward__text');

      rewardText.innerHTML = reward.rewardName;
      rewardTextContainer.appendChild(rewardText);

      const rewardContainer = document.createElement('div');
      rewardContainer.classList.add('reward__container');
      rewardContainer.classList.add(`bg-${reward.itemRarity.toLowerCase()}`);
      rewardContainer.appendChild(rewardImageEl);
      rewardContainer.appendChild(rewardTextContainer);

      container.appendChild(rewardContainer);
    });

    if (rewardItems.length % 2 === 0) {
      container.style.transform = `translateX(-110px)`;
    }
  }

  public spin(): void {
    if (!this.shadowRoot) return;
    const rouletteContainer = this.shadowRoot.querySelector(
      '.roulette__container',
    ) as HTMLElement;
    const spinButton = this.shadowRoot.querySelector('.spin') as HTMLElement;
    if (!rouletteContainer || !spinButton) return;

    spinButton.addEventListener('click', () => {
      const items = rouletteContainer.querySelectorAll(
        '.reward__container',
      ) as NodeListOf<HTMLElement>;
      let currentPosition = 0;
      const itemWidth = items[0].offsetWidth;

      const moveRoulette = () => {
        currentPosition -= 2;

        items.forEach((item) => {
          const itemPosition = currentPosition + item.offsetLeft;
          if (itemPosition + itemWidth < 0) {
            currentPosition += itemWidth;
            rouletteContainer.appendChild(item);
          }
        });

        rouletteContainer.style.transform = `translateX(${currentPosition}px)`;

        requestAnimationFrame(moveRoulette);
      };

      moveRoulette();
    });
  }

  // private _centerPrize(
  //   container: HTMLElement,
  //   items: NodeListOf<HTMLElement>,
  // ): void {
  //   const predeterminedPrizeIndex = 2;
  //   const targetPrize = items[predeterminedPrizeIndex];

  //   const prizeCenter = targetPrize.offsetLeft + targetPrize.offsetWidth / 2;
  //   const containerCenter = container.offsetWidth / 2;
  //   const offsetToCenter = prizeCenter - containerCenter;

  //   gsap.to(container, {
  //     duration: 1,
  //     x: `-=${offsetToCenter}`,
  //     ease: 'power2.out', // Or another easing of your choice
  //     onComplete: () => {
  //       // Optional: Handle the prize selection here (display, etc.)
  //     },
  //   });
  // }

  public hide(): void {
    if (!this.shadowRoot) return;
    const roulette = this.shadowRoot.querySelector('.roulette');
    if (!roulette) return;
    gsap.to(roulette, {
      duration: 0.5,
      y: 180,
      ease: 'power1.out',
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

            --font1: 'Montserrat', sans-serif;
            --font2: 'Hind', sans-serif;
          }

          .roulette-parent__container {
            width: 100%;
            height: 100%;
            position: relative;
          }

          .spin {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
            font-size: 24px;
            font-family: var(--font1);
            font-weight: 900;
            color: #fff;
            background-color: var(--main_color);
            border: none;
            border-radius: 16px;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }

          .roulette {
            position: fixed;
            bottom: 160px;
            width: 100%;
            height: 180px;
            overflow: hidden;
          }

          .roulette__container {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            width: 100%;
          }

          .reward__container {
            width: 180px;
            height: 180px;
            margin: 0 10px;
            display: flex;
            flex-direction: column;
            background-color: #fff;
            border-radius: 16px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }

          .reward__image {
            width: 180px;
            height: 140px;
            background-size: cover;
            background-position: center;
            border-top-left-radius: 16px;
            border-top-right-radius: 16px;
          }

          .text__container {
            text-align: center;
            padding: 10px;
          }

          .reward__text {
            font-family: var(--font1);
            font-size: 16px;
            font-weight: 900;
            color: #fff;
          }

          .downwards {
            position: fixed;
            bottom: 335px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1;
          }

          .upwards {
            position: fixed;
            bottom: 145px;
            left: 50%;
            transform: translateX(-50%) rotate(180deg);
            z-index: 1;
          }

          .bg-common {
            background-color: var(--bg-common);
          }

          .bg-uncommon {
            background-color: var(--bg-uncommon);
          }

          .bg-rare {
            background-color: var(--bg-rare);
          }

          .bg-legendary {
            background-color: var(--bg-legendary);
          }

          .bg-divine {
            background-color: var(--bg-divine);
          }
      </style>
      <div class="roulette-parent__container">
        <div class="winning__container">
          <img class="downwards" src="/icons/svg/white_caret.svg" alt="icon" />
          <img class="upwards" src="/icons/svg/white_caret.svg" alt="icon" />
        </div>
        <div class="roulette">
          <div class="roulette__container"></div>
          <div type="button" class="spin" id="spin-button">Spin</div>
        </div>
      </div>
    `;
  }
}

customElements.define('roulette-component', Roulette);
