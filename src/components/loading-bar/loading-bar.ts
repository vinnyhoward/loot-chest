import gsap from 'gsap';
import { html } from '../../utils/html';

export default class LoadingBar extends HTMLElement {
  private loadingBarElement: HTMLElement;
  private loadingBarContainerElement: HTMLElement;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.loadingBarContainerElement = this.shadowRoot!.appendChild(
      document.createElement('div'),
    );
    this.loadingBarContainerElement.className = 'loading-bar-container';

    this.loadingBarElement = this.loadingBarContainerElement.appendChild(
      document.createElement('div'),
    );
    this.loadingBarElement.className = 'loading-bar';
  }

  connectedCallback(): void {
    this.render();
    this.showLoadingScreen();
  }

  public showLoadingScreen(): void {
    gsap.to(this.loadingBarElement, {
      duration: 0.25,
      opacity: 1,
      delay: 0.25,
    });
    gsap.to(this.loadingBarContainerElement, {
      duration: 0.25,
      opacity: 1,
      delay: 0.25,
    });
  }

  public hideLoadingScreen(): void {
    window.setTimeout(() => {
      gsap.to(this.loadingBarElement, {
        duration: 2,
        opacity: 0,
        delay: 0,
      });
      gsap.to(this.loadingBarContainerElement, {
        duration: 2,
        opacity: 0,
        delay: 0,
      });
    }, 2000);
  }

  public updateLoadingBar(progressRatio: number): void {
    this.loadingBarElement.style.width = `${progressRatio}%`;
  }

  private render(): void {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = html`
      <style>
        .loading-bar-container {
          --bar-color: #d52c3a;
          --body-color: #222;
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
          background: linear-gradient(90deg, #d52c3a 0%, #ff2839 100%);
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
