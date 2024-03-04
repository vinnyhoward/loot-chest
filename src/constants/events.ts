export const EVENTS: Record<string, string> = {
  // General UI Events
  HIDE_UI: 'hide-ui',
  SHOW_UI: 'show-ui',

  // Menu Events
  FIRST_SHOW_MENU: 'show-menu',
  SHOW_MENU: 'show-menu',
  HIDE_MENU: 'hide-menu',

  // Login Menu Events
  SHOW_LOGIN_MENU: 'show-login-menu',
  HIDE_LOGIN_MENU: 'hide-login-menu',

  // Side Menu Events
  SHOW_SIDE_MENU: 'show-side-menu',
  HIDE_SIDE_MENU: 'hide-side-menu',

  // Loading Events
  SHOW_LOADING: 'show-loading',
  HIDE_LOADING: 'hide-loading',
  LOADING_PROGRESS: 'loading-progress',

  // Login Events
  LOGIN_SUCCESS: 'login-success',
  LOGIN_FAILURE: 'login-failure',
  LOGOUT: 'logout',
  LOGIN_LOADING: 'login-loading',

  // Assets Events
  ASSETS_LOADING: 'assets-loading',
  ASSETS_LOADING_FAILURE: 'assets-loading-failure',
  ASSETS_LOADING_SUCCESS: 'assets-loading-success',

  // Toast Events
  TOAST_SUCCESS: 'toast-success',
  TOAST_ERROR: 'toast-error',
  TOAST_INFO: 'toast-info',
  TOAST_WARNING: 'toast-warning',
  TOAST_AWARDED_KEY: 'toast-awarded-key',

  // Chest Events
  CHEST_SELECTED: 'chest-selected',
  CHEST_POINTS_UPDATED: 'chest-points-updated',

  // Chest Info Button Events
  CHEST_INFO_BUTTON_CLICKED: 'chest-info-button-clicked',

  // Reward Modal Events
  SHOW_REWARD_MODAL: 'show-reward-modal',
  HIDE_REWARD_MODAL: 'hide-reward-modal',

  // Failure Modal Events
  SHOW_FAILURE_MODAL: 'show-failure-modal',
  HIDE_FAILURE_MODAL: 'hide-failure-modal',

  // Claim Reward Events
  CLAIMING_REWARD: 'claiming-reward',
  CLAIMED_REWARD: 'claimed-reward',
};
