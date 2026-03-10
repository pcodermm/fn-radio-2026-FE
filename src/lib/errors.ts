import axios, { AxiosError } from 'axios';

import type { ApiErrorResponse, ValidationErrors } from '../types/api';

export interface AppError {
  name: 'AppError';
  message: string;
  status?: number;
  errors?: ValidationErrors;
  isValidationError: boolean;
  isUnauthorized: boolean;
  isForbidden: boolean;
}

interface CreateAppErrorInput {
  message: string;
  status?: number;
  errors?: ValidationErrors;
}

function isApiErrorResponse(payload: unknown): payload is ApiErrorResponse {
  return Boolean(
    payload &&
      typeof payload === 'object' &&
      'success' in payload &&
      (payload as ApiErrorResponse).success === false &&
      'message' in payload
  );
}

export function createAppError({
  message,
  status,
  errors,
}: CreateAppErrorInput): AppError {
  return {
    name: 'AppError',
    message,
    status,
    errors,
    isValidationError: status === 422 && Boolean(errors),
    isUnauthorized: status === 401,
    isForbidden: status === 403,
  };
}

export function normalizeApiError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const payload = axiosError.response?.data;
    const message =
      payload?.message ||
      (axiosError.code === 'ERR_NETWORK'
        ? 'Unable to reach the FN Radio API.'
        : 'Request failed.');

    return createAppError({
      message,
      status: axiosError.response?.status,
      errors: payload?.errors,
    });
  }

  if (isApiErrorResponse(error)) {
    return createAppError({
      message: error.message,
      errors: error.errors,
    });
  }

  if (error instanceof Error) {
    return createAppError({ message: error.message });
  }

  return createAppError({ message: 'An unexpected error occurred.' });
}

export function isAppError(error: unknown): error is AppError {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'name' in error &&
      (error as AppError).name === 'AppError'
  );
}

export function flattenValidationErrors(errors?: ValidationErrors): string[] {
  if (!errors) {
    return [];
  }

  return Object.values(errors).flat();
}
