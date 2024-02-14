export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  NONE = 'none',
}

export enum Duration {
  NONE = 0,
  SHORT = 2000,
  MEDIUM = 4000,
  LONG = 6000,
}

export interface Notification {
  title: string;
  message?: string;
  icon?: string;
  id: string;
  type: NotificationType;
  duration: Duration;
  currentDuration?: number;
}
