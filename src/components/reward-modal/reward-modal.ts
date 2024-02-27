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
}

export class RewardModal extends HTMLElement {
  private state: {
    reward: any;
    rewardState: RewardModalState;
    formError: string;
  };

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      reward: mockRewardData[0],
      rewardState: RewardModalState.SHOW,
      formError: '',
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
    // gsap.to(this, { opacity: 0, display: 'none' });
  }

  private attachEventListeners(): void {
    const form = this.shadowRoot?.querySelector('.reward__form');
    form?.addEventListener('submit', this.onSubmit);

    const closeButton = this.shadowRoot?.querySelector('.close__icon');
    closeButton?.addEventListener('click', this.hide.bind(this));
  }

  private async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.state.rewardState === RewardModalState.SUCCESSFULLY_CLAIMED) {
      return this.hide();
    }

    const errorMessage = this.shadowRoot?.querySelector(
      '.error__message',
    ) as HTMLElement;
    errorMessage.style.display = 'block';
    errorMessage.textContent = '';

    if (this.state.rewardState === RewardModalState.SHOW) {
      this.state.rewardState = RewardModalState.CLAIM;
      return this.updateContent();
    }

    if (this.state.rewardState === RewardModalState.CLAIM) {
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
        prizeLogId: 'clszs5ddj000m6mw2f3wcsao5',
        sanityRewardId: 'd05933df3d49',
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

      const userFulfilledPrize = savePrize(formFields);
      const responseData = await userFulfilledPrize;
      console.log('User fulfilled prize:', responseData);
      if (!responseData) {
        const errorMessage = this.shadowRoot?.querySelector(
          '.error__message',
        ) as HTMLElement;
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Something went wrong while claiming prize!';
      } else {
        this.state.rewardState = RewardModalState.SUCCESSFULLY_CLAIMED;
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
        rewardHeadline.textContent = 'Congratulations';
        rewardHeadline.style.color = 'var(--font-color)';
        break;
      case RewardModalState.CLAIM:
        rewardHeadline.textContent = 'Fill out the form to claim your prize';
        rewardHeadline.style.color = '#FFFFFF';
        rewardHeadline.style.fontSize = '1.2rem';
        rewardHeadline.style.textAlign = 'left';
        rewardHeadline.style.textTransform = 'none';
        break;
      case RewardModalState.SUCCESSFULLY_CLAIMED:
        rewardHeadline.textContent = "You've successfully claimed your prize!";
        rewardHeadline.style.color = '#FFFFFF';
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
        rewardCaption.style.color = 'var(--font-color)';
        rewardCaption.style.display = 'block';
        break;
      case RewardModalState.CLAIM:
        rewardCaption.textContent = '';
        rewardCaption.style.color = '#FFFFFF';
        rewardCaption.style.display = 'none';
        break;
      case RewardModalState.SUCCESSFULLY_CLAIMED:
        rewardCaption.textContent =
          'You have successfully claimed your reward!';
        rewardCaption.style.color = '#FFFFFF';
        rewardCaption.style.display = 'block';
        break;
      default:
        break;
    }
  }

  private updateClaimButtonText(): void {
    const claimButtonText = this.shadowRoot?.querySelector(
      '.claim__text',
    ) as HTMLElement;
    const claimButton = this.shadowRoot?.querySelector(
      '.claim__button',
    ) as HTMLButtonElement;

    switch (this.state.rewardState) {
      case RewardModalState.SHOW:
        claimButtonText.textContent = 'Claim your reward';
        claimButtonText.style.color = '#FFFFFF';
        break;
      case RewardModalState.CLAIM:
        claimButtonText.textContent = 'Claim your reward';
        break;
      case RewardModalState.SUCCESSFULLY_CLAIMED:
        claimButtonText.textContent = 'Close';
        claimButtonText.style.color = 'var(--font-color)';
        claimButton.style.backgroundColor = '#FFFFFF';
        break;
      default:
        break;
    }
  }

  private updateContent(): void {
    this.updateHeadlineText();
    this.updateCaptionText();
    this.updateClaimButtonText();

    const hexImage = this.shadowRoot?.querySelector(
      '.hexagon-image',
    ) as HTMLImageElement;
    const headerImage = this.shadowRoot?.querySelector(
      '.reward__image',
    ) as HTMLImageElement;
    const containerBackground = this.shadowRoot?.querySelector(
      '.reward-modal__background',
    ) as HTMLElement;
    const claimButton = this.shadowRoot?.querySelector(
      '.claim__button',
    ) as HTMLButtonElement;
    const contentContainer = this.shadowRoot?.querySelector(
      '.content__container',
    ) as HTMLElement;

    if (this.state.rewardState == RewardModalState.SUCCESSFULLY_CLAIMED) {
      headerImage.style.display = 'none';
      hexImage.style.display = 'block';
      hexImage.style.backgroundImage = `url(${urlFor(
        this.state.reward.rewardImage.asset._ref,
      )
        .width(500)
        .height(500)
        .url()})`;
      containerBackground.style.height = '100%';
      containerBackground.style.borderRadius = '24px';
    } else if (this.state.rewardState !== RewardModalState.SHOW) {
      hexImage.style.display = 'none';
      headerImage.style.display = 'block';
      containerBackground.style.height = '135px';
      contentContainer.style.marginBottom = '40px';
    } else {
      hexImage.style.display = 'block';
      hexImage.style.backgroundImage = `url(${urlFor(
        this.state.reward.rewardImage.asset._ref,
      )
        .width(500)
        .height(500)
        .url()})`;
      headerImage.style.display = 'none';
      contentContainer.style.marginBottom = '0px';
      containerBackground.style.display = 'block';
      containerBackground.style.height = '40%';
      containerBackground.style.borderTopLeftRadius = '24px';
      containerBackground.style.borderTopRightRadius = '24px';
      containerBackground.style.borderBottomLeftRadius = '0px';
      containerBackground.style.borderBottomRightRadius = '0px';
      containerBackground.classList.add(
        `gradient-${this.state.reward.itemRarity.toLowerCase()}`,
      );
      claimButton.classList.add(
        `gradient-${this.state.reward.itemRarity.toLowerCase()}`,
      );
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
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Hind:wght@300;400;500;600;700&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;

          --main-color: #8847ff;
          --common: #5e98d9;
          --uncommon: #4b69ff;
          --rare: #8847ff;
          --legendary: #d32ee6;
          --divine: #f8ae39;

          --gradient-main-color: linear-gradient(#8847ff, #9f6bff);
          --gradient-common: linear-gradient(#5e98d9, #7eace0);
          --gradient-uncommon: linear-gradient(#4b69ff, #6f87ff);
          --gradient-rare: linear-gradient(#8847ff, #9f6bff);
          --gradient-legendary: linear-gradient(#d32ee6, #db57eb);
          --gradient-divine: linear-gradient(#f8ae39, #f9be60);

          --font1: 'Montserrat', sans-serif;
          --font2: 'Hind', sans-serif;
          --font-color: #25314c;
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
          z-index: 100;
          justify-content: center;
          align-items: center;
          display: flex;
        }

        .reward-modal__content {
          position: relative;
          background-color: #fff;
          padding: 10px;
          border-radius: 24px;
          text-align: center;
          width: 375px;
          padding: 20px;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
        }

        .reward-modal__background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 40%;
          background-color: #8847ff;
          border-top-left-radius: 24px;
          border-top-right-radius: 24px;
        }

        .reward-modal__inner {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .claim__button {
          background-color: var(--main-color);
          border-radius: 10px;
          color: #fff;
          cursor: pointer;
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
          margin-bottom: 5px;
        }

        .caption-text {
          font-family: var(--font2);
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 20px;
        }

        .input__container {
          display: flex;
          flex-direction: column;
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

        .error__message {
          color: red;
          margin-bottom: 20px;
          font-family: 'Hind', sans-serif;
          font-weight: 400;
          font-style: normal;
          font-size: 14px;
          display: none;
        }

        .close-icon__container {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: flex-end;
        }

        .close__icon {
          width: 15px;
          height: 15px;
          z-index: 1000;
          cursor: pointer;
        }

        .reward__form {
          width: 100%;
        }

        .hexagon-image {
          width: 220px;
          height: 250px;
          background-size: cover;
          background-position: center;
          -webkit-mask-image: url('mask/hexagon_mask.png');
          mask-image: url('mask/hexagon_mask.png');
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
          margin-bottom: 20px;
          filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.5));
        }

        .text__container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        .content__container {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        .reward__image {
          border-radius: 50%;
          height: 85px;
          width: 85px;
          margin-right: 10px;
          box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.25);
          display: none;
        }

        .gradient-common {
          background: var(--gradient-common);
        }
        .gradient-uncommon {
          background: var(--gradient-uncommon);
        }
        .gradient-rare {
          background: var(--gradient-rare);
        }
        .gradient-legendary {
          background: var(--gradient-legendary);
        }
        .gradient-divine {
          background: var(--gradient-divine);
        }
      </style>

      <div class="reward-modal">
        <div class="reward-modal__content">
          <div class="close-icon__container">
            <img
              class="close__icon"
              src="icons/svg/close_white.svg"
              alt="close icon"
            />
          </div>
          <div class="reward-modal__background"></div>
          <div class="reward-modal__inner">
            <div class="hexagon-image"></div>

            <div class="content__container">
              <img
                class="reward__image"
                src=${urlFor(this.state.reward.rewardImage.asset._ref)
                  .width(500)
                  .height(500)
                  .url()}
                alt="reward image"
              />
              <div class="text__container">
                <h1 class="headline-text"></h1>
                <p class="caption-text"></p>
              </div>
            </div>

            <form class="reward__form">
              <div class="input__container"></div>

              <div class="error__message"></div>
              <button type="submit" class="claim__button">
                <div class="claim__text"></div>
              </button>
            </form>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('reward-modal', RewardModal);
