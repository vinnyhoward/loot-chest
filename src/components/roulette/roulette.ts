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
  }

  attachEventListeners() {
    document.addEventListener(EVENTS.CHEST_SELECTED, (event: any) => {
      this.state.selectedChest = event.detail.selectedChest;
      this.attachEventListeners();
      this.render();
      this.updateRoulette();
      this.horizontalScrolling();
    });
  }

  private updateRoulette(): void {
    if (!this.shadowRoot) return;
    const container = this.shadowRoot.querySelector('.roulette__container');
    if (!container) return;

    container.innerHTML = '';

    const rewards = [
      ...this.state.selectedChest.rewardList,
      ...this.state.selectedChest.rewardList,
    ];
    rewards.forEach((reward: any) => {
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
  }

  public horizontalScrolling(): void {
    if (!this.shadowRoot) return;
    const container = this.shadowRoot.querySelector(
      '.roulette__container',
    ) as HTMLElement;
    if (!container) return;

    // Ensure the container is full of duplicated rewards for a seamless loop
    // Note: You might already be doing this in updateRoulette, just ensure there's enough content to scroll through

    // Calculate the width to scroll before resetting (width of a single set of rewards)
    const scrollWidth = container.scrollWidth / 2; // Assuming you've duplicated the rewards exactly once

    // Use GSAP to animate the scroll
    gsap.to(container, {
      x: () => `-${scrollWidth}px`, // Move to the end of the first set of rewards
      ease: 'linear', // Use a linear ease for consistent speed
      duration: 10, // Duration before the loop resets
      repeat: -1, // Infinite repeats
      onRepeat: () => {
        // Instantly reset the position to the start without the user noticing
        gsap.set(container, { x: 0 });
      },
    });
  }

  public show(): void {
    if (!this.shadowRoot) return;
    const roulette = this.shadowRoot.querySelector('.roulette');
    if (!roulette) return;
    gsap.to(roulette, {
      duration: 0.5,
      y: 0,
      ease: 'power1.out',
    });
  }

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
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Hind:wght@300;400;500;600;700&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

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
      <div class="roulette">
        <div class="roulette__container">
          <div class="roulette__image"></div>
        </div>
      </div>
    `;
  }
}

customElements.define('roulette-component', Roulette);
