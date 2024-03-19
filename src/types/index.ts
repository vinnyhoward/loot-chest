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

export interface ButtonProps {
  buttonTitle: string;
  buttonType: string;
  buttonColor: string;
  textColor: string;
  buttonAction: ((arg?: any) => void) | ((arg?: any) => Promise<void>);
  loading: boolean;
  disabled?: boolean;
}

export interface BrandButtonElement extends HTMLElement {
  buttonValues: ButtonProps;
}

export interface UserAuthStorage {
  id: string;
  lastCheckedTokenAward: string;
  email: string;
  username: string;
}

export interface Notification {
  title: string;
  message?: string;
  icon?: string;
  id: string;
  type: NotificationType;
  duration: Duration;
  currentDuration?: number;
  keyAmount?: number;
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
  prizeLogId: string;
  sanityRewardId: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  chestInteractions: UserChestInteraction[];
  prizeLogs: PrizeLog[];
  prizeFulfillments: PrizeFulfillment[];
  userKeys: UserKey[];
}

export interface UserKey {
  id: string;
  userId: string;
  awardedAt: Date;
  usedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  chestInteractions: UserChestInteraction[];
}

export interface UserChestInteraction {
  id: string;
  userId: string;
  userKeyId: string;
  sanityChestId?: string;
  openedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  userKey?: UserKey;
  prizeLogs: PrizeLog[];
}

export interface PrizeLog {
  id: string;
  userId: string;
  chestInteractionId: string;
  wonAt: Date;
  itemWon: string;
  sanityChestId: string;
  rollValue: number;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  chestInteraction: UserChestInteraction;
  prizeFulfillment?: PrizeFulfillment;
}

export interface PrizeFulfillment {
  id: string;
  sanityRewardId: string;
  prizeLogId: string;
  claimedAt: Date;
  claimed: boolean;
  userId: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  zip?: string;
  createdAt: Date;
  updatedAt: Date;
  cryptoWalletAddress?: string;
  user?: User;
  prizeLog?: PrizeLog;
}
