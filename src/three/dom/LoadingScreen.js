// packages
import gsap from 'gsap';

export default class LoadingScreen {
  constructor() {
    this.experience = window.experience;
    this.overlayMaterial = this.experience.planeLoader.material;
    this.quarterMachineIconElement = document.querySelector('.logo');
    this.loadingBarElement = document.querySelector('.loading-bar');
    this.loadingBarContainerElement = document.querySelector(
      '.loading-bar-container',
    );
  }

  showLoadingScreen() {
    gsap.to(this.quarterMachineIconElement, {
      duration: 0.25,
      opacity: 1,
      delay: 0.25,
      ease: 'Power2.easeIn',
    });
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
    gsap.to(this.overlayMaterial.uniforms.uAlpha, {
      duration: 0.25,
      value: 1,
      delay: 0.25,
    });
  }

  hideLoadingScreen() {
    window.setTimeout(() => {
      gsap.to(this.quarterMachineIconElement, {
        duration: 2,
        opacity: 0,
        delay: 0,
      });
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
      gsap.to(this.overlayMaterial.uniforms.uAlpha, {
        duration: 3,
        value: 0,
        delay: 0,
      });
    }, 2000);
  }

  updateLoadingBar(progressRatio) {
    this.loadingBarElement.style.width = `${progressRatio}%`;
  }

  showLoadingTransition() {
    gsap.to(this.quarterMachineIconElement, {
      duration: 1,
      opacity: 1,
      delay: 0,
      ease: 'Power2.easeIn',
    });
    gsap.to(this.overlayMaterial.uniforms.uAlpha, {
      duration: 1,
      value: 1,
      delay: 0,
      ease: 'Power2.easeIn',
    });
  }

  hideLoadingTransition() {
    gsap.to(this.quarterMachineIconElement, {
      duration: 1,
      opacity: 0,
      delay: 1,
      ease: 'Power2.easeIn',
    });
    gsap.to(this.overlayMaterial.uniforms.uAlpha, {
      duration: 1,
      value: 0,
      delay: 1,
      ease: 'Power2.easeIn',
    });
  }
}
