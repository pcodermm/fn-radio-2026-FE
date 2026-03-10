import axios, { AxiosResponse } from 'axios';

import { getAppVersion, getOrCreateDeviceId, getPlatform } from '../lib/device';
import { createAppError, normalizeApiError } from '../lib/errors';
import { emitUnauthorized } from '../lib/auth-events';
import { env } from '../lib/env';
import { getStoredToken } from '../lib/storage';
import type { ApiErrorResponse, ApiSuccessResponse, PaginationMeta } from '../types/api';

export interface UnwrappedResponse<T> {
  data: T;
  message: string;
  meta?: PaginationMeta;
}

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  config.headers.Accept = 'application/json';

  if (config.requiresAuth) {
    const token = getStoredToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers['X-Device-Id'] = getOrCreateDeviceId();
    config.headers['X-App-Platform'] = getPlatform();
    config.headers['X-App-Version'] = getAppVersion();
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = normalizeApiError(error);

    if (normalizedError.isUnauthorized) {
      emitUnauthorized();
    }

    return Promise.reject(normalizedError);
  }
);

export function unwrapResponse<T>(
  response: AxiosResponse<ApiSuccessResponse<T> | ApiErrorResponse>
): UnwrappedResponse<T> {
  const payload = response.data;

  if (!payload.success) {
    throw createAppError({
      message: payload.message,
      status: response.status,
      errors: payload.errors,
    });
  }

  return {
    data: payload.data,
    message: payload.message,
    meta: payload.meta,
  };
}
