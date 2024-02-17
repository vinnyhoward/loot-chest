import { awardKeyUrl, fetchUserKeysUrl } from '../api/index';
import { UserLocalStorage } from '../types/index';

export const awardKey = async () => {
  try {
    const stringifiedUser: string | null = localStorage.getItem('user_auth');
    const token = localStorage.getItem('token');

    if (!stringifiedUser || !token) {
      throw new Error('User not found');
    }

    const user: UserLocalStorage = JSON.parse(stringifiedUser);
    const userId = user.id;
    const response = await fetch(awardKeyUrl(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
        userId,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const keys = await response.json();
    return keys.awarded;
  } catch (error) {
    console.error('Failed to award user keys:', error);
  }
};

export const fetchUserKeys = async () => {
  try {
    const stringifiedUser: string | null = localStorage.getItem('user_auth');
    const token = localStorage.getItem('token');

    if (!stringifiedUser || !token) {
      throw new Error('User not found');
    }

    const user: UserLocalStorage = JSON.parse(stringifiedUser);
    const userId = user.id;
    const response = await fetch(fetchUserKeysUrl(userId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const keys = await response.json();
    return keys.data;
  } catch (error) {
    console.error("Failed to fetch user's keys:", error);
  }
};
