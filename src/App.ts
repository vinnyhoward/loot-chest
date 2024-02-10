// @ts-nocheck
import Experience from './three/experience/Experience';
import './components/login-modal/login-modal';
import './components/loading-bar/loading-bar';
import './components/dropdown-menu/dropdown-menu';
import { html } from './utils/html';
import { EVENTS } from './constants/events';

const fetchAssets = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/chests/all`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const chests = await response.json();
    return chests.data;
  } catch (error) {
    console.error('Failed to fetch chests:', error);
  }
};

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
  }

  render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = html`
      <div>
        <login-modal></login-modal>
        <loading-bar></loading-bar>
        <dropdown-menu></dropdown-menu>
        <canvas class="webgl"></canvas>
      </div>
    `;
  }
}

customElements.define('app-container', App);
