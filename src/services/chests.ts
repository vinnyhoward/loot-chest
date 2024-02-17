import { getAllChestsUrl } from '../api/index';

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
