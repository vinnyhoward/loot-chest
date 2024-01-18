import './styles/global.css';
// @ts-ignore // TODO: Will see if I want to convert to TS. Probably not.
import Experience from './three/experience/Experience';
import { html } from './utils/html.ts';

class App {
  constructor(private rootElement: HTMLElement) {}

  init() {
    this.render();
    const experience = new Experience(document.querySelector('canvas.webgl'));
  }

  render() {
    this.rootElement.innerHTML = html`
      <div>
        <div class="loading-bar-container">
          <div class="loading-bar"></div>
          <span class="percentage"></span>
        </div>
        <canvas class="webgl"></canvas>
      </div>
    `;
  }
}

export default App;
