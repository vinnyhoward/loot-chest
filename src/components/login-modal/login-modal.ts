import gsap from 'gsap';
import {
  loginUser,
  signUpUser,
  forgotPassword,
  resetPassword,
} from '../../services/auth';
import { html } from '../../utils/html';
import { validateEmail } from '../../utils/validateEmail';
import { validatePassword } from '../../utils/validatePassword';
import { EVENTS } from '../../constants/events';
import '../loader/loader';

enum AuthState {
  LOGIN,
  SIGNUP,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_SUCCESS,
}

export class LoginModal extends HTMLElement {
  private submitting: boolean;
  private authState: AuthState;
  private resetPasswordToken: string;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.submitting = false;
    this.authState = AuthState.LOGIN;
    this.resetPasswordToken = '';

    this.onSubmit = this.onSubmit.bind(this);
  }

  connectedCallback(): void {
    document.addEventListener(EVENTS.LOGIN_SUCCESS, () => {
      this.hide();
    });

    const token = localStorage.getItem('token');
    if (token) {
      this.hide();
    } else {
      const params = new URLSearchParams(window.location.search);
      const resetPassToken = params.get('reset-password-token');
      if (resetPassToken) {
        this.resetPasswordToken = resetPassToken;
        this.authState = AuthState.RESET_PASSWORD;

        params.delete('reset-password-token');
        const newUrl =
          window.location.pathname +
          (params.toString() ? '?' + params.toString() : '');
        window.history.replaceState(null, '', newUrl);
      }

      this.render();
      this.attachListeners();
      if (!this.shadowRoot) return;

      // TODO: Fix this hack of hiding the modal on load
      gsap.to(this, {
        duration: 0.0,
        opacity: 0,
        display: 'none',
      });
    }
  }

  private attachListeners(): void {
    const form = this.shadowRoot?.querySelector('.modal__login-form');
    form?.addEventListener('submit', this.onSubmit);

    const signUpButton = this.shadowRoot?.querySelector(
      '.modal__footer-button',
    );

    signUpButton?.addEventListener('click', () => {
      if (this.authState === AuthState.LOGIN) {
        this.authState = AuthState.SIGNUP;
      } else {
        this.authState = AuthState.LOGIN;
      }

      this.render();
      this.attachListeners();
    });

    const close = this.shadowRoot?.querySelector(
      '.close__button',
    ) as HTMLElement;

    close?.addEventListener('click', () => {
      this.hide();
    });

    const parent = this.shadowRoot?.querySelector('.modal__parent');
    parent?.addEventListener('click', (e) => {
      if (e.target === parent) {
        this.hide();
      }
    });

    const passwordField = this.shadowRoot?.querySelector(
      '.password_field',
    ) as HTMLInputElement;

    passwordField?.addEventListener('focus', () => {
      // console.log('User has clicked or tabbed into the input field.');
    });

    const forgotPassword = this.shadowRoot?.querySelector('.forgot-password');
    forgotPassword?.addEventListener('click', () => {
      this.authState = AuthState.FORGOT_PASSWORD;
      this.render();
      this.attachListeners();
    });

    document.addEventListener(EVENTS.SHOW_LOGIN_MENU, this.show.bind(this));
    document.addEventListener(EVENTS.HIDE_LOGIN_MENU, this.hide.bind(this));
  }

  public hide(): void {
    gsap.to(this, {
      duration: 0.2,
      delay: 0.1,
      opacity: 0,
      display: 'none',
      ease: 'power1.out',
    });
  }

  public show(): void {
    gsap.to(this, {
      duration: 0.2,
      delay: 0.1,
      opacity: 1,
      display: 'block',
      ease: 'power1.out',
    });
  }

  private async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.submitting) return;

    const target = event.target as HTMLFormElement;
    const formData = new FormData(target);

    const email: FormDataEntryValue | null = formData.get('email');
    const password: FormDataEntryValue | null = formData.get('password');
    const confirmedPassword: FormDataEntryValue | null =
      formData.get('confirm_password');
    const username: FormDataEntryValue | null = formData.get('email');

    const isPasswordInvalid = !validatePassword(password as string);
    const isEmailInvalid = !validateEmail(email as string);

    if (
      this.authState === AuthState.FORGOT_PASSWORD ||
      this.authState === AuthState.FORGOT_PASSWORD_SUCCESS
    ) {
      if (isEmailInvalid) {
        const emailField = this.shadowRoot?.querySelector(
          '.email_field',
        ) as HTMLElement;
        const errorContainer = this.shadowRoot?.querySelector(
          '.auth-form-error',
        ) as HTMLElement;
        const errorText = this.shadowRoot?.querySelector(
          '.error-message',
        ) as HTMLElement;
        if (emailField) {
          emailField.style.borderColor = 'red';
          errorContainer.style.display = 'flex';
          errorText.textContent = 'Invalid email';
        }
      }

      if (email && !isEmailInvalid) {
        this.setFormState(true);
        try {
          await forgotPassword(email);
          this.authState = AuthState.FORGOT_PASSWORD_SUCCESS;
        } catch (error) {
          console.error('Failed to send reset password link:', error);
          this.showError();
        }
        this.setFormState(false);
      }

      this.render();
      this.attachListeners();
      return;
    }

    if (this.authState === AuthState.RESET_PASSWORD) {
      if (password !== confirmedPassword) {
        const passwordFields = this.shadowRoot?.querySelectorAll(
          '.password_field',
        ) as NodeListOf<HTMLInputElement>;
        const errorContainer = this.shadowRoot?.querySelector(
          '.auth-form-error',
        ) as HTMLElement;
        const errorText = this.shadowRoot?.querySelector(
          '.error-message',
        ) as HTMLElement;

        if (passwordFields) {
          passwordFields.forEach((passwordField) => {
            passwordField.style.borderColor = 'red';
          });
          errorContainer.style.display = 'flex';
          errorText.textContent = 'Passwords do not match';
        }
      }

      if (isPasswordInvalid) {
        const passwordFields = this.shadowRoot?.querySelectorAll(
          '.password_field',
        ) as NodeListOf<HTMLInputElement>;
        const errorContainer = this.shadowRoot?.querySelector(
          '.auth-form-error',
        ) as HTMLElement;
        const errorText = this.shadowRoot?.querySelector(
          '.error-message',
        ) as HTMLElement;
        if (passwordFields) {
          passwordFields.forEach((passwordField) => {
            passwordField.style.borderColor = 'red';
          });
          errorContainer.style.display = 'flex';
          errorText.textContent = 'Invalid password';
        }
      }

      if (password && password === confirmedPassword && !isPasswordInvalid) {
        this.setFormState(true);
        try {
          await resetPassword(confirmedPassword, this.resetPasswordToken);
          this.authState = AuthState.LOGIN;
        } catch (error) {
          console.error('Failed to reset password:', error);
          const passwordFields = this.shadowRoot?.querySelectorAll(
            '.password_field',
          ) as NodeListOf<HTMLInputElement>;
          const errorContainer = this.shadowRoot?.querySelector(
            '.auth-form-error',
          ) as HTMLElement;
          const errorText = this.shadowRoot?.querySelector(
            '.error-message',
          ) as HTMLElement;
          if (passwordFields) {
            passwordFields.forEach((passwordField) => {
              passwordField.style.borderColor = 'red';
            });
            errorContainer.style.display = 'flex';
            errorText.textContent = 'Something went wrong. Please try again';
          }
        }
        this.setFormState(false);
      }
    }

    if (isEmailInvalid && isPasswordInvalid) {
      const emailField = this.shadowRoot?.querySelector(
        '.email_field',
      ) as HTMLElement;
      const passwordField = this.shadowRoot?.querySelector(
        '.password_field',
      ) as HTMLElement;
      const errorContainer = this.shadowRoot?.querySelector(
        '.auth-form-error',
      ) as HTMLElement;
      const errorText = this.shadowRoot?.querySelector(
        '.error-message',
      ) as HTMLElement;

      if (emailField && passwordField) {
        emailField.style.borderColor = 'red';
        passwordField.style.borderColor = 'red';
        errorContainer.style.display = 'flex';
        errorText.textContent = 'Invalid email and password';
      }

      return;
    }

    if (email && isEmailInvalid) {
      const emailField = this.shadowRoot?.querySelector(
        '.email_field',
      ) as HTMLElement;
      const errorContainer = this.shadowRoot?.querySelector(
        '.auth-form-error',
      ) as HTMLElement;
      const errorText = this.shadowRoot?.querySelector(
        '.error-message',
      ) as HTMLElement;
      if (emailField) {
        emailField.style.borderColor = 'red';
        errorContainer.style.display = 'flex';
        errorText.textContent = 'Invalid email';
      }

      return;
    }

    if (password && isPasswordInvalid) {
      const passwordField = this.shadowRoot?.querySelector(
        '.password_field',
      ) as HTMLElement;
      const errorContainer = this.shadowRoot?.querySelector(
        '.auth-form-error',
      ) as HTMLElement;
      const errorText = this.shadowRoot?.querySelector(
        '.error-message',
      ) as HTMLElement;
      if (passwordField) {
        passwordField.style.borderColor = 'red';
        errorContainer.style.display = 'flex';
        errorText.textContent = 'Invalid password';
      }

      return;
    }
    if (this.authState === AuthState.LOGIN && email && password) {
      this.setFormState(true);
      try {
        await loginUser(email, password);
        this.hide();
      } catch (error) {
        console.error('Failed to log in:', error);
        this.showError();
      }
      return this.setFormState(false);
    }

    if (this.authState === AuthState.SIGNUP && email && password && username) {
      this.setFormState(true);
      try {
        await signUpUser(username, email, password);
        this.hide();
      } catch (error) {
        console.error('Failed to sign up:', error);
        this.showError();
      }
      this.setFormState(false);
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

    if (errorContainer && errorText && this.authState === AuthState.LOGIN) {
      errorContainer.style.display = 'flex';
      errorText.textContent = 'Invalid email or password';

      inputFields.forEach((inputField) => {
        inputField.style.borderColor = 'red';
        inputField.value = '';
      });
    }

    if (errorContainer && errorText && this.authState === AuthState.SIGNUP) {
      errorContainer.style.display = 'flex';
      errorText.textContent = 'Incorrect email, username or password';

      inputFields.forEach((inputField) => {
        inputField.style.borderColor = 'red';
        inputField.value = '';
      });
    }
  }

  private authButtonText(): string {
    if (this.authState === AuthState.RESET_PASSWORD) return 'Reset password';
    if (this.authState === AuthState.FORGOT_PASSWORD)
      return 'Send reset password link';
    if (this.authState === AuthState.LOGIN) return 'Login';
    if (this.authState === AuthState.SIGNUP) return 'Sign up';
    if (this.authState === AuthState.FORGOT_PASSWORD_SUCCESS) return 'Resend';
    return '';
  }

  private secondaryAuthButtonText(): string {
    if (this.authState === AuthState.LOGIN) return 'Sign up';
    if (this.authState === AuthState.SIGNUP) return 'Login';
    if (
      this.authState === AuthState.FORGOT_PASSWORD ||
      this.authState === AuthState.FORGOT_PASSWORD_SUCCESS ||
      this.authState === AuthState.RESET_PASSWORD
    )
      return 'Login';
    return '';
  }

  private passwordValidationText(): string {
    // TODO: render password validation text
    return '';
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

        .modal__parent {
          width: 100%;
          height: 100%;
          position: fixed;
          top: 0;
          left: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 100;
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
          margin: 0 0 25px 0;
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
          cursor: pointer;
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
          cursor: pointer;
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
          display:4 none;
        }

        .close__container {
          display: flex;
          justify-content: flex-end;
        }

        .close__button {
          cursor: pointer;
          margin: 0;
          padding: 20px;
        }

        .forgot-password__container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 20px;
        }

        .forgot-caption {
          color: #acbcc0;
          font-family: 'Hind', sans-serif;
          font-weight: 400;
          font-style: normal;
          font-size: 14px;
          text-transform: none;
        }
      </style>

      <div class="modal__parent">
        <div class="modal__container">
          <div class="modal">
            <div class="close__container">
              <span class="close__button"
                ><svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.414 12L18.707 6.70695C19.098 6.31695 19.098 5.68301 18.707 5.29301C18.316 4.90201 17.684 4.90201 17.293 5.29301L12 10.586L6.70701 5.29301C6.31601 4.90201 5.68401 4.90201 5.29301 5.29301C4.90201 5.68301 4.90201 6.31695 5.29301 6.70695L10.586 12L5.29301 17.293C4.90201 17.683 4.90201 18.3169 5.29301 18.7069C5.48801 18.9019 5.74401 19 6.00001 19C6.25601 19 6.51201 18.9019 6.70701 18.7069L12 13.414L17.293 18.7069C17.488 18.9019 17.744 19 18 19C18.256 19 18.512 18.9019 18.707 18.7069C19.098 18.3169 19.098 17.683 18.707 17.293L13.414 12Z"
                    fill="#25314C"
                  />
                </svg>
              </span>
            </div>
            <div class="modal__header">
              <img class="modal__logo" src="/logos/temp_logo.png" alt="logo" />
              <div class="line"></div>
            </div>
            <div class="modal__body">
              <form class="modal__login-form">
                ${this.authState === AuthState.FORGOT_PASSWORD ||
                this.authState === AuthState.FORGOT_PASSWORD_SUCCESS
                  ? html`
                      <div class="forgot-password__container">
                        <div class="forgot-caption">
                          Enter your email to reset your password
                        </div>
                      </div>
                    `
                  : ''}
                ${this.authState === AuthState.SIGNUP
                  ? html`
                      <div class="">
                        <input
                          class="input_field"
                          type="text"
                          id="username"
                          name="username"
                          placeholder="Username"
                        />
                      </div>
                    `
                  : ''}
                ${this.authState !== AuthState.RESET_PASSWORD
                  ? html`
                      <div>
                        <input
                          class="input_field email_field"
                          type="text"
                          id="email"
                          name="email"
                          placeholder=${this.authState === AuthState.LOGIN
                            ? 'Email or username'
                            : 'Email'}
                        />
                      </div>
                    `
                  : ''}
                ${this.authState !== AuthState.FORGOT_PASSWORD &&
                this.authState !== AuthState.FORGOT_PASSWORD_SUCCESS
                  ? html`
                      <div>
                        <input
                          class="input_field password_field"
                          type="password"
                          id="password"
                          name="password"
                          placeholder="Password"
                        />
                      </div>
                    `
                  : ''}
                ${this.authState === AuthState.RESET_PASSWORD
                  ? html`
                      <div>
                        <input
                          class="input_field password_field"
                          type="password"
                          id="confirm_password"
                          name="confirm_password"
                          placeholder="Confirm Password"
                        />
                      </div>
                    `
                  : ''}
                ${this.authState === AuthState.SIGNUP
                  ? html` <div>${this.passwordValidationText()}</div> `
                  : ''}
                ${this.authState === AuthState.LOGIN
                  ? html`<div class="forgot-password">
                      <div>Forgot Password?</div>
                    </div>`
                  : ''}

                <div class="auth-form-error">
                  <span class="error-message"></span>
                </div>
                <button type="submit">
                  ${this.submitting
                    ? html`<loader-component></loader-component>`
                    : this.authButtonText()}
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
                <div class="modal__footer-button">
                  ${this.secondaryAuthButtonText()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('login-modal', LoginModal);
