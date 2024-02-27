import { getAllChestsUrl, openChestUrl } from '../api/index';
import { UserLocalStorage } from '../types/index';

export const fetchAssets = async () => {
  try {
    const response = await fetch(getAllChestsUrl());

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const chests = await response.json();
    return chests.data;
  } catch (error) {
    console.error('Failed to fetch chests:', error);
  }
};

export const openChest = async (chestId: string, keyId: string) => {
  try {
    const stringifiedUser: string | null = localStorage.getItem('user_auth');
    const token = localStorage.getItem('token');

    if (!stringifiedUser || !token) {
      throw new Error('User not found');
    }
    const user: UserLocalStorage = JSON.parse(stringifiedUser);
    const userId = user.id;
    const response = await fetch(openChestUrl(chestId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, keyId }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const chest = await response.json();
    return chest.data;
  } catch (error) {
    console.error('Failed to open chest:', error);
    return null;
  }
};
