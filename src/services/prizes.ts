import { savePrizeFulfillmentUrl } from '../api/index';
import { UserLocalStorage, PrizeFields } from '../types/index';

export const savePrize = async (body: PrizeFields) => {
  try {
    const stringifiedUser: string | null = localStorage.getItem('user_auth');
    const token = localStorage.getItem('token');

    if (!stringifiedUser || !token) {
      throw new Error('User not found');
    }

    const user: UserLocalStorage = JSON.parse(stringifiedUser);
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
