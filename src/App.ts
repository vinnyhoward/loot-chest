// @ts-nocheck
import Experience from './three/experience/Experience';
import './components/login-modal/login-modal';
import './components/loading-bar/loading-bar';
import { html } from './utils/html';

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
    document.dispatchEvent(new CustomEvent('show-loading'));
    fetchAssets().then((assets) => {
      const canvas = this.shadowRoot.querySelector('canvas.webgl');
      if (canvas) {
        new Experience(canvas, assets);
      }
    });
  }

  render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = html`
      <div>
        <login-modal></login-modal>
        <loading-bar></loading-bar>
        <canvas class="webgl"></canvas>
      </div>
    `;
  }
}

customElements.define('app-container', App);
