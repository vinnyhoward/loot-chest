import { html } from '../../utils/html';
import { urlFor } from '../../services/sanity';

export class DropdownMenu extends HTMLElement {
  private state: { selectedItem: any };
  private _chests: any[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      selectedItem: this._chests[0],
    };
  }

  set chests(data) {
    this._chests = data;
    this.state.selectedItem = data.length > 0 ? data[0] : null;
    this.render();
    this.attachEventListeners();
  }

  get chests() {
    return this._chests;
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  selectItem(selectedChestId: string | null) {
    const selectedChest = this._chests.find(
      (chest) => chest._id === selectedChestId,
    );
    if (!selectedChest) return;

    this.state.selectedItem = selectedChest;
    document.dispatchEvent(
      new CustomEvent('item-selected', {
        detail: { selectedItem: selectedChestId },
        bubbles: true,
        composed: true,
      }),
    );

    // @ts-ignore
    window.experience.world.lootChest.setLootChest(
      this.state.selectedItem.fileChestName,
    );
    this.render();
    this.attachEventListeners();
  }

  attachEventListeners() {
    if (!this.shadowRoot) return;

    const items = this.shadowRoot.querySelectorAll('.chest__item');
    items.forEach((item) => {
      item.addEventListener('click', () => {
        const chestId: string | null = item.getAttribute('data-name');
        this.selectItem(chestId);
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
    console.log('chests: ', this._chests);
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = html`
      <style>
        .dropdown__container {
          cursor: pointer;
          position: absolute;
          top: 10%;
          left: 70%;
          max-width: 250px;
        }

        .dropdown {
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          min-height: 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 0px 10px;
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
          ${this._chests.length > 0
            ? html`<div class="dropdown__selected-chest">
                <img
                  src="${urlFor(this.state.selectedItem.chestIcon.asset._ref)
                    .width(50)
                    .height(50)
                    .url()}"
                  alt="${this.state.selectedItem.chestName}"
                />
                <span>${this.state.selectedItem.chestName}</span>
              </div>`
            : html`<div>Loading...</div>`}

          <ul class="dropdown__list">
            ${this._chests
              .filter((chest) => chest._id !== this.state.selectedItem._id)
              .map((chest) => {
                const url = urlFor(chest.chestIcon.asset._ref)
                  .width(50)
                  .height(50)
                  .url();
                return html`
                  <li class="chest__item" data-name="${chest._id}">
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

customElements.define('dropdown-menu', DropdownMenu);
