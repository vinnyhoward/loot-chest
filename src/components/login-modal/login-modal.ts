import { html } from '../../utils/html';

export class LoginModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.onSubmit = this.onSubmit.bind(this);
  }

  connectedCallback(): void {
    this.render();
    this.attachFormSubmitListener();
  }

  private attachFormSubmitListener(): void {
    const form = this.shadowRoot?.querySelector('.modal__form');
    form?.addEventListener('submit', this.onSubmit);
  }

  private onSubmit(event: Event): void {
    event.preventDefault();

    const target = event.target as HTMLFormElement;
    const formData = new FormData(target);

    const username: FormDataEntryValue | null = formData.get('username');
    const password: FormDataEntryValue | null = formData.get('password');

    console.log('Username:', username, 'Password:', password);
  }

  private render(): void {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = html`
      <style>
        .modal__container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .modal {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          padding: 20px;
          width: 300px;
          min-height: 300px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .modal__body {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      </style>
      <div>
        <div class="modal__container">
          <div class="modal">
            <div class="modal__header">
              <h2 class="modal__title">Temp Title for Login!</h2>
              <button class="modal__close-button">Close</button>
            </div>
            <form class="modal__form">
              <div>
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" />
              </div>

              <div>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" />
              </div>

              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('login-modal', LoginModal);
