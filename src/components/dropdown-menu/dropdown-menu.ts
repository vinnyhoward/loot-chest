import gsap from 'gsap';
import { html } from '../../utils/html';
import { urlFor } from '../../services/sanity';
import { EVENTS } from '../../constants/events';

export class DropdownMenu extends HTMLElement {
  private state: {
    selectedChest: any;
  };
  private _chests: any[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      selectedChest: this._chests[0],
    };

    this.selectItem = this.selectItem.bind(this);
  }

  set chests(data) {
    this._chests = data;
    this.state.selectedChest = data.length > 0 ? data[0] : null;
    document.dispatchEvent(
      new CustomEvent(EVENTS.CHEST_SELECTED, {
        detail: { selectedChest: this.state.selectedChest },
        bubbles: true,
        composed: true,
      }),
    );

    this.render();
    this.attachEventListeners();
  }

  get chests() {
    return this._chests;
  }

  connectedCallback(): void {
    this.render();
    this.attachEventListeners();
  }

  disconnectedCallback(): void {
    this.removeEventListener(EVENTS.CHEST_SELECTED, () => {});
    this.removeEventListener(EVENTS.HIDE_UI, () => {});
    this.removeEventListener(EVENTS.SHOW_UI, () => {});
  }

  selectItem(selectedChestId: string | null): void {
    const selectedChest = this._chests.find(
      (chest) => chest._id === selectedChestId,
    );
    if (!selectedChest) return;
    this.state.selectedChest = selectedChest;

    document.dispatchEvent(
      new CustomEvent(EVENTS.CHEST_SELECTED, {
        detail: { selectedChest },
        bubbles: true,
        composed: true,
      }),
    );

    // @ts-ignore
    window.experience.world.lootChest.getLootChest(
      this.state.selectedChest.fileChestName,
    );

    this.render();
    this.attachEventListeners();
  }

  attachEventListeners(): void {
    if (!this.shadowRoot) return;

    const items = this.shadowRoot.querySelectorAll('.chest__item');
    items.forEach((item) => {
      item.addEventListener('click', (e) => {
        const chestId: string | null = item.getAttribute('data-name');
        this.selectItem(chestId);
        e.stopPropagation();
      });
    });

    this.dropdownToggle();

    document.addEventListener(EVENTS.HIDE_UI, () => {
      this.hide();
    });
    document.addEventListener(EVENTS.SHOW_UI, () => {
      this.show();
    });
  }

  dropdownToggle(): void {
    if (!this.shadowRoot) return;

    const dropdown = this.shadowRoot.querySelector('.dropdown');

    dropdown?.addEventListener('click', () => {
      const list = this.shadowRoot?.querySelector(
        '.dropdown__list',
      ) as HTMLElement;
      const arrow = this.shadowRoot?.querySelector(
        '#dropdownArrow',
      ) as SVGSVGElement;
      const dropdownContainerEl = this.shadowRoot?.querySelector(
        '.dropdown__container',
      ) as HTMLElement;
      const selectedDropdownEl = this.shadowRoot?.querySelector(
        '.dropdown__selected-chest',
      );
      const dropdownChestIconEl = this.shadowRoot?.querySelector(
        '.dropdown__chest-icon',
      ) as HTMLImageElement;
      const chestNameEl = this.shadowRoot?.querySelector(
        '.chest-name',
      ) as HTMLElement;
      console.log('dropdown clicked...', window.innerWidth);
      if (window.innerWidth >= 575) {
        if (list && arrow) {
          const isOpening =
            list.style.display === 'none' || !list.style.display;

          list.style.display = 'block';
          list.style.opacity = '0';
          list.style.transform = 'translateY(-20px)';

          const targetHeight = isOpening ? `${list.scrollHeight}px` : '0px';

          gsap.to(list, {
            duration: 0.15,
            opacity: isOpening ? 1 : 0,
            translateY: isOpening ? '0px' : '-20px',
            onComplete: () => {
              if (!isOpening) {
                list.style.display = 'none';
              }
            },
          });

          gsap.to(list, {
            duration: 0.15,
            height: targetHeight,
            onComplete: () => {
              if (isOpening) {
                list.style.height = 'auto';
              }
            },
          });

          const rotation = isOpening ? 180 : 0;
          gsap.to(arrow, {
            duration: 0.15,
            rotation,
            transformOrigin: 'center',
          });
        }
      } else {
        // dropdownContainerEl.style.width = '320px';
      }
    });
  }

  public show(): void {
    gsap.to(this, {
      opacity: 1,
      display: 'block',
      duration: 0.5,
    });
  }

  public hide(): void {
    gsap.to(this, {
      opacity: 0,
      display: 'none',
      duration: 0.5,
    });
  }

  render() {
    if (!this.shadowRoot) return;
    const chestList = this._chests.filter((chest) => {
      const isDraft = chest._id.split('.').length > 1;
      return chest._id !== this.state.selectedChest._id && !isDraft;
    });

    this.shadowRoot.innerHTML = html`
      <style>
        {
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Hind:wght@300;400;500;600;700&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;

          --main-color: #8847ff;
          --main-color-gradient: linear-gradient(
            120deg,
            #8847ff 0%,
            #a06cff 100%
          );

          --common: #588cbf;
          --uncommon: #4664d6;
          --rare: #7a5bf0;
          --legendary: #be47d0;
          --divine: #db9f45;

          --bg-common: #5e98d9;
          --bg-uncommon: #4b69ff;
          --bg-rare: #8847ff;
          --bg-legendary: #d32ee6;
          --bg-divine: #f8ae39;

          --font1: 'Montserrat', sans-serif;
          --font2: 'Hind', sans-serif;

          --primary-text-color: white;
          --secondary-text-color: #25314c;
        }

        .dropdown__container {
          cursor: pointer;
          position: fixed;
          top: 75px;
          right: 75px;
          width: 320px;
          height: 50px;
          opacity: 1;

          @media (max-width: 575px) {
            width: 70px;
            height: 70px;
            top: 25px;
            right: 25px;
          }
        }

        .dropdown {
          background-color: white;
          border-radius: 24px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          min-height: 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 10px 20px;
        }

        .chest__item {
          cursor: pointer;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 5px 0px;
          margin: 5px 0;
          text-align: left;
          width: 100%;
        }

        .chest__item:hover {
          background-color: #f0f0f0;
          border-radius: 16px;
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
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          width: 100%;

          @media (max-width: 575px) {
            justify-content: center;
          }
        }

        .dropdown__chest-info {
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          align-items: center;
        }

        .dropdown__chest-icon {
          margin-right: 5px;

          @media (max-width: 575px) {
            margin-right: 0px;
          }
        }

        span {
          font-family: var(--font1);
          font-weight: 700;
          font-size: 0.9rem;
          text-transform: uppercase;
          color: #25314c;
        }

        .dead {
          width: 25px;
          height: 25px;
        }

        .chest-name {
          @media (max-width: 575px) {
            display: none;
          }
        }

        .arrow__container {
          @media (max-width: 575px) {
            display: none;
          }
        }
      </style>
      <div class="dropdown__container">
        <div class="dropdown">
          ${this._chests.length > 0
            ? html`<div class="dropdown__selected-chest">
                <div class="dropdown__chest-info">
                  <img
                    class="dropdown__chest-icon"
                    src="${urlFor(this.state.selectedChest.chestIcon.asset._ref)
                      .width(50)
                      .height(50)
                      .url()}"
                    alt="${this.state.selectedChest.chestName}"
                  />
                  <span class="chest-name"
                    >${this.state.selectedChest.chestName}</span
                  >
                </div>

                <div class="arrow__container">
                  <svg
                    id="dropdownArrow"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 17C11.744 17 11.488 16.9021 11.293 16.7071L4.29301 9.70707C3.90201 9.31607 3.90201 8.68401 4.29301 8.29301C4.68401 7.90201 5.31607 7.90201 5.70707 8.29301L12 14.586L18.293 8.29301C18.684 7.90201 19.3161 7.90201 19.7071 8.29301C20.0981 8.68401 20.0981 9.31607 19.7071 9.70707L12.7071 16.7071C12.5121 16.9021 12.256 17 12 17Z"
                      fill="#25314C"
                    />
                  </svg>
                </div>
              </div>`
            : html`<div>Loading...</div>`}

          <ul class="dropdown__list">
            ${chestList
              .map((chest) => {
                const url = urlFor(chest.chestIcon.asset._ref)
                  .width(50)
                  .height(50)
                  .url();
                return html`
                  <li class="chest__item" data-name="${chest._id}">
                    <div class="dropdown__chest-info">
                      <img
                        class="dropdown__chest-icon"
                        src="${url}"
                        alt="${chest.chestName}"
                      />
                      <span>${chest.chestName}</span>
                    </div>
                    <div class="dead"></div>
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
