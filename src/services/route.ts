export const BASE_URL = import.meta.env.VITE_API_URL;

export const getAllUsersAdminUrl = () => `${BASE_URL}/users/all`;
export const getUserByIdAdminUrl = (id: string) => `${BASE_URL}/users/${id}`;
export const signUpUserUrl = () => `${BASE_URL}/users/signup`;
export const loginUserUrl = () => `${BASE_URL}/users/login`;
export const getUserProfileUrl = () => `${BASE_URL}/users/me`;
export const updateUserProfileUrl = () => `${BASE_URL}/users/me`;

export const getAllChestsUrl = () => `${BASE_URL}/chests/all`;
export const openChestUrl = (userId: string) =>
  `${BASE_URL}/chests/${userId}/open`;
export const getUserChestInteractionsUrl = () =>
  `${BASE_URL}/chests/me/interactions`;

export const getUserPrizesWonUrl = () => `${BASE_URL}/prizes/me`;
export const getUserPrizesWonByIdUrl = () => `${BASE_URL}/prizes/me`;

export const savePrizeFulfillmentUrl = () => `${BASE_URL}/prizes/fulfillment`;
export const getPrizeFulfillmentIdUrl = (prizeId: string) =>
  `${BASE_URL}/prizes/${prizeId}/fulfillment`;

export const healthCheckUrl = () => `${BASE_URL}/health-check`;