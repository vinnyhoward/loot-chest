// @ts-nocheck
import gsap from 'gsap';
import Experience from './three/experience/Experience';
import './components/login-modal/login-modal';
import './components/loading-bar/loading-bar';
import './components/dropdown-menu/dropdown-menu';
import './components/toast-notification/toast-notification';
import './components/open-button/open-button';
import './components/chest-info-modal/chest-info-modal';
import './components/chest-info-button/chest-info-button';
import './components/reward-modal/reward-modal';
import './components/failure-modal/failure-modal';
import './components/roulette/roulette';
import './components/hamburger-icon/hamburger-icon';
import './components/side-menu/side-menu';
import { html } from './utils/html';
import { EVENTS } from './constants/events';
import { fetchAssets } from './services/chests';

declare global {
  interface Window {
    experience: any;
  }
}

export default class App extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    document.dispatchEvent(new CustomEvent(EVENTS.SHOW_LOADING));
    fetchAssets()
      .then((assets) => {
        const canvas = this.shadowRoot.querySelector('canvas.webgl');
        if (canvas) {
          new Experience(canvas, assets);
        }

        const dropdownMenu = this.shadowRoot.querySelector('dropdown-menu');
        const chestInfoModal =
          this.shadowRoot.querySelector('chest-info-modal');
        if (dropdownMenu) {
          dropdownMenu.chests = assets;
          chestInfoModal.selectedChest = assets[0];
        }
      })
      .catch((error) => {
        console.error('Failed to fetch assets:', error);
      });

    document.addEventListener(EVENTS.FIRST_SHOW_MENU, () => {
      const app = this.shadowRoot.querySelector('.menu');
      if (app) {
        gsap.to(app, {
          delay: 3.5,
          duration: 0.5,
          opacity: 1,
          display: 'block',
          ease: 'power1.out',
        });
      }
    });

    document.addEventListener(EVENTS.SHOW_MENU, () => {
      const app = this.shadowRoot.querySelector('.menu');
      if (app) {
        gsap.to(app, {
          delay: 3.5,
          duration: 0.5,
          opacity: 1,
          display: 'block',
          ease: 'power1.out',
        });
      }
    });

    document.addEventListener(EVENTS.HIDE_MENU, () => {
      const app = this.shadowRoot.querySelector('.menu');
      if (app) {
        gsap.to(app, {
          delay: 0.15,
          duration: 0.5,
          opacity: 0,
          display: 'none',
          ease: 'power1.out',
        });
      }
    });
  }

  disconnectedCallback() {
    document.removeEventListener(EVENTS.FIRST_SHOW_MENU, () => {});
    document.removeEventListener(EVENTS.HIDE_MENU, () => {});
  }

  render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = html`
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          overflow-y: hidden;
          overflow-x: hidden;
        }

        body {
          overflow: hidden;
        }

        .webgl {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }

        .menu {
          display: none;
          opacity: 0;
        }
      </style>
      <div>
        <div class="menu">
          <login-modal></login-modal>
          <hamburger-icon></hamburger-icon>
          <dropdown-menu></dropdown-menu>
          <toast-notification></toast-notification>
          <open-button></open-button>
          <chest-info-button></chest-info-button>
          <reward-modal></reward-modal>
          <failure-modal></failure-modal>
          <chest-info-modal></chest-info-modal>
        </div>
        <div class="experience">
          <side-menu></side-menu>
          <loading-bar></loading-bar>
          <canvas class="webgl"></canvas>
        </div>
      </div>
    `;
  }
}

customElements.define('app-container', App);
