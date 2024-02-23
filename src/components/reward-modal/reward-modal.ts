import gsap from 'gsap';
import { html } from '../../utils/html';
import { urlFor } from '../../services/sanity';
import { EVENTS } from '../../constants/events';
import { mockRewardData } from '../../constants/mockData';
import { camelToSentenceCase } from '../../utils/camelToSentenceCase';
import { savePrize } from '../../services/prizes';
import { PrizeFields } from '../../types';

declare global {
  interface Window {
    experience: any;
  }
}

enum RewardModalState {
  SHOW,
  CLAIM,
  SUCCESSFULLY_CLAIMED,
  FAILED_CLAIM,
}

export class RewardModal extends HTMLElement {
  private state: {
    reward: any;
    rewardState: RewardModalState;
  };

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      reward: mockRewardData[0],
      rewardState: RewardModalState.CLAIM,
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  set reward(data) {
    this.state.reward = data;
    this.state.rewardState = RewardModalState.SHOW;

    this.render();
    this.updateContent();
    this.attachEventListeners();
  }

  get reward() {
    return this.state.reward;
  }

  connectedCallback(): void {
    this.render();
    this.updateContent();
    this.attachEventListeners();
  }

  private attachEventListeners(): void {
    const form = this.shadowRoot?.querySelector('.reward__form');
    form?.addEventListener('submit', this.onSubmit);
  }

  private onSubmit(event: Event): void {
    event.preventDefault();

    if (this.state.rewardState === RewardModalState.SHOW) {
      this.state.rewardState = RewardModalState.CLAIM;
      this.updateContent();
    }

    if (this.state.rewardState === RewardModalState.CLAIM) {
      this.state.rewardState = RewardModalState.SUCCESSFULLY_CLAIMED;
      const target = event.target as HTMLFormElement;
      const formData = new FormData(target);

      const firstName: FormDataEntryValue | null = formData.get('firstName');
      const lastName: FormDataEntryValue | null = formData.get('lastName');
      const phoneNumber: FormDataEntryValue | null =
        formData.get('phoneNumber');
      const email: FormDataEntryValue | null = formData.get('email');
      const address: FormDataEntryValue | null = formData.get('address');
      const country: FormDataEntryValue | null = formData.get('country');
      const state: FormDataEntryValue | null = formData.get('state');
      const city: FormDataEntryValue | null = formData.get('city');
      const zip: FormDataEntryValue | null = formData.get('zip');
      const cryptoWalletAddress: FormDataEntryValue | null = formData.get(
        'cryptoWalletAddress',
      );

      const formFields: PrizeFields = {
        firstName: firstName as string,
        lastName: lastName as string,
        phoneNumber: phoneNumber as string,
        email: email as string,
        address: address as string,
        country: country as string,
        state: state as string,
        city: city as string,
        zip: zip as string,
        cryptoWalletAddress: cryptoWalletAddress as string,
      };
      try {
        const userFulfilledPrize = savePrize(formFields);
        console.log('User fulfilled prize:', userFulfilledPrize);
      } catch (error) {
        this.state.rewardState = RewardModalState.FAILED_CLAIM;
        this.updateContent();
        console.error('Failed to claim prize:', error);
      }
    }
  }

  public hide(): void {
    if (!this.shadowRoot) return;
    gsap.to(this, {
      opacity: 0,
      display: 'none',
      duration: 0.5,
      ease: 'power1.out',
    });
  }

  public show(): void {
    if (!this.shadowRoot) return;
    gsap.to(this, {
      opacity: 1,
      display: 'block',
      duration: 0.5,
      ease: 'power1.out',
    });
  }

  private updateHeadlineText(): void {
    const rewardHeadline = this.shadowRoot?.querySelector(
      '.headline-text',
    ) as HTMLElement;

    switch (this.state.rewardState) {
      case RewardModalState.SHOW:
        rewardHeadline.textContent = '🎉 Congratulations! 🎉';
        break;
      case RewardModalState.CLAIM:
        rewardHeadline.textContent = '🎉 Congratulations! 🎉';
        break;
      case RewardModalState.SUCCESSFULLY_CLAIMED:
        rewardHeadline.textContent =
          "🎉 You've successfully claimed your prize! 🎉";
        break;
      case RewardModalState.FAILED_CLAIM:
        rewardHeadline.textContent = 'Something went wrong! 😢';
        break;
      default:
        break;
    }
  }

  private updateCaptionText(): void {
    const rewardCaption = this.shadowRoot?.querySelector(
      '.caption-text',
    ) as HTMLElement;

    switch (this.state.rewardState) {
      case RewardModalState.SHOW:
        rewardCaption.textContent = 'You have earned a reward!';
        break;
      case RewardModalState.CLAIM:
        rewardCaption.textContent = 'You have earned a reward!';
        break;
      case RewardModalState.SUCCESSFULLY_CLAIMED:
        rewardCaption.textContent =
          'You have successfully claimed your reward!';
        break;
      case RewardModalState.FAILED_CLAIM:
        rewardCaption.textContent =
          'Something went wrong while claiming your reward!';
        break;
      default:
        break;
    }
  }

  private updateClaimButtonText(): void {
    const claimButton = this.shadowRoot?.querySelector(
      '.claim__text',
    ) as HTMLElement;

    switch (this.state.rewardState) {
      case RewardModalState.SHOW:
        claimButton.textContent = 'Claim your reward';
        break;
      case RewardModalState.CLAIM:
        claimButton.textContent = 'Claim your reward';
        break;
      case RewardModalState.SUCCESSFULLY_CLAIMED:
        claimButton.textContent = 'Close';
        break;
      case RewardModalState.FAILED_CLAIM:
        claimButton.textContent = 'Close';
        break;
      default:
        break;
    }
  }

  private updateContent(): void {
    this.updateHeadlineText();
    this.updateCaptionText();
    this.updateClaimButtonText();

    const image = this.shadowRoot?.querySelector(
      '.reward-image',
    ) as HTMLImageElement;
    if (this.state.rewardState === RewardModalState.CLAIM) {
      image.style.display = 'none';
    } else {
      image.style.display = 'block';
    }

    if (
      this.state.reward.formFields &&
      this.state.rewardState === RewardModalState.CLAIM
    ) {
      const inputContainer = this.shadowRoot?.querySelector(
        '.input__container',
      ) as HTMLElement;

      for (const field of this.state.reward.formFields) {
        const input = document.createElement('input');
        input.setAttribute('placeholder', camelToSentenceCase(field));
        input.classList.add('input_field');
        input.id = field;
        input.type = 'text';
        input.name = field;
        inputContainer.appendChild(input);
      }
    }
  }

  public render(): void {
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
          --common: #5e98d9;
          --uncommon: #4b69ff;
          --rare: #8847ff;
          --legendary: #d32ee6;
          --divine: #f8ae39;
          --font1: 'Montserrat', sans-serif;
          --font2: 'Hind', sans-serif;
        }

        button {
          outline: none;
          border: none;
          margin: 0;
          padding: 0;
          width: auto;
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
          width: 400px;
        }

        .claim__button {
          background-color: var(--main_color);
          border-radius: 10px;
          padding: 10px 20px;
          color: #fff;
          cursor: pointer;
          margin-top: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 50px;
          width: 100%;
        }

        .claim__text {
          font-family: var(--font1);
          font-size: 1rem;
          font-weight: bold;
          text-transform: uppercase;
        }

        .headline-text {
          font-family: var(--font1);
          font-size: 1.5rem;
          font-weight: bold;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .caption-text {
          font-family: var(--font2);
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 20px;
        }

        .reward-image {
          width: 100%;
          height: auto;
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .input__container {
          display: flex;
          flex-direction: column;
          margin-bottom: 20px;
        }

        .input_field {
          width: 100%;
          border: 1px solid #e9e9e9;
          border-radius: 8px;
          height: 50px;
          background-color: #fbfbfb;
          margin: 0;
          padding: 0;
          margin-bottom: 15px;

          font-family: 'Hind', sans-serif;
          font-weight: 400;
          font-style: normal;
          color: #25314c;
          font-size: 14px;
          padding: 10px;
          padding-left: 20px;
        }

        .input_field::placeholder {
          color: #acbcc0;
          font-family: 'Hind', sans-serif;
          font-weight: 400;
          font-style: normal;
          font-size: 14px;
        }

        .input_field:focus {
          outline: none;
        }
      </style>

      <div class="reward-modal">
        <div class="reward-modal__content">
          <img
            class="reward-image"
            src="${urlFor(this.state.reward.rewardImage.asset._ref)
              .width(500)
              .height(500)
              .url()}"
            alt="Chest"
          />
          <h1 class="headline-text"></h1>
          <p class="caption-text"></p>

          <form class="reward__form">
            <div class="input__container"></div>

            <button type="submit" class="claim__button">
              <div class="claim__text"></div>
            </button>
          </form>
        </div>
      </div>
    `;
  }
}

customElements.define('reward-modal', RewardModal);
