import './App';

const rootElement = document.getElementById('app');

if (rootElement) {
  const appElement = document.createElement('app-container');
  rootElement.appendChild(appElement);
}
