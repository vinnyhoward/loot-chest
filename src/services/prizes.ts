import {
  savePrizeFulfillmentUrl,
  getAllPrizesUrl,
  getUserPrizesUrl,
} from '../api/index';
import { UserAuthStorage, PrizeFields } from '../types/index';

export const savePrize = async (body: PrizeFields) => {
  try {
    const stringifiedUser: string | null = localStorage.getItem('user_auth');
    const token = localStorage.getItem('token');

    if (!stringifiedUser || !token) {
      throw new Error('User not found');
    }

    const user: UserAuthStorage = JSON.parse(stringifiedUser);
    const userId = user.id;
    const response = await fetch(savePrizeFulfillmentUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
        userId,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const prizeFulfilled = await response.json();
    return prizeFulfilled.data;
  } catch (error) {
    console.error('Failed save user`s information:', error);
  }
};

export const fetchAllPrizes = async (page: number, limit: number) => {
  try {
    const response = await fetch(
      getAllPrizesUrl(page.toString(), limit.toString()),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const prizes = await response.json();
    return prizes.data;
  } catch (error) {
    console.error('Failed fetch all prizes:', error);
  }
};

export const fetchUserPrizes = async () => {
  const stringifiedUser: string | null = localStorage.getItem('user_auth');
  const token = localStorage.getItem('token');

  if (!stringifiedUser || !token) {
    throw new Error('User not found');
  }

  try {
    const response = await fetch(getUserPrizesUrl(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const prizes = await response.json();
    return prizes.data;
  } catch (error) {
    console.error('Failed fetch user prizes:', error);
  }
};
