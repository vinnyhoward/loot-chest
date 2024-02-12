import { html } from '../../utils/html';
import { loginUserUrl } from '../../services/route';
import { EVENTS } from '../../constants/events';
import '../loader/loader';

const loginUser = async (
  email: FormDataEntryValue,
  password: FormDataEntryValue,
) => {
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
};

export class LoginModal extends HTMLElement {
  private submitting: boolean;
  private isLoggedIn: boolean;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.onSubmit = this.onSubmit.bind(this);

    this.submitting = false;
    this.isLoggedIn = false;
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
    if (this.submitting) return;

    const target = event.target as HTMLFormElement;
    const formData = new FormData(target);

    const email: FormDataEntryValue | null = formData.get('email');
    const password: FormDataEntryValue | null = formData.get('password');

    if (email && password) {
      try {
        await loginUser(email, password);
        this.isLoggedIn = true;
        this.setFormState(true);
      } catch (error) {
        console.error('Failed to login:', error);
        this.showError();
      } finally {
        this.setFormState(false);
      }
    }
  }

  private setFormState(disabled: boolean): void {
    this.submitting = disabled;
    const button = this.shadowRoot?.querySelector(
      'button',
    ) as HTMLButtonElement;
    const inputFields = this.shadowRoot?.querySelectorAll(
      '.input_field',
    ) as NodeListOf<HTMLInputElement>;

    if (button) button.disabled = disabled;
    inputFields.forEach((inputField) => {
      inputField.disabled = disabled;
    });
  }

  private showError(): void {
    const errorContainer = this.shadowRoot?.querySelector(
      '.auth-form-error',
    ) as HTMLElement;
    const errorText = this.shadowRoot?.querySelector(
      '.error-message',
    ) as HTMLElement;
    const inputFields = this.shadowRoot?.querySelectorAll(
      '.input_field',
    ) as NodeListOf<HTMLInputElement>;

    if (errorContainer && errorText) {
      errorContainer.style.display = 'flex';
      errorText.textContent = 'Invalid email or password';

      inputFields.forEach((inputField) => {
        inputField.style.borderColor = 'red';
        inputField.value = '';
      });
    }
  }

  private render(): void {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = html`
      <style>
        {
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Hind:wght@300;400;500;600;700&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
        }

        * {
          box-sizing: border-box;
        }

        a {
          text-decoration: none;
          color: inherit;
        }

        button {
          width: 100%;
          height: 50px;
          border: none;
          border-radius: 8px;
          background-color: #974af4;
          color: white;
          font-family: 'Hind', sans-serif;
          font-weight: 600;
          font-style: normal;
          font-size: 14px;
          cursor: pointer;
          text-transform: uppercase;
        }

        .modal__container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .modal {
          background-color: white;
          border-radius: 24px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
          min-width: 400px;
          min-height: 450px;
          display: flex;
          flex-direction: column;
        }

        .modal__body {
          display: flex;
          flex-direction: column;
          padding: 25px;
        }

        .line {
          width: 100%;
          height: 2px;
          background-color: #f0f0f0;
        }
        .modal__logo {
          margin: 25px 0;
          object-fit: contain;
          width: 260px;
        }

        .modal__header {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .input_field {
          width: 100%;
          border: 1px solid #e9e9e9;
          border-radius: 8px;
          height: 50px;
          background-color: #fbfbfb;
          margin: 0;
          padding: 0;
          margin-bottom: 15px;

          font-family: 'Hind', sans-serif;
          font-weight: 400;
          font-style: normal;
          color: #25314c;
          font-size: 14px;
          padding: 10px;
        }

        .input_field::placeholder {
          color: #acbcc0;
          font-family: 'Hind', sans-serif;
          font-weight: 400;
          font-style: normal;
          font-size: 14px;
        }

        .input_field:focus {
          outline: none;
        }

        .modal__form {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .forgot-password {
          margin-bottom: 20px;
          color: #acbcc0;
          font-family: 'Hind', sans-serif;
          font-weight: 400;
          font-style: normal;
          font-size: 14px;
          text-decoration: none;
        }

        .modal__separator-text {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 20px;
          margin-bottom: 20px;
          color: #acbcc0;
          font-family: 'Hind', sans-serif;
          font-weight: 400;
          font-style: normal;
          font-size: 14px;
        }

        .modal__separator-line {
          width: 50%;
          height: 2px;
          background-color: #f0f0f0;
        }

        span {
          margin: 0 10px;
          text-transform: uppercase;
          font-size: 14px;
          font-weight: 600;
          color: #acbcc0;
          font-family: 'Hind', sans-serif;
        }

        .modal__footer {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal__footer-caption,
        .modal__footer-button {
          color: #acbcc0;
          font-family: 'Hind', sans-serif;
          font-weight: 400;
          font-style: normal;
          font-size: 14px;
          text-transform: none;
        }

        .modal__footer-button {
          font-weight: 600;
          text-transform: none;
          color: #974af4;
        }

        .error-message {
          color: red;
          font-family: 'Hind', sans-serif;
          font-weight: 400;
          font-style: normal;
          font-size: 14px;
          text-transform: none;
          margin: 0;
          padding: 0;
          margin-bottom: 10px;
        }

        .auth-form-error {
          display: none;
        }
      </style>
      <div>
        <div class="modal__container">
          <div class="modal">
            <div class="modal__header">
              <img class="modal__logo" src="/logos/temp_logo.png" alt="logo" />
              <div class="line"></div>
            </div>
            <div class="modal__body">
              <form class="modal__form">
                <div>
                  <input
                    class="input_field"
                    type="text"
                    id="email"
                    name="email"
                    placeholder="Username or email"
                  />
                </div>

                <div>
                  <input
                    class="input_field"
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                  />
                </div>
                <div class="forgot-password">
                  <a href="#">Forgot Password?</a>
                </div>

                <div class="auth-form-error">
                  <span class="error-message"> Invalid email or password </span>
                </div>
                <button type="submit">
                  ${this.submitting
                    ? html`<loader-component></loader-component>`
                    : 'Login'}
                </button>
              </form>
              <div class="modal__separator-text">
                <div class="modal__separator-line"></div>
                <span>or</span>
                <div class="modal__separator-line"></div>
              </div>

              <div class="modal__footer">
                <span class="modal__footer-caption"
                  >Don't have an account?</span
                >
                <a class="modal__footer-button" href="#">Sign up</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('login-modal', LoginModal);
