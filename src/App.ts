// @ts-nocheck
import './styles/main.scss';
import Experience from './three/experience/Experience';
import { html } from './utils/html.ts';
import LoadingBar from './components/LoadingBar';

class App {
  constructor(private rootElement: HTMLElement) {
    this.loadingBar = {};
  }

  init() {
    this.loadingBar = new LoadingBar();
    this.render();
    new Experience(document.querySelector('canvas.webgl'));
    this.fetchChests();
  }

  async fetchChests() {
    const token: string =
      'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJjbHJ2aHg4YWswMDAwMTBud2JidTFmaW1wIn0.LDKPeG6r7ElF42HF_ogFvIINado6VNcjz4ZQlOA5ais';
    try {
      // Assuming you have a setup to replace `process.env.API_URL` correctly
      const response = await fetch(`${process.env.API_URL}/chests/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log('data', data);
      // Do something with the data here, like updating the state or the UI
    } catch (error) {
      console.error('Failed to fetch chests:', error);
      // Handle the error appropriately in your application
    }
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
