import gsap from 'gsap';
import { html } from '../utils/html';

export default class LoadingBar {
  constructor() {
    this.loadingBarElement = document.querySelector('.loading-bar');
    this.loadingBarContainerElement = document.querySelector(
      '.loading-bar-container',
    );
  }

  showLoadingScreen() {
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

  hideLoadingScreen() {
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

  updateLoadingBar(progressRatio) {
    this.loadingBarElement.style.width = `${progressRatio}%`;
  }

  render() {
    return html`
      <div class="loading-bar-container">
        <div class="loading-bar"></div>
        <span class="percentage"></span>
      </div>
    `;
  }
}
