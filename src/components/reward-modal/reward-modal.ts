import gsap from 'gsap';
import { html } from '../../utils/html';
import { EVENTS } from '../../constants/events';

declare global {
  interface Window {
    experience: any;
  }
}

enum RewardModalEvents {
  SHOW,
  CLAIM,
  SUCCESSFULLY_CLAIMED,
  FAILED_CLAIM,
}

export class RewardModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback(): void {
    this.render();
    this.attachEventListeners();
    this.attachListeners();
  }

  attachEventListeners(): void {}

  attachListeners(): void {}

  hide(): void {
    if (!this.shadowRoot) return;
    gsap.to(this, {
      opacity: 0,
      display: 'none',
      duration: 0.5,
      ease: 'power1.out',
    });
  }

  show(): void {
    if (!this.shadowRoot) return;
    gsap.to(this, {
      opacity: 1,
      display: 'block',
      duration: 0.5,
      ease: 'power1.out',
    });
  }

  render(): void {
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

          --common: #5e98d9;
          --uncommon: #4b69ff;
          --rare: #8847ff;
          --legendary: #d32ee6;
          --divine: #f8ae39;
          --font1: 'Montserrat', sans-serif;
          --font2: 'Hind', sans-serif;
        }
        .reward-modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 100;
          justify-content: center;
          align-items: center;
          display: flex;
        }

        .reward-modal__content {
          background-color: #fff;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
        }
      </style>
      <div class="reward-modal">
        <div class="reward-modal__content">
          <h1>🎉 Congratulations! 🎉</h1>
          <p>You've earned a reward!</p>
          <button>Claim Reward</button>
        </div>
      </div>
    `;
  }
}

customElements.define('reward-modal', RewardModal);
