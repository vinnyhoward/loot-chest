// @ts-nocheck
import './styles/main.scss';
import Experience from './three/experience/Experience';
import { html } from './utils/html.ts';
import LoadingBar from './components/LoadingBar';

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

class App {
  constructor(private rootElement: HTMLElement) {
    this.loadingBar = {};
  }

  init() {
    fetchAssets().then((assets) => {
      new Experience(document.querySelector('canvas.webgl'), assets);
    });
    this.loadingBar = new LoadingBar();
    this.render();
  }

  render() {
    this.rootElement.innerHTML = html`
      <div>
        ${this.loadingBar.render()}
        <canvas class="webgl"></canvas>
      </div>
    `;
  }
}

export default App;
