// @ts-nocheck
import Experience from './three/experience/Experience';
import './components/login-modal/login-modal';
import './components/loading-bar/loading-bar';
import './components/dropdown-menu/dropdown-menu';
import { html } from './utils/html';
import { EVENTS } from './constants/events';

const fetchAssets = async () => {
  const token: string =
    'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJjbHJ2aHg4YWswMDAwMTBud2JidTFmaW1wIn0.LDKPeG6r7ElF42HF_ogFvIINado6VNcjz4ZQlOA5ais';
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/chests/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const chests = await response.json();
    console.log('chests:', chests.data);
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
