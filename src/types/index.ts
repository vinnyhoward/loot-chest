export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  AWARDED = 'AWARDED',
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

export interface UserLocalStorage {
  id: string;
  username: string;
  email: string;
}

export interface Keys {
  id: string;
  userId: string;
  awardedAt: Date;
  usedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrizeFields {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  zip?: string;
  cryptoWalletAddress?: string;
}
