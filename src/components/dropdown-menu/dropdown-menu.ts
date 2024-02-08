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
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = html`
      <style>
        .dropdown__container {
          position: absolute;
          top: 10%;
          left: 85%;
          transform: translate(-50%, -50%);
        }

        .dropdown {
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          padding: 10px;
          min-width: 200px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      </style>
      <div class="dropdown__container">
        <div class="dropdown">
          <ul class="dropdown__list">
            ${mockData.map((chest) => {
              const url = urlFor(chest.chestIcon.asset._ref)
                .width(50)
                .height(50)
                .url();
              return html`
                <li class="chest__item">
                  <img src="${url}" alt="${chest.chestName}" />
                  <span>${chest.chestName}</span>
                </li>
              `;
            })}
          </ul>
        </div>
      </div>
    `;
  }
}

customElements.define('dropdown-menu', DropdownMenu);
