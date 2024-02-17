// @ts-nocheck
import gsap from 'gsap';
import Experience from './three/experience/Experience';
import './components/login-modal/login-modal';
import './components/loading-bar/loading-bar';
import './components/dropdown-menu/dropdown-menu';
import './components/toast-notification/toast-notification';
import './components/open-button/open-button';
import './components/chest-info-modal/chest-info-modal';
import { html } from './utils/html';
import { EVENTS } from './constants/events';
import { fetchAssets } from './services/chests';

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
        if (dropdownMenu) {
          dropdownMenu.chests = assets;
        }
      })
      .catch((error) => {
        console.error('Failed to fetch assets:', error);
      });

    document.addEventListener(EVENTS.SHOW_MENU, () => {
      const app = this.shadowRoot.querySelector('.app');
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

        .app {
          display: none;
          opacity: 0;
        }
      </style>
      <div>
        <div class="app">
          <login-modal></login-modal>
          <dropdown-menu></dropdown-menu>
          <toast-notification></toast-notification>
          <open-button></open-button>
          <chest-info-modal></chest-info-modal>
        </div>
        <loading-bar></loading-bar>
        <canvas class="webgl"></canvas>
      </div>
    `;
  }
}

customElements.define('app-container', App);
