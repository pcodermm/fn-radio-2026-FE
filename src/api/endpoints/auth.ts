import { apiClient, unwrapResponse } from '../client';
import { getAppVersion, getDeviceName, getOrCreateDeviceId, getPlatform } from '../../lib/device';
import type { ApiSuccessResponse } from '../../types/api';
import type {
  AuthTokenData,
  LoginRequest,
  RegisterRequest,
  User,
} from '../../types/auth';

function getTrustedDevicePayload() {
  return {
    device_id: getOrCreateDeviceId(),
    device_name: getDeviceName(),
    platform: getPlatform(),
    app_version: getAppVersion(),
  };
}

export const authApi = {
  async register(payload: RegisterRequest): Promise<AuthTokenData> {
    const response = await apiClient.post<ApiSuccessResponse<AuthTokenData>>(
      '/auth/register',
      {
        ...payload,
        ...getTrustedDevicePayload(),
      }
    );

    return unwrapResponse(response).data;
  },

  async login(payload: LoginRequest): Promise<AuthTokenData> {
    const response = await apiClient.post<ApiSuccessResponse<AuthTokenData>>(
      '/auth/login',
      {
        ...payload,
        ...getTrustedDevicePayload(),
      }
    );

    return unwrapResponse(response).data;
  },

  async me(): Promise<User> {
    const response = await apiClient.get<ApiSuccessResponse<User>>('/auth/me', {
      requiresAuth: true,
    });

    return unwrapResponse(response).data;
  },

  async logout(): Promise<void> {
    const response = await apiClient.post<ApiSuccessResponse<null>>(
      '/auth/logout',
      undefined,
      {
        requiresAuth: true,
      }
    );

    unwrapResponse(response);
  },
};
