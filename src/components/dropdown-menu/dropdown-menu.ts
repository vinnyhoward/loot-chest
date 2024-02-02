import { html } from '../../utils/html';

export default class DropdownMenu {
  constructor(private options: string[]) {}

  render() {
    return html`
      <div class="dropdown">
        <button class="dropdown__button">Select</button>
        <ul class="dropdown__list">
          ${this.options.map((option) => {
            return html`<li class="dropdown__item">${option}</li>`;
          })}
        </ul>
      </div>
    `;
  }
}
