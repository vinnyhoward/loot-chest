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
      console.log('selected chest: ', this.state.selectedChest);
      this.updateRoulette();
    });
  }

  private updateRoulette(): void {
    if (!this.shadowRoot) return;
    const container = this.shadowRoot.querySelector('.roulette__container');
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    // Append two sets of rewards for the loop effect
    const rewards = [
      ...this.state.selectedChest.rewardList,
      ...this.state.selectedChest.rewardList,
    ];
    rewards.forEach((reward: any) => {
      const rewardElement = document.createElement('div');
      rewardElement.classList.add('roulette__reward-image');
      rewardElement.style.backgroundImage = `url(${urlFor(reward.rewardImage.asset._ref).width(500).height(500).url()})`;
      container.appendChild(rewardElement);
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

        .roulette__reward-image {
          width: 180px;
          height: 180px;
          background-size: cover;
          background-position: center;
          border-radius: 16px;
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
