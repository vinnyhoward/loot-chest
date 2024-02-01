import gsap from 'gsap';
import { html } from '../utils/html';

export default class LoadingBar {
  private loadingBarElement: HTMLElement | null;
  private loadingBarContainerElement: HTMLElement | null;

  constructor() {
    this.loadingBarElement = document.querySelector('.loading-bar');
    this.loadingBarContainerElement = document.querySelector(
      '.loading-bar-container',
    );
  }

  public showLoadingScreen(): void {
    if (this.loadingBarElement && this.loadingBarContainerElement) {
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
  }

  public hideLoadingScreen(): void {
    window.setTimeout(() => {
      if (this.loadingBarElement && this.loadingBarContainerElement) {
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
      }
    }, 2000);
  }

  public updateLoadingBar(progressRatio: number): void {
    if (this.loadingBarElement) {
      this.loadingBarElement.style.width = `${progressRatio}%`;
    }
  }

  public render(): string {
    return html`
      <div class="loading-bar-container">
        <div class="loading-bar"></div>
        <span class="percentage"></span>
      </div>
    `;
  }
}
