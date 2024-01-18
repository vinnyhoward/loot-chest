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
