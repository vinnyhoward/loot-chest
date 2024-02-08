import { html } from '../../utils/html';
import { loginUserUrl } from '../../services/route';
import { EVENTS } from '../../constants/events';

const loginUser = async (
  email: FormDataEntryValue,
  password: FormDataEntryValue,
) => {
  try {
    const response = await fetch(loginUserUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const user = await response.json();

    if (user.success && user.token) {
      localStorage.setItem('token', user.token);
      localStorage.setItem('user_auth', JSON.stringify(user.data));

      document.dispatchEvent(
        new CustomEvent(EVENTS.LOGIN_SUCCESS, {
          bubbles: true,
          composed: true,
        }),
      );
    } else {
      console.error('Login failed:', user.message);
    }
  } catch (error) {
    console.error('Failed to login:', error);
  }
};

export class LoginModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.onSubmit = this.onSubmit.bind(this);
  }

  connectedCallback(): void {
    const token = localStorage.getItem('token');
    document.addEventListener(EVENTS.LOGIN_SUCCESS, () => {
      this.style.display = 'none';
    });

    if (token) {
      this.style.display = 'none';
    } else {
      this.render();
      this.attachFormSubmitListener();
    }
  }

  private attachFormSubmitListener(): void {
    const form = this.shadowRoot?.querySelector('.modal__form');
    form?.addEventListener('submit', this.onSubmit);
  }

  private async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const target = event.target as HTMLFormElement;
    const formData = new FormData(target);

    const email: FormDataEntryValue | null = formData.get('email');
    const password: FormDataEntryValue | null = formData.get('password');

    if (email && password) {
      await loginUser(email, password);
    }
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
                <label for="email">Email:</label>
                <input type="text" id="email" name="email" />
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
