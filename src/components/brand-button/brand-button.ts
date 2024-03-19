import gsap from 'gsap';
import { html } from '../../utils/html';
import { ButtonProps } from '../../types';

export class BrandButton extends HTMLElement {
  private state: ButtonProps;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      buttonTitle: '',
      buttonType: 'button',
      buttonColor: 'var(--main-color)',
      textColor: '#ffffff',
      buttonAction: () => {},
      loading: false,
    };
  }

  set buttonValues(values: ButtonProps) {
    this.state = { ...this.state, ...values };
    this.updateButton();
  }

  get buttonValues(): ButtonProps {
    return this.state;
  }

  set loading(isLoading: boolean) {
    this.state.loading = isLoading;
    this.updateButton();
  }

  updateButton() {
    if (!this.shadowRoot) return;
    const buttonElement = this.shadowRoot.querySelector('button');
    if (buttonElement) {
      buttonElement.innerText = this.state.loading
        ? 'Loading...'
        : this.state.buttonTitle;
      buttonElement.setAttribute('type', this.state.buttonType);
      buttonElement.style.backgroundColor = this.state.buttonColor;
      buttonElement.style.color = this.state.textColor;

      if (this.currentButtonAction) {
        buttonElement.removeEventListener('click', this.currentButtonAction);
      }
      if (!this.state.loading) {
        this.currentButtonAction = this.state.buttonAction;
        buttonElement.addEventListener('click', this.currentButtonAction);
      }
    }
  }

  connectedCallback(): void {
    this.render();
  }

  disconnectedCallback(): void {
    if (!this.shadowRoot) return;
    const buttonElement = this.shadowRoot.querySelector(
      'button',
    ) as HTMLButtonElement;
    if (buttonElement) {
      buttonElement.removeEventListener('click', this.state.buttonAction);
    }
  }

  private currentButtonAction: (() => void) | null = null;

  public show(): void {
    gsap.to(this, { duration: 0.5, opacity: 1, display: 'block' });
  }

  public hide(): void {
    gsap.to(this, { duration: 0.5, opacity: 0, display: 'none' });
  }

  render() {
    if (!this.shadowRoot) return;
    let buttonElement = this.shadowRoot.querySelector('button');
    if (!buttonElement) {
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

          button {
            cursor: pointer;
            width: 100%;
            height: 50px;
            border: none;
            border-radius: 8px;
            background-color: #974af4;
            color: white;
            font-family: var(--font1);
            font-weight: 600;
            font-style: normal;
            font-size: 14px;
            cursor: pointer;
            text-transform: uppercase;
          }
        </style>
        <button></button>
      `;
      buttonElement = this.shadowRoot.querySelector('button');
    }
    this.updateButton();
  }
}

customElements.define('brand-button', BrandButton);
