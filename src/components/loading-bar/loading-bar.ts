import gsap from 'gsap';
import { html } from '../../utils/html';
import { EVENTS } from '../../constants/events';

export default class LoadingBar extends HTMLElement {
  private loadingBarElement: HTMLElement | null;
  private loadingBarContainerElement: HTMLElement | null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.loadingBarElement = null;
    this.loadingBarContainerElement = null;
  }

  connectedCallback(): void {
    this.render();

    document.addEventListener(
      EVENTS.LOADING_PROGRESS,
      this.handleLoadingProgress.bind(this),
    );

    document.addEventListener(
      EVENTS.SHOW_LOADING,
      this.showLoadingScreen.bind(this),
    );
    document.addEventListener(
      EVENTS.HIDE_LOADING,
      this.hideLoadingScreen.bind(this),
    );
  }

  public handleLoadingProgress(event: any): void {
    const { progressRatio } = event.detail;
    this.updateLoadingBar(progressRatio);
  }

  public showLoadingScreen(): void {
    if (!this.shadowRoot) return;

    this.loadingBarElement = this.shadowRoot.querySelector('.loading-bar');
    this.loadingBarContainerElement = this.shadowRoot.querySelector(
      '.loading-bar-container',
    );

    gsap.to(this.loadingBarElement, {
      duration: 0.25,
      opacity: 1,
      delay: 0.25,
      display: 'block',
    });
    gsap.to(this.loadingBarContainerElement, {
      duration: 0.25,
      opacity: 1,
      delay: 0.25,
      display: 'block',
    });
  }

  public hideLoadingScreen(): void {
    if (!this.shadowRoot) return;

    this.loadingBarElement = this.shadowRoot.querySelector('.loading-bar');
    this.loadingBarContainerElement = this.shadowRoot.querySelector(
      '.loading-bar-container',
    );

    window.setTimeout(() => {
      gsap.to(this.loadingBarElement, {
        duration: 2,
        opacity: 0,
        delay: 0,
        display: 'none',
      });
      gsap.to(this.loadingBarContainerElement, {
        duration: 2,
        opacity: 0,
        delay: 0,
        display: 'none',
      });
    }, 2000);
  }

  public updateLoadingBar(progressRatio: number): void {
    if (!this.shadowRoot) return;

    this.loadingBarElement = this.shadowRoot.querySelector('.loading-bar');
    if (this.loadingBarElement) {
      this.loadingBarElement.style.width = `${progressRatio}%`;
    }
  }

  public show(): void {
    gsap.to(this, {
      opacity: 1,
      display: 'block',
      duration: 0.5,
    });
  }

  public hide(): void {
    gsap.to(this, {
      opacity: 0,
      display: 'none',
      duration: 0.5,
    });
  }

  private render(): void {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = html`
      <style>
        .loading-bar-container {
          --main-color: #8847ff;
          --main-color-gradient: linear-gradient(
            120deg,
            #8847ff 0%,
            #a06cff 100%
          );

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

          --text-color: white;
          --bar-wrap-back-color: rgba(166, 166, 166, 0.2);

          position: absolute;
          right: 50%;
          top: 50%;
          transform: translate(50%, -50%);
          width: 50%;

          border-radius: 100px;
          background-color: var(--bar-wrap-back-color);
          padding: 4px;
          margin-top: 10px;
        }

        .loading-bar-container .loading-bar {
          background: var(--main-color-gradient);
          border-radius: 100px;
          height: 12px;
          transition: width 0.15s ease-out;
          width: 0%;
        }

        .loading-bar-container .percentage {
          align-self: center;
          color: var(--text-color);
          margin: 10px 0 25px;
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
        }
      </style>
      <div class="loading-bar-container">
        <div class="loading-bar"></div>
        <span class="percentage"></span>
      </div>
    `;
  }
}

customElements.define('loading-bar', LoadingBar);
