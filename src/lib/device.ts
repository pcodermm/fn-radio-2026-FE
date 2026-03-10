import { env } from './env';
import { getStoredDeviceId, setStoredDeviceId } from './storage';

function generateDeviceId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `web-${crypto.randomUUID()}`;
  }

  return `web-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function getBrowserName(userAgent: string): string {
  if (/Edg\//i.test(userAgent)) {
    return 'Edge';
  }

  if (/Chrome\//i.test(userAgent) && !/Edg\//i.test(userAgent)) {
    return 'Chrome';
  }

  if (/Firefox\//i.test(userAgent)) {
    return 'Firefox';
  }

  if (/Safari\//i.test(userAgent) && !/Chrome\//i.test(userAgent)) {
    return 'Safari';
  }

  return 'Browser';
}

function getOsName(userAgent: string): string {
  if (/Windows/i.test(userAgent)) {
    return 'Windows';
  }

  if (/Mac OS X/i.test(userAgent)) {
    return 'macOS';
  }

  if (/Android/i.test(userAgent)) {
    return 'Android';
  }

  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return 'iOS';
  }

  if (/Linux/i.test(userAgent)) {
    return 'Linux';
  }

  return 'Unknown OS';
}

export function getOrCreateDeviceId(): string {
  const existingDeviceId = getStoredDeviceId();

  if (existingDeviceId) {
    return existingDeviceId;
  }

  const nextDeviceId = generateDeviceId();
  setStoredDeviceId(nextDeviceId);

  return nextDeviceId;
}

export function getPlatform(): 'web' {
  return 'web';
}

export function getDeviceName(): string {
  if (typeof navigator === 'undefined') {
    return 'Browser on Unknown OS';
  }

  const browser = getBrowserName(navigator.userAgent);
  const os = getOsName(navigator.userAgent);

  return `${browser} on ${os}`;
}

export function getAppVersion(): string {
  return env.appVersion;
}
