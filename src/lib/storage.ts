import type { User } from '../types/auth';

const AUTH_TOKEN_KEY = 'fnr_token';
const AUTH_USER_KEY = 'fnr_user';
const DEVICE_ID_KEY = 'fnr_device_id';

const storage = {
  getItem(key: string) {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem(key);
  },
  setItem(key: string, value: string) {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(key, value);
  },
  removeItem(key: string) {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(key);
  },
};

export function getStoredToken(): string | null {
  return storage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  storage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  storage.removeItem(AUTH_TOKEN_KEY);
}

export function getStoredUser(): User | null {
  const rawUser = storage.getItem(AUTH_USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as User;
  } catch {
    storage.removeItem(AUTH_USER_KEY);
    return null;
  }
}

export function setStoredUser(user: User): void {
  storage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearStoredUser(): void {
  storage.removeItem(AUTH_USER_KEY);
}

export function clearStoredAuth(): void {
  clearStoredToken();
  clearStoredUser();
}

export function getStoredDeviceId(): string | null {
  return storage.getItem(DEVICE_ID_KEY);
}

export function setStoredDeviceId(deviceId: string): void {
  storage.setItem(DEVICE_ID_KEY, deviceId);
}
