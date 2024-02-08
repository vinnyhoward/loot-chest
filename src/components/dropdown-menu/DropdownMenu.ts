import { html } from '../../utils/html';
import { urlFor } from '../../services/sanity';
import { mockData } from './dropdown-menu';

export class DropdownMenu extends HTMLElement {
  private state: { selectedItemIndex: number };

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      selectedItemIndex: 0,
    };
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  selectItem(selectedIndex: number | null) {
    // @ts-ignore
    this.state.selectedItemIndex = selectedIndex;
    this.dispatchEvent(
      new CustomEvent('item-selected', {
        detail: { selectedItemIndex: selectedIndex },
        bubbles: true,
        composed: true,
      }),
    );
    this.render();
    this.attachEventListeners();
  }

  attachEventListeners() {
    if (!this.shadowRoot) return;

    const items = this.shadowRoot.querySelectorAll('.chest__item');
    items.forEach((item) => {
      item.addEventListener('click', () => {
        const data: string | null = item.getAttribute('data-name');
        const index: number = Number(data);
        this.selectItem(index);
      });
    });

    const selectedChest = this.shadowRoot.querySelector('.dropdown');
    selectedChest?.addEventListener('click', () => {
      const list = this.shadowRoot?.querySelector(
        '.dropdown__list',
      ) as HTMLElement;
      if (list) {
        list.style.display = list.style.display === 'none' ? 'block' : 'none';
      }
    });
  }

  render() {
    console.log('state:', this.state);
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = html`
      <style>
        .dropdown__container {
          cursor: pointer;
          position: absolute;
          top: 10%;
          left: 70%;
        }

        .dropdown {
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          min-height: 50px;
          min-width: 225px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .chest__item {
          cursor: pointer;
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          align-items: center;
          height: 50px;
          padding: 10px;
        }

        .chest__item.selected {
          background-color: #e0e0e0;
        }

        .dropdown__list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        .dropdown__selected-chest {
          height: 50px;
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          align-items: center;
          padding: 10px 50px;
          width: 100%;
        }
      </style>
      <div class="dropdown__container">
        <div class="dropdown">
          <div class="dropdown__selected-chest">
            <img
              src="${urlFor(
                mockData[this.state.selectedItemIndex].chestIcon.asset._ref,
              )
                .width(50)
                .height(50)
                .url()}"
              alt="${mockData[this.state.selectedItemIndex].chestName}"
            />
            <span>${mockData[this.state.selectedItemIndex].chestName}</span>
          </div>

          <ul class="dropdown__list">
            ${mockData
              .map((chest, index) => {
                const url = urlFor(chest.chestIcon.asset._ref)
                  .width(50)
                  .height(50)
                  .url();
                return html`
                  <li class="chest__item" data-name="${index}">
                    <img src="${url}" alt="${chest.chestName}" />
                    <span>${chest.chestName}</span>
                  </li>
                `;
              })
              .join('')}
          </ul>
        </div>
      </div>
    `;
  }
}
