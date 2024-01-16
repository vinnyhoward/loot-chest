import App from './App';

const rootElement = document.getElementById('app');

if (rootElement) {
    const app = new App(rootElement);
    app.init();
}