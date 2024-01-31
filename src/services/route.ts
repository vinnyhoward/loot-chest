const BASE_URL = import.meta.env.VITE_API_URL;

const getAllUsersAdmin = () => `${BASE_URL}/users/all`;
const getUserByIdAdmin = (id: string) => `${BASE_URL}/users/${id}`;
const signUpUser = () => `${BASE_URL}/users/signup`;
const loginUser = () => `${BASE_URL}/users/login`;
const getUserProfile = () => `${BASE_URL}/users/me`;
const updateUserProfile = () => `${BASE_URL}/users/me`;

const getAllChests = () => `${BASE_URL}/chests/all`;
const openChest = (userId: string) => `${BASE_URL}/chests/${userId}/open`;
const getUserChestInteractions = () => `${BASE_URL}/chests/me/interactions`;

const getUserPrizesWon = () => `${BASE_URL}/prizes/me`;
const getUserPrizesWonById = () => `${BASE_URL}/prizes/me`;

const savePrizeFulfillment = () => `${BASE_URL}/prizes/fulfillment`;
const getPrizeFulfillmentId = (prizeId: string) =>
  `${BASE_URL}/prizes/${prizeId}/fulfillment`;

const healthCheck = () => `${BASE_URL}/health-check`;
