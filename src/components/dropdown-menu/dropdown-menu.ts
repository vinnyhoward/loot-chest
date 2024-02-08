import { html } from '../../utils/html';
import { urlFor } from '../../services/sanity';

const mockData = [
  {
    chestName: "Skeleton King's Chest",
    chestIcon: {
      _type: 'chestIcon',
      asset: {
        _ref: 'image-3ac136999db1d553685290a713902d919aa02b01-75x75-png',
        _type: 'reference',
      },
    },
    _id: '03bf6655-fc3a-44f7-b609-634fd2182faa',
    chestImage: {
      _type: 'chestImage',
      asset: {
        _ref: 'image-3e2f8e6cfbf7365cb07ffbe70345d42c9e0235b4-750x750-png',
        _type: 'reference',
      },
    },
  },
  {
    _id: '1e02b6dc-9b19-4cf3-b78d-c8ccb06ebd01',
    chestName: 'Arcana Loot Chest',
    chestImage: {
      _type: 'chestImage',
      asset: {
        _type: 'reference',
        _ref: 'image-84b9f8fd3c70c7f2214cb11b044d512e18ac7fa8-75x75-png',
      },
    },
    chestIcon: {
      asset: {
        _ref: 'image-54be7740831000f066b8fba5e82729602c3b543a-750x750-png',
        _type: 'reference',
      },
      _type: 'chestIcon',
    },
  },
  {
    _id: '8e53ce86-d439-4947-876d-528675a83cf3',
    chestImage: {
      _type: 'chestImage',
      asset: {
        _ref: 'image-9f60f9f0445600c0d31273e7f88acb795d89d93b-75x75-png',
        _type: 'reference',
      },
    },
    chestIcon: {
      asset: {
        _ref: 'image-c4c566c6e9e3938539ec6d333891ac76bb899216-750x750-png',
        _type: 'reference',
      },
      _type: 'chestIcon',
    },
    chestName: "Nature's Guise Chest",
  },
];

export class DropdownMenu extends HTMLElement {
  private state: { selectedItem: any };

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      selectedItem: mockData[0],
    };
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  selectItem(selectedChestId: string | null) {
    // @ts-ignore
    this.state.selectedItem = mockData.filter(
      (chest) => chest._id === selectedChestId,
    )[0];
    this.dispatchEvent(
      new CustomEvent('item-selected', {
        detail: { selectedItem: selectedChestId },
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
              src="${urlFor(this.state.selectedItem.chestIcon.asset._ref)
                .width(50)
                .height(50)
                .url()}"
              alt="${this.state.selectedItem.chestName}"
            />
            <span>${this.state.selectedItem.chestName}</span>
          </div>

          <ul class="dropdown__list">
            ${mockData
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
