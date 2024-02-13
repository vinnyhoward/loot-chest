import gsap from 'gsap';
import { html } from '../../utils/html';
import { urlFor } from '../../services/sanity';

enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  NONE = 'none',
}

enum Duration {
  NONE = 0,
  SHORT = 2000,
  MEDIUM = 4000,
  LONG = 6000,
}

interface Notification {
  title: string;
  message: string;
  icon: string;
  id: string;
  type: NotificationType;
  duration: Duration;
}

export class ToastNotifications extends HTMLElement {
  private _notification: Notification = {
    title: '',
    message: '',
    icon: '',
    id: '',
    type: NotificationType.NONE,
    duration: Duration.NONE,
  };

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set notification(data: Notification) {
    this._notification = data;
    this.render();
    this.attachEventListeners();
  }

  get notification(): Notification {
    return this._notification;
  }

  connectedCallback(): void {
    this.render();
    this.attachEventListeners();
  }

  attachEventListeners(): void {}

  render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = html`
      <style>
        {
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
        }

        .toast__container {
          cursor: pointer;
            position: absolute;
            top: 90%;
            left: 75%;
          opacity: 1;
        }

        .toast {
          background-color: white;
          border-radius: 16px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: center;
          align-items: center;
          width: 300px;
          height: 60px;
        }
      </style>
      <div class="toast__container">
        <div class="toast">
          <h3>${this._notification.title}</h3>
          <p>${this._notification.message}</p>
        </div>
      </div>
    `;
  }
}

customElements.define('toast-notification', ToastNotifications);

// <div class="toast__icon">
// <img src="${urlFor(this._notification.icon).url()}" alt="icon" />
// </div>
