import gsap from 'gsap';
import { html } from '../../utils/html';
import { EVENTS } from '../../constants/events';
import { Notification, NotificationType, Duration } from '../../types';

const initialState: Notification = {
  title: '',
  message: '',
  icon: '',
  id: '',
  type: NotificationType.NONE,
  duration: Duration.NONE,
};

export class ToastNotifications extends HTMLElement {
  private _notification: Notification = initialState;
  private _updateProgressInterval: any;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._updateProgressInterval = null;
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

    if (!this.shadowRoot) return;

    const toast = this.shadowRoot.querySelector('.toast') as HTMLElement;
    const toastContainer = this.shadowRoot.querySelector(
      '.toast__container',
    ) as HTMLElement;
    gsap.to(toast, { duration: 0, x: 100, opacity: 0, display: 'none' });
    gsap.to(toastContainer, { duration: 0, opacity: 0, display: 'none' });

    document.addEventListener(EVENTS.TOAST_SUCCESS, (event: any) => {
      this._notification = event.detail;

      this.show();
      this.render();
      this.attachEventListeners();
    });
  }

  attachEventListeners(): void {
    if (!this.shadowRoot) return;
    const closeIcon = this.shadowRoot.querySelector(
      '.toast__close-icon',
    ) as HTMLElement;
    if (closeIcon) {
      closeIcon.addEventListener('click', this.hide.bind(this));
    }
  }

  hideWithDelay(): void {
    if (!this.shadowRoot) return;
    clearInterval(this._updateProgressInterval);
    const toast = this.shadowRoot.querySelector('.toast') as HTMLElement;
    const toastContainer = this.shadowRoot.querySelector(
      '.toast__container',
    ) as HTMLElement;

    gsap.to(toast, {
      duration: 0.2,
      delay: 0.5,
      x: 100,
      opacity: 0,
      display: 'none',
    });

    gsap.to(toastContainer, {
      duration: 0.2,
      delay: 0.5,
      opacity: 0,
      display: 'none',
    });

    this._notification = initialState;
  }

  hide(): void {
    if (!this.shadowRoot) return;
    clearInterval(this._updateProgressInterval);
    const toast = this.shadowRoot.querySelector('.toast') as HTMLElement;
    const toastContainer = this.shadowRoot.querySelector(
      '.toast__container',
    ) as HTMLElement;
    gsap.to(toast, {
      duration: 0.2,
      x: 100,
      opacity: 0,
      display: 'none',
    });
    gsap.to(toastContainer, {
      duration: 0.2,
      opacity: 0,
      display: 'none',
    });
    this._notification = initialState;
  }

  show(): void {
    if (!this.shadowRoot) return;
    const toast = this.shadowRoot.querySelector('.toast') as HTMLElement;

    // Ensure toast is initially off-screen to the left
    gsap.set(toast, { x: '-100%', opacity: 0 });

    // Animate toast coming in from the left
    gsap.to(toast, {
      x: '0%',
      opacity: 1,
      duration: 0.5,
      ease: 'power1.out',
      onComplete: () => console.log('Toast animation complete'),
    });

    this.hideAfterDuration();
  }

  hideAfterDuration(): void {
    if (this._notification.duration === Duration.NONE) return;

    const totalDuration = this._notification.duration;
    let elapsed = 0;

    this._updateProgressInterval = setInterval(() => {
      elapsed += 100;
      const progressRatio = elapsed / totalDuration;

      this.updateLoadingBar(progressRatio);

      if (elapsed >= totalDuration) {
        clearInterval(this._updateProgressInterval);
        this.hideWithDelay();
      }
    }, 100);
  }

  updateLoadingBar(progressRatio: number): void {
    if (!this.shadowRoot) return;
    const progressBar = this.shadowRoot.querySelector('.toast__progress-bar');
    switch (this._notification.type) {
      case NotificationType.SUCCESS:
        progressBar?.classList.add('success');
        break;
      case NotificationType.ERROR:
        progressBar?.classList.add('error');
        break;
      case NotificationType.WARNING:
        progressBar?.classList.add('warning');
        break;
      case NotificationType.INFO:
        progressBar?.classList.add('info');
        break;
      default:
        progressBar?.classList.add('custom');
    }
    const width = Math.max(0, Math.min(100, progressRatio * 100));
    if (progressBar) {
      gsap.to(progressBar, { width: `${width}%` });
    }
  }

  iconType(): string {
    switch (this._notification.type) {
      case NotificationType.SUCCESS:
        return '/icons/svg/success.svg';
      case NotificationType.ERROR:
        return '/icons/svg/error.svg';
      case NotificationType.WARNING:
        return '/icons/svg/warning.svg';
      case NotificationType.INFO:
        return '/icons/svg/info.svg';
      default:
        return '/icons/svg/question.svg';
    }
  }

  render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = html`
      <style>
        {
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Hind:wght@300;400;500;600;700&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          -ms-overflow-style: none;
          scrollbar-width: none;
          overflow-y: hidden;
        }

        .toast__container {
          cursor: pointer;
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }

        .toast {
          background-color: white;
          border-radius: 16px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          width: 375px;
          min-height: 70px;
          padding: 10px 20px;
          position: relative;
          overflow: hidden;
        }

        .toast_body {
          display: flex;
          flex-direction: column;
          padding: 5px 10px;
        }

        .toast-content {
          display: flex;
          flex-direction: row;
          align-items: center;
        }

        .toast__title {
          font-family: 'Montserrat', sans-serif;
          font-weight: 900;
          font-size: 1rem;
          color: #25314c;
          margin-bottom: 2px;
        }

        .toast__caption {
          font-size: 0.9rem;
          color: #acbcc0;
          font-family: 'Hind', sans-serif;
          font-weight: 500;
          font-style: normal;
        }

        .toast__icon {
          margin-right: 10px;
        }

        .toast__progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2.5px;
          width: 0%;
        }

        .success {
          background-color: #00cf08;
        }

        .error {
          background-color: #e93434;
        }

        .warning {
          background-color: #f3d221;
        }

        .info {
          background-color: #3ab4e8;
        }

        .custom {
          background-color: #00b4ff;
        }
      </style>
      <div class="toast__container">
        <div class="toast">
          <div class="toast-content">
            <div class="toast__icon">
              <img src=${this.iconType()} alt="icon" />
            </div>
            <div class="toast_body">
              <h3 class="toast__title">${this._notification.title}</h3>
              <p class="toast__caption">${this._notification.message}</p>
            </div>
          </div>
          <div class="toast__close-icon">
            <img src="/icons/svg/close.svg" alt="icon" />
          </div>

          <div class="toast__progress-bar"></div>
        </div>
      </div>
    `;
  }
}

customElements.define('toast-notification', ToastNotifications);
