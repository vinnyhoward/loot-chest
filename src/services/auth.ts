import { v4 as uuidv4 } from 'uuid';
import {
  loginUserUrl,
  signUpUserUrl,
  forgotPasswordUrl,
  resetPasswordUrl,
} from '../api';
import { Notification, NotificationType, Duration } from '../types';
import { EVENTS } from '../constants/events';

export const loginUser = async (
  email: FormDataEntryValue,
  password: FormDataEntryValue,
) => {
  const response = await fetch(loginUserUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const user = await response.json();

  if (user.success && user.token) {
    localStorage.setItem('token', user.token);
    localStorage.setItem('user_auth', JSON.stringify(user.data));

    const detail: Notification = {
      title: 'Logged in successfully',
      message: 'Welcome back',
      id: uuidv4(),
      type: NotificationType.SUCCESS,
      duration: Duration.LONG,
    };

    document.dispatchEvent(
      new CustomEvent(EVENTS.TOAST_SUCCESS, {
        bubbles: true,
        composed: true,
        detail,
      }),
    );
  } else {
    console.error('Log In failed:', user.message);
  }
};

export const signUpUser = async (
  username: FormDataEntryValue,
  email: FormDataEntryValue,
  password: FormDataEntryValue,
) => {
  const response = await fetch(signUpUserUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const user = await response.json();

  if (user.success && user.token) {
    localStorage.setItem('token', user.token);
    localStorage.setItem('user_auth', JSON.stringify(user.data));

    const detail: Notification = {
      title: 'Signed up successfully',
      message: 'Welcome to the community',
      id: uuidv4(),
      type: NotificationType.SUCCESS,
      duration: Duration.LONG,
    };

    document.dispatchEvent(
      new CustomEvent(EVENTS.TOAST_SUCCESS, {
        bubbles: true,
        composed: true,
        detail,
      }),
    );
  } else {
    console.error('Sign Up failed:', user.message);
  }
};

export const forgotPassword = async (email: FormDataEntryValue) => {
  const response = await fetch(forgotPasswordUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  if (response.status === 200) {
    const detail: Notification = {
      title: 'Password reset link sent',
      message: 'Check your email',
      id: uuidv4(),
      type: NotificationType.SUCCESS,
      duration: Duration.LONG,
    };

    document.dispatchEvent(
      new CustomEvent(EVENTS.TOAST_SUCCESS, {
        bubbles: true,
        composed: true,
        detail,
      }),
    );
  }
};

export const resetPassword = async (
  password: FormDataEntryValue,
  token: FormDataEntryValue,
) => {
  const response = await fetch(resetPasswordUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password, token }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  if (response.status === 200) {
    const detail: Notification = {
      title: 'Password reset successfully',
      message: 'Password reset successfully',
      id: uuidv4(),
      type: NotificationType.SUCCESS,
      duration: Duration.LONG,
    };
    document.dispatchEvent(
      new CustomEvent(EVENTS.TOAST_SUCCESS, {
        bubbles: true,
        composed: true,
        detail,
      }),
    );
  }
};
